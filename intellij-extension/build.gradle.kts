import org.jetbrains.intellij.platform.gradle.TestFrameworkType

plugins {
    id("java")
    id("org.jetbrains.kotlin.jvm") version "1.9.25"
    id("org.jetbrains.intellij.platform") version "2.11.0"
}

group = "com.devkraken.setuphub"
version = "0.0.2"

repositories {
    mavenCentral()
    intellijPlatform {
        defaultRepositories()
    }
}

dependencies {
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.google.code.gson:gson:2.10.1")
    
    intellijPlatform {
        intellijIdeaCommunity("2024.3")
        pluginVerifier()
        testFramework(TestFrameworkType.Starter)
    }
    
    // Integration test source set and dependencies (see https://plugins.jetbrains.com/docs/intellij/integration-tests-intro.html#adding-dependencies)
    sourceSets {
        create("integrationTest") {
            compileClasspath += sourceSets.main.get().output
            runtimeClasspath += sourceSets.main.get().output
        }
    }
    
    val integrationTestImplementation by configurations.getting {
        extendsFrom(configurations.testImplementation.get())
    }

    // Starter is added by testFramework(Starter) to the default test config; with a separate
    // integrationTest source set it is not on our classpath. Add the same artifacts explicitly.
    // Coordinates from https://plugins.jetbrains.com/docs/intellij/tools-intellij-platform-gradle-plugin-types.html#TestFrameworkType
    // Version aligned to platform 2024.3 (243.x); intellijPlatform.defaultRepositories() is required.
    val starterVersion = "243.+"
    listOf(
        "com.jetbrains.intellij.tools:ide-starter-squashed:$starterVersion",
        "com.jetbrains.intellij.tools:ide-starter-junit5:$starterVersion",
        "com.jetbrains.intellij.tools:ide-starter-driver:$starterVersion",
        "com.jetbrains.intellij.driver:driver-client:$starterVersion",
        "com.jetbrains.intellij.driver:driver-sdk:$starterVersion",
        "com.jetbrains.intellij.driver:driver-model:$starterVersion",
    ).forEach { integrationTestImplementation(it) }

    integrationTestImplementation("org.junit.jupiter:junit-jupiter:5.10.2")
    integrationTestImplementation("org.junit.platform:junit-platform-launcher:1.10.2") // required explicitly for Gradle 9.0; see upgrading_version_8.html#test_framework_implementation_dependencies
    integrationTestImplementation("org.kodein.di:kodein-di-jvm:7.20.2")
    integrationTestImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:1.8.1")
}

kotlin {
    jvmToolchain(17)
}

configurations.all {
    exclude(group = "org.jetbrains.kotlin", module = "kotlin-stdlib-jdk8")
}

intellijPlatform {
    pluginConfiguration {
        ideaVersion {
            sinceBuild = "241"
            untilBuild = provider { null } // No upper limit - compatible with all future versions
        }
    }
    
    pluginVerification {
        ides {
            recommended()
        }
    }
}

tasks {
    withType<JavaCompile> {
        sourceCompatibility = "17"
        targetCompatibility = "17"
    }
    
    withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
        kotlinOptions.jvmTarget = "17"
    }

    val integrationTest by registering(Test::class) {
        val integrationTestSourceSet = sourceSets.getByName("integrationTest")
        testClassesDirs = integrationTestSourceSet.output.classesDirs
        classpath = integrationTestSourceSet.runtimeClasspath
        dependsOn(project.tasks.named("buildPlugin"))
        // path.to.build.plugin: built plugin ZIP for Starter (see blog.jetbrains.com/docs/intellij/integration-tests-intro.html)
        val buildPluginTask = project.tasks.named("buildPlugin").get()
        systemProperty("path.to.build.plugin", (buildPluginTask as org.gradle.api.tasks.bundling.Zip).archiveFile.get().asFile.absolutePath)
        useJUnitPlatform()
    }

    // Runs IntelliJ Plugin Verifier in check-ide mode: "Does this IDE work with these plugins?"
    // Requires verifier JAR: ./gradlew checkIde -PverifierJar=/path/to/verifier-cli-1.398-all.jar
    // or VERIFIER_JAR=/path/to/verifier-cli-*-all.jar ./gradlew checkIde
    // IDE defaults to [latest-release-IU]; override with -PcheckIdeIde=/path/to/ide or [latest-IU], etc.
    val checkIde by registering(org.gradle.api.tasks.Exec::class) {
        group = "verification"
        description = "Run Plugin Verifier in check-ide mode (requires -PverifierJar=… or VERIFIER_JAR)"
        val buildPluginZip = project.tasks.named("buildPlugin", org.gradle.api.tasks.bundling.Zip::class.java)
        dependsOn(buildPluginZip)
        val zipPathProvider = buildPluginZip.flatMap { it.archiveFile }.map { it.getAsFile().absolutePath }
        val verifierJarAtConfig = project.findProperty("verifierJar")?.toString() ?: System.getenv("VERIFIER_JAR")
        val ideAtConfig = project.findProperty("checkIdeIde")?.toString() ?: "[latest-release-IU]"
        doFirst {
            val jar = verifierJarAtConfig ?: throw org.gradle.api.GradleException(
                "checkIde needs the verifier JAR. Set VERIFIER_JAR or -PverifierJar=/path/to/verifier-cli-*-all.jar (see intellij-plugin-verifier releases)."
            )
            val zipPath = zipPathProvider.get()
            val pluginsFile = layout.buildDirectory.file("verifier/plugins-to-check.txt").get().asFile
            pluginsFile.parentFile.mkdirs()
            pluginsFile.writeText("path:$zipPath\n")
            commandLine("java", "-jar", jar, "check-ide", ideAtConfig, "-plugins-to-check-file", pluginsFile.absolutePath)
        }
    }

    signPlugin {
        certificateChain.set(System.getenv("CERTIFICATE_CHAIN")) 
        privateKey.set(System.getenv("PRIVATE_KEY"))
        password.set(System.getenv("PRIVATE_KEY_PASSWORD"))
    }

    publishPlugin {
        token.set(System.getenv("PUBLISH_TOKEN"))
    }
}
