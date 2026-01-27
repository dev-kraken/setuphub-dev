package com.devkraken.setuphub.actions

import com.devkraken.setuphub.services.ApiService
import com.intellij.ide.BrowserUtil
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.diagnostic.Logger

/**
 * Action for browsing community setups on SetupHub.
 */
class BrowseSetupsAction : AnAction() {

    companion object {
        private val LOG = Logger.getInstance(BrowseSetupsAction::class.java)
    }

    override fun actionPerformed(e: AnActionEvent) {
        val apiService = ApiService.getInstance()
        val setupsUrl = apiService.getSetupsUrl()
        LOG.info("Opening community setups: $setupsUrl")
        BrowserUtil.browse(setupsUrl)
    }
}
