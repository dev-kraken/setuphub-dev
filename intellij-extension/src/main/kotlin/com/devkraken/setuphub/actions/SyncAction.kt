package com.devkraken.setuphub.actions

import com.devkraken.setuphub.services.ApiService
import com.devkraken.setuphub.services.AuthService
import com.devkraken.setuphub.services.ExistingSetup
import com.devkraken.setuphub.services.SetupService
import com.devkraken.setuphub.ui.Notifications
import com.intellij.ide.BrowserUtil
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.diagnostic.Logger
import com.intellij.openapi.progress.ProgressIndicator
import com.intellij.openapi.progress.ProgressManager
import com.intellij.openapi.progress.Task
import com.intellij.openapi.ui.DialogWrapper
import com.intellij.openapi.ui.Messages
import com.intellij.ui.components.JBCheckBox
import com.intellij.ui.components.JBTextField
import com.intellij.util.ui.FormBuilder
import java.awt.Dimension
import java.awt.datatransfer.StringSelection
import javax.swing.JComponent
import javax.swing.JTextArea

/**
 * Action for syncing the user's IDE setup to SetupHub.
 */
class SyncAction : AnAction() {

    companion object {
        private val LOG = Logger.getInstance(SyncAction::class.java)
        private const val MAX_NAME_LENGTH = 100
    }
    
    override fun update(e: AnActionEvent) {
        val authService = AuthService.getInstance()
        val isAuthenticated = authService.isAuthenticated()
        
        e.presentation.isEnabled = isAuthenticated
        e.presentation.text = if (isAuthenticated) "Sync Setup" else "Sync Setup (Login required)"
    }

    override fun actionPerformed(e: AnActionEvent) {
        performSync(e)
    }

    /**
     * Runs the sync flow. Call this instead of invoking actionPerformed (override-only API).
     */
    fun performSync(e: AnActionEvent) {
        val project = e.project
        val authService = AuthService.getInstance()
        val setupService = SetupService.getInstance()
        val apiService = ApiService.getInstance()

        // Check authentication
        if (!authService.isAuthenticated()) {
            val login = Messages.showYesNoDialog(
                project,
                "Please login first to sync your setup.",
                "Login Required",
                "Login Now",
                "Cancel",
                Messages.getWarningIcon()
            )
            if (login == Messages.YES) {
                LoginAction().performLogin(e)
            }
            return
        }

        val token = authService.getToken()
        if (token.isNullOrBlank()) {
            Notifications.showError(project, "Authentication Error", "Token not found. Please login again.")
            return
        }

        val editorDisplayName = setupService.getEditorDisplayName()

        runSyncFlow(e, project, setupService, apiService, editorDisplayName, token)
    }

    private fun runSyncFlow(
        e: AnActionEvent,
        project: com.intellij.openapi.project.Project?,
        setupService: SetupService,
        apiService: ApiService,
        editorDisplayName: String,
        token: String
    ) {
        val editorName = setupService.getEditorName()

        // Check for existing setup in background first
        ProgressManager.getInstance().run(object : Task.Backgroundable(project, "Checking existing setup...") {
            private var existingSetup: ExistingSetup? = null

            override fun run(indicator: ProgressIndicator) {
                try {
                    existingSetup = apiService.getExistingSetup(token, editorName)
                } catch (ex: Exception) {
                    // Non-fatal: just proceed without existing setup info
                    LOG.info("Could not fetch existing setup: ${ex.message}")
                }
            }

            override fun onSuccess() {
                showSetupDialog(e, existingSetup, editorDisplayName, token)
            }

            override fun onThrowable(error: Throwable) {
                LOG.warn("Error checking existing setup", error)
                showSetupDialog(e, null, editorDisplayName, token)
            }
        })
    }

    private fun showSetupDialog(
        e: AnActionEvent, 
        existingSetup: ExistingSetup?, 
        editorDisplayName: String,
        token: String
    ) {
        val project = e.project
        val setupService = SetupService.getInstance()
        val apiService = ApiService.getInstance()

        val isUpdate = existingSetup != null
        val dialogTitle = if (isUpdate) "Update Setup" else "Sync Setup"
        
        // Create and show dialog
        val dialog = SetupDialog(
            title = dialogTitle,
            defaultName = existingSetup?.name ?: "My $editorDisplayName Setup",
            defaultDescription = existingSetup?.description ?: "",
            isUpdate = isUpdate
        )

        if (!dialog.showAndGet()) {
            return // User cancelled
        }

        val name = dialog.nameField.text.trim()
        val description = dialog.descriptionArea.text.trim().takeIf { it.isNotEmpty() }
        val isPublic = dialog.publicCheckbox.isSelected

        // Validate input
        if (name.isEmpty()) {
            Notifications.showError(project, "Invalid Input", "Setup name is required.")
            return
        }

        if (name.length > MAX_NAME_LENGTH) {
            Notifications.showError(project, "Invalid Input", "Setup name must be less than $MAX_NAME_LENGTH characters.")
            return
        }

        // Perform sync
        val actionVerb = if (isUpdate) "Updating" else "Syncing"
        ProgressManager.getInstance().run(object : Task.Backgroundable(project, "$actionVerb your setup...", true) {
            override fun run(indicator: ProgressIndicator) {
                try {
                    indicator.text = "Collecting setup data..."
                    indicator.fraction = 0.2
                    
                    val setup = setupService.collectSetup(name, description, isPublic)
                    LOG.info("Collected setup with ${setup.extensions.size} plugins")
                    
                    indicator.text = "Uploading to SetupHub..."
                    indicator.fraction = 0.6
                    
                    val response = apiService.syncSetup(setup, token)
                    
                    indicator.text = "Done!"
                    indicator.fraction = 1.0
                    
                    // Show success on EDT
                    ApplicationManager.getApplication().invokeLater {
                        showSuccessDialog(project, isUpdate, response.shareUrl)
                    }
                    
                } catch (ex: Exception) {
                    LOG.warn("Sync failed", ex)
                    ApplicationManager.getApplication().invokeLater {
                        Notifications.showError(
                            project, 
                            "Sync Failed", 
                            ex.message ?: "An unexpected error occurred. Please try again."
                        )
                    }
                }
            }
        })
    }

    private fun showSuccessDialog(project: com.intellij.openapi.project.Project?, isUpdate: Boolean, shareUrl: String) {
        val message = if (isUpdate) "Setup updated successfully!" else "Setup synced successfully!"
        
        val result = Messages.showDialog(
            project,
            "$message\n\nShare URL: $shareUrl",
            "Success",
            arrayOf("Open in Browser", "Copy Link", "Close"),
            0,
            Messages.getInformationIcon()
        )
        
        when (result) {
            0 -> BrowserUtil.browse(shareUrl)
            1 -> {
                val clipboard = java.awt.Toolkit.getDefaultToolkit().systemClipboard
                clipboard.setContents(StringSelection(shareUrl), null)
                Notifications.showInfo(project, "Copied", "Link copied to clipboard!")
            }
        }
    }

    /**
     * Dialog for collecting setup metadata.
     */
    private class SetupDialog(
        title: String,
        defaultName: String,
        defaultDescription: String,
        isUpdate: Boolean
    ) : DialogWrapper(true) {
        
        val nameField = JBTextField(defaultName)
        val descriptionArea = JTextArea(defaultDescription, 3, 40)
        val publicCheckbox = JBCheckBox("Make this setup public", true)

        init {
            this.title = title
            setOKButtonText(if (isUpdate) "Update" else "Sync")
            init()
        }

        override fun createCenterPanel(): JComponent {
            descriptionArea.lineWrap = true
            descriptionArea.wrapStyleWord = true

            val panel = FormBuilder.createFormBuilder()
                .addLabeledComponent("Name:", nameField)
                .addLabeledComponent("Description:", descriptionArea)
                .addComponent(publicCheckbox)
                .panel

            panel.preferredSize = Dimension(400, 180)
            return panel
        }

        override fun getPreferredFocusedComponent(): JComponent = nameField
    }
}
