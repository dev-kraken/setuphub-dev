package com.devkraken.setuphub.actions

import com.devkraken.setuphub.services.ApiService
import com.devkraken.setuphub.services.AuthService
import com.devkraken.setuphub.ui.Notifications
import com.intellij.ide.BrowserUtil
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.diagnostic.Logger

/**
 * Action for viewing the user's profile on SetupHub.
 */
class ProfileAction : AnAction() {

    companion object {
        private val LOG = Logger.getInstance(ProfileAction::class.java)
    }
    
    override fun update(e: AnActionEvent) {
        val authService = AuthService.getInstance()
        val isAuthenticated = authService.isAuthenticated()
        
        e.presentation.isEnabled = isAuthenticated
        e.presentation.text = if (isAuthenticated) "View My Profile" else "View My Profile (Login required)"
    }

    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project
        val authService = AuthService.getInstance()
        val apiService = ApiService.getInstance()

        val username = authService.getUsername()
        if (username.isNullOrBlank()) {
            Notifications.showError(project, "Not Logged In", "Please login first to view your profile.")
            return
        }

        val profileUrl = apiService.getProfileUrl(username)
        LOG.info("Opening profile: $profileUrl")
        BrowserUtil.browse(profileUrl)
    }
}
