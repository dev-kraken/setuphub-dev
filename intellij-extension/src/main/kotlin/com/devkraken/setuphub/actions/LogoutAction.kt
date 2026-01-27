package com.devkraken.setuphub.actions

import com.devkraken.setuphub.services.AuthService
import com.devkraken.setuphub.ui.Notifications
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.diagnostic.Logger
import com.intellij.openapi.ui.Messages

/**
 * Action for logging out from SetupHub.
 */
class LogoutAction : AnAction() {

    companion object {
        private val LOG = Logger.getInstance(LogoutAction::class.java)
    }

    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project
        val authService = AuthService.getInstance()

        if (!authService.isAuthenticated()) {
            Notifications.showInfo(project, "Not Logged In", "You are not currently logged in.")
            return
        }

        val username = authService.getUsername() ?: "User"
        val result = Messages.showYesNoDialog(
            project,
            "Are you sure you want to logout from SetupHub?\n\nCurrently logged in as: $username",
            "Confirm Logout",
            "Logout",
            "Cancel",
            Messages.getQuestionIcon()
        )

        if (result == Messages.YES) {
            authService.logout()
            LOG.info("User logged out: $username")
            Notifications.showInfo(project, "Logged Out", "You have been logged out successfully.")
        }
    }

    override fun update(e: AnActionEvent) {
        val authService = AuthService.getInstance()
        val isAuthenticated = authService.isAuthenticated()
        
        e.presentation.isEnabled = isAuthenticated
        e.presentation.text = if (isAuthenticated) {
            "Logout (${authService.getDisplayNameOrUsername()})"
        } else {
            "Logout"
        }
    }
}
