package com.devkraken.setuphub.services

import com.intellij.application.options.CodeStyle
import com.intellij.ide.GeneralSettings
import com.intellij.ide.plugins.PluginManager
import com.intellij.ide.ui.UISettings
import com.intellij.openapi.application.ApplicationInfo
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.components.Service
import com.intellij.openapi.diagnostic.Logger
import com.intellij.openapi.editor.colors.EditorColorsManager
import com.intellij.openapi.editor.ex.EditorSettingsExternalizable
import javax.swing.UIManager

/**
 * Service for collecting user's IDE setup configuration.
 * Gathers plugins, themes, fonts, and editor settings.
 */
@Service
class SetupService {

    companion object {
        private val LOG = Logger.getInstance(SetupService::class.java)
        private const val MAX_DESCRIPTION_LENGTH = 200
        
        fun getInstance(): SetupService = ApplicationManager.getApplication().getService(SetupService::class.java)
    }

    /**
     * Collect complete setup data from IDE environment.
     * 
     * @param name User-defined name for the setup
     * @param description Optional description
     * @param isPublic Whether the setup should be publicly visible
     * @return Complete UserSetup object
     */
    fun collectSetup(name: String, description: String?, isPublic: Boolean): UserSetup {
        LOG.info("Collecting setup: $name")
        
        return UserSetup(
            name = name,
            description = description,
            editorName = getEditorName(),
            theme = getTheme(),
            fontFamily = getFontFamily(),
            fontSize = getFontSize(),
            extensions = getExtensions(),
            settings = getSettings(),
            isPublic = isPublic
        )
    }

    /**
     * Get normalized editor name for API identification.
     * Examples: "intellij-idea", "pycharm", "webstorm", "phpstorm"
     */
    fun getEditorName(): String {
        val productName = ApplicationInfo.getInstance().versionName
        
        return productName
            .lowercase()
            .replace(" ", "-")
            .replace(Regex("[^a-z-]"), "")
            .replace(Regex("-+"), "-")
            .trim('-')
    }

    /**
     * Get display-friendly editor name (for UI purposes).
     */
    fun getEditorDisplayName(): String {
        return ApplicationInfo.getInstance().versionName
    }

    /** Uses UIManager to avoid deprecated LafManager.getCurrentLookAndFeel(); L&F is set by the IDE via UIManager. */
    private fun getTheme(): String {
        return UIManager.getLookAndFeel()?.name ?: "Unknown"
    }

    private fun getFontFamily(): String {
        return EditorColorsManager.getInstance().globalScheme.editorFontName
    }

    private fun getFontSize(): Int {
        return EditorColorsManager.getInstance().globalScheme.editorFontSize
    }

    /**
     * Get installed plugins (excluding bundled).
     * Only loaded plugins are returned; getLoadedPlugins() implies enabled/active, so we avoid deprecated PluginDescriptor.isEnabled().
     */
    private fun getExtensions(): List<ExtensionInfo> {
        return PluginManager.getLoadedPlugins()
            .filter { !it.isBundled }
            .map { plugin ->
                ExtensionInfo(
                    name = plugin.name,
                    id = plugin.pluginId.idString,
                    version = plugin.version,
                    publisher = plugin.vendor,
                    description = plugin.description?.take(MAX_DESCRIPTION_LENGTH)
                )
            }
    }

    /**
     * Collect important editor settings.
     */
    private fun getSettings(): Map<String, Any> {
        val settings = mutableMapOf<String, Any>()
        
        collectColorSchemeSettings(settings)
        collectEditorBehaviorSettings(settings)
        collectCodeStyleSettings(settings)
        collectUISettings(settings)
        collectGeneralSettings(settings)

        LOG.info("Collected ${settings.size} settings")
        return settings
    }

    private fun collectColorSchemeSettings(settings: MutableMap<String, Any>) {
        try {
            val editorScheme = EditorColorsManager.getInstance().globalScheme
            settings["editor.fontFamily"] = editorScheme.editorFontName
            settings["editor.fontSize"] = editorScheme.editorFontSize
            settings["editor.lineSpacing"] = editorScheme.lineSpacing
            settings["editor.colorScheme"] = editorScheme.name
            settings["console.fontFamily"] = editorScheme.consoleFontName
            settings["console.fontSize"] = editorScheme.consoleFontSize
            settings["console.lineSpacing"] = editorScheme.consoleLineSpacing
        } catch (e: Exception) {
            LOG.debug("Could not collect color scheme settings: ${e.message}")
        }
    }

    private fun collectEditorBehaviorSettings(settings: MutableMap<String, Any>) {
        try {
            val editorSettings = EditorSettingsExternalizable.getInstance()
            settings["editor.lineNumbers"] = editorSettings.isLineNumbersShown
            settings["editor.wordWrap"] = if (editorSettings.isUseSoftWraps) "on" else "off"
            settings["editor.caretBlinking"] = editorSettings.isBlinkCaret
            settings["editor.showWhitespace"] = editorSettings.isWhitespacesShown
            settings["editor.showIndentGuides"] = editorSettings.isIndentGuidesShown
            settings["editor.virtualSpace"] = editorSettings.isVirtualSpace
            settings["editor.breadcrumbs"] = editorSettings.isBreadcrumbsShown
            settings["editor.foldingOutline"] = editorSettings.isFoldingOutlineShown
        } catch (e: Exception) {
            LOG.debug("Could not collect editor behavior settings: ${e.message}")
        }
    }

    private fun collectCodeStyleSettings(settings: MutableMap<String, Any>) {
        try {
            val codeStyleDefaults = CodeStyle.getDefaultSettings()
            val indentOptions = codeStyleDefaults.indentOptions
            settings["editor.tabSize"] = indentOptions.TAB_SIZE
            settings["editor.indentSize"] = indentOptions.INDENT_SIZE
            settings["editor.useTabs"] = indentOptions.USE_TAB_CHARACTER
        } catch (e: Exception) {
            LOG.debug("Could not collect code style settings: ${e.message}")
        }
    }

    private fun collectUISettings(settings: MutableMap<String, Any>) {
        try {
            val uiSettings = UISettings.getInstance()
            settings["ui.showToolWindowBars"] = uiSettings.showToolWindowsNumbers
            settings["ui.compactMode"] = uiSettings.compactMode
            settings["ui.showMainToolbar"] = uiSettings.showMainToolbar
            settings["ui.showNavigationBar"] = uiSettings.showNavigationBar
            settings["ui.showStatusBar"] = uiSettings.showStatusBar
            settings["ui.wideScreenSupport"] = uiSettings.wideScreenSupport
            settings["ui.editorTabPlacement"] = getTabPlacementName(uiSettings.editorTabPlacement)
            settings["ui.recentFilesLimit"] = uiSettings.recentFilesLimit
        } catch (e: Exception) {
            LOG.debug("Could not collect UI settings: ${e.message}")
        }
    }

    private fun collectGeneralSettings(settings: MutableMap<String, Any>) {
        try {
            val generalSettings = GeneralSettings.getInstance()
            settings["general.autoSave"] = if (generalSettings.isAutoSaveIfInactive) "afterDelay" else "off"
            settings["general.autoSaveDelay"] = generalSettings.inactiveTimeout
            settings["general.reopenLastProject"] = generalSettings.isReopenLastProject
            settings["general.confirmExit"] = generalSettings.isConfirmExit
            settings["general.showTipsOnStartup"] = generalSettings.isShowTipsOnStartup
        } catch (e: Exception) {
            LOG.debug("Could not collect general settings: ${e.message}")
        }
    }

    private fun getTabPlacementName(placement: Int): String = when (placement) {
        1 -> "top"
        2 -> "left"
        3 -> "bottom"
        4 -> "right"
        0 -> "none"
        else -> "top"
    }
}
