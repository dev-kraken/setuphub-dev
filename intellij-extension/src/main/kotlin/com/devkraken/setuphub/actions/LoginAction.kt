package com.devkraken.setuphub.actions

import com.devkraken.setuphub.services.ApiService
import com.devkraken.setuphub.services.AuthService
import com.devkraken.setuphub.ui.Notifications
import com.intellij.ide.BrowserUtil
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.diagnostic.Logger
import com.intellij.openapi.progress.ProgressIndicator
import com.intellij.openapi.progress.ProgressManager
import com.intellij.openapi.progress.Task
import com.intellij.openapi.ui.Messages

/**
 * Action for logging into SetupHub with a Personal Access Token.
 */
class LoginAction : AnAction() {

    companion object {
        private val LOG = Logger.getInstance(LoginAction::class.java)
        private const val MIN_TOKEN_LENGTH = 10
    }
    
    override fun update(e: AnActionEvent) {
        val authService = AuthService.getInstance()
        val isAuthenticated = authService.isAuthenticated()
        
        e.presentation.isEnabled = !isAuthenticated
        e.presentation.text = if (isAuthenticated) "Login (Already logged in)" else "Login"
    }

    override fun actionPerformed(e: AnActionEvent) {
        performLogin(e)
    }

    /**
     * Runs the login flow. Call this instead of invoking actionPerformed (override-only API).
     */
    fun performLogin(e: AnActionEvent) {
        val project = e.project
        val authService = AuthService.getInstance()
        val apiService = ApiService.getInstance()

        // Check if already authenticated
        if (authService.isAuthenticated()) {
            val currentUser = authService.getDisplayNameOrUsername() ?: "User"
            val result = Messages.showYesNoDialog(
                project,
                "You are already logged in as $currentUser.\n\nDo you want to change your token?",
                "SetupHub Login",
                "Change Token",
                "Cancel",
                Messages.getQuestionIcon()
            )
            if (result != Messages.YES) {
                return
            }
        }

        // Option to open dashboard first
        val openDashboard = Messages.showYesNoDialog(
            project,
            "You need a Personal Access Token from SetupHub to login.\n\nWould you like to open the dashboard to get your token?",
            "SetupHub Login",
            "Open Dashboard",
            "I Have My Token",
            Messages.getQuestionIcon()
        )

        if (openDashboard == Messages.YES) {
            BrowserUtil.browse(apiService.getAuthUrl())
        }

        // Prompt for token
        val tokenInput = Messages.showInputDialog(
            project,
            "Paste your Personal Access Token (PAT) from SetupHub:",
            "SetupHub Login",
            Messages.getQuestionIcon()
        )

        if (tokenInput.isNullOrBlank()) {
            LOG.info("Login cancelled - no token entered")
            return
        }

        val token = tokenInput.trim()
        
        // Validate token length
        if (token.length < MIN_TOKEN_LENGTH) {
            Notifications.showError(project, "Invalid Token", "Token seems too short. Please enter a valid token.")
            return
        }

        // Verify token in background
        ProgressManager.getInstance().run(object : Task.Backgroundable(project, "Verifying Token...", true) {
            override fun run(indicator: ProgressIndicator) {
                try {
                    indicator.text = "Connecting to SetupHub..."
                    
                    val userProfile = apiService.verifyToken(token)
                    
                    indicator.text = "Saving credentials..."
                    
                    // Save authentication data
                    authService.setToken(token)
                    authService.setUsername(userProfile.username)
                    authService.setDisplayName(userProfile.name)
                    
                    val displayName = userProfile.name ?: userProfile.username
                    LOG.info("Login successful for user: ${userProfile.username}")
                    
                    ApplicationManager.getApplication().invokeLater {
                        val syncNow = Messages.showYesNoDialog(
                            project,
                            "Welcome, $displayName!\n\nYou are now logged in to SetupHub.\nWould you like to sync your setup now?",
                            "Login Successful",
                            "Sync Now",
                            "Later",
                            Messages.getInformationIcon()
                        )
                        
                        if (syncNow == Messages.YES) {
                            SyncAction().performSync(e)
                        }
                    }
                } catch (ex: Exception) {
                    LOG.warn("Login failed", ex)
                    ApplicationManager.getApplication().invokeLater {
                        Notifications.showError(
                            project, 
                            "Login Failed", 
                            ex.message ?: "Failed to verify token. Please check your token and try again."
                        )
                    }
                }
            }
        })
    }
}
