package com.devkraken.setuphub

import com.intellij.ide.starter.driver.engine.runIdeWithDriver
import com.intellij.ide.starter.ide.IdeProductProvider
import com.intellij.ide.starter.models.TestCase
import com.intellij.ide.starter.plugins.PluginConfigurator
import com.intellij.ide.starter.project.NoProject
import com.intellij.ide.starter.runner.Starter
import kotlin.io.path.Path
import org.junit.jupiter.api.Test

/**
 * Integration tests for SetupHub plugin.
 * See: https://plugins.jetbrains.com/docs/intellij/integration-tests-intro.html
 * and https://blog.jetbrains.com/platform/2025/02/integration-tests-for-plugin-developers-intro-dependencies-and-first-integration-test/
 */
class PluginTest {

    @Test
    fun simpleTestWithoutProject() {
        Starter.newContext(
            testName = "testSetupHub",
            TestCase(IdeProductProvider.IC, projectInfo = NoProject)
                .withVersion("2024.3")
        ).apply {
            val pathToPlugin = System.getProperty("path.to.build.plugin")
            PluginConfigurator(this).installPluginFromPath(Path(pathToPlugin))
        }.runIdeWithDriver().useDriverAndCloseIde { }
    }
}
