package com.devkraken.setuphub.ui

import com.intellij.notification.NotificationGroupManager
import com.intellij.notification.NotificationType
import com.intellij.openapi.project.Project

/**
 * Utility object for displaying balloon notifications
 */
object Notifications {
    private const val GROUP_ID = "SetupHub Notifications"

    /**
     * Show an informational notification
     */
    fun showInfo(project: Project?, title: String, content: String) {
        show(project, title, content, NotificationType.INFORMATION)
    }

    /**
     * Show a warning notification
     */
    fun showWarning(project: Project?, title: String, content: String) {
        show(project, title, content, NotificationType.WARNING)
    }

    /**
     * Show an error notification
     */
    fun showError(project: Project?, title: String, content: String) {
        show(project, title, content, NotificationType.ERROR)
    }

    private fun show(project: Project?, title: String, content: String, type: NotificationType) {
        NotificationGroupManager.getInstance()
            .getNotificationGroup(GROUP_ID)
            .createNotification(title, content, type)
            .notify(project)
    }
}
