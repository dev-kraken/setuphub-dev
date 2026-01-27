# SetupHub Sync for JetBrains IDEs

**SetupHub Sync** allows you to synchronize your JetBrains IDE settings, plugins, and themes across multiple devices effortlessly.

Say goodbye to manually reinstalling plugins or configuring settings. Sync it once, use it everywhere.

## Supported IDEs

- IntelliJ IDEA (Community & Ultimate)
- PhpStorm
- WebStorm
- PyCharm
- Android Studio
- And all other JetBrains IDEs

## Features

- **Cloud Sync**: Securely backup your IDE configuration to the cloud
- **Instant Setup**: Configure a new machine in seconds
- **Share Your Setup**: Get a shareable link to showcase your environment
- **Cross-IDE Support**: Works with VS Code, Cursor, and all JetBrains IDEs

## Quick Start

1. **Install** the plugin from the JetBrains Marketplace or via ZIP
2. Go to **Tools → SetupHub → Login**
3. Get your token from [setuphub.dev/dashboard](https://setuphub.dev/dashboard)
4. Paste your token and click **Sync Setup**

On your other computer, simply install, login, and your setup is ready!

## Menu Actions

Navigate to **Tools → SetupHub** to access all commands:

| Action                      | Description                                           |
| :-------------------------- | :---------------------------------------------------- |
| **Sync Setup**              | Upload your current IDE configuration to the cloud    |
| **Login**                   | Authenticate with your SetupHub Personal Access Token |
| **Logout**                  | Sign out from your account                            |
| **View My Profile**         | Open your SetupHub profile in browser                 |
| **Browse Community Setups** | Discover popular developer configurations             |

## What Gets Synced

- **Plugins**: All installed non-bundled plugins
- **Theme**: Current Look and Feel
- **Editor**: Font family, size, line spacing, color scheme
- **Code Style**: Tab size, indent size, use tabs
- **UI Settings**: Toolbar, navigation bar, status bar, tab placement
- **General**: Auto-save, recent files limit, and more

## Requirements

- IntelliJ Platform 2024.1 or higher
- An active internet connection

## Installation

### From JetBrains Marketplace

1. Open **Settings → Plugins → Marketplace**
2. Search for "SetupHub Sync"
3. Click **Install**

### From ZIP

1. Download the plugin ZIP from releases
2. Open **Settings → Plugins → ⚙️ → Install Plugin from Disk**
3. Select the ZIP file

## Building from Source

```bash
./gradlew clean buildPlugin
```

The plugin ZIP will be in `build/distributions/`.

## Integration Tests

Integration tests use the [Starter framework](https://plugins.jetbrains.com/docs/intellij/integration-tests-intro.html) to run the IDE with the plugin installed. Run them with:

```bash
./gradlew integrationTest
```

The first run may download an IDE distribution; subsequent runs use the cache.

## Plugin Verifier (check-plugin & check-ide)

Compatibility is checked with the [IntelliJ Plugin Verifier](https://github.com/JetBrains/intellij-plugin-verifier). Two modes matter for this project:

| Mode          | Question answered                          | How to run                        |
| :------------ | :------------------------------------------ | :-------------------------------- |
| **check-plugin** | Does this plugin work with these IDEs?      | `./gradlew verifyPlugin`          |
| **check-ide**    | Does this IDE work with these plugins?      | Verifier CLI (see below)          |

### check-plugin (default)

`./gradlew verifyPlugin` runs **check-plugin**: it verifies this plugin against the IDEs configured under `pluginVerification { ides { recommended() } }`. Use this for normal CI and before releases.

### check-ide

**check-ide** verifies one IDE build against a list of plugins. It’s useful when you care about “does this specific IDE build work with these plugins?” (e.g. a custom or prerelease IDE).

The Gradle plugin only wires **check-plugin** via `verifyPlugin`. To run **check-ide**:

1. **Download the Verifier CLI** (Java 11+):

   ```bash
   curl -s https://api.github.com/repos/JetBrains/intellij-plugin-verifier/releases/latest \
       | jq -r '.assets[] | select(.name | endswith("-all.jar")) | .browser_download_url' \
       | xargs curl -L -o verifier-all.jar
   ```

   Or get `verifier-cli-<version>-all.jar` from [Releases](https://github.com/JetBrains/intellij-plugin-verifier/releases) or [JetBrains Package Repository](https://github.com/JetBrains/intellij-plugin-verifier#installation).

2. **Build the plugin** and create a plugins-to-check file (one line per plugin: `path:<absolute-path-to-zip>` or `id:<plugin-id>`):

   ```bash
   ./gradlew buildPlugin
   ```

   Then create `plugins-to-check.txt` with one line, e.g.:

   ```
   path:/abs/path/to/intellij-extension/build/distributions/setuphub-0.0.1.zip
   ```

   Use the actual path to the ZIP produced in `build/distributions/`.

3. **Run check-ide** for one or more IDEs:

   ```bash
   java -jar verifier-all.jar check-ide [latest-release-IU] -plugins-to-check-file plugins-to-check.txt
   ```

   `<IDE>` can be a local path (e.g. `/opt/idea`) or a pattern like `[latest-release-IU]` / `[latest-IU]`. See the [Verifier README](https://github.com/JetBrains/intellij-plugin-verifier#check-ide) for full options (`-runtime-dir`, `-plugins-to-check-last-builds`, etc.).

   **From this project:** You can also use the `checkIde` Gradle task if you have the verifier JAR locally:

   ```bash
   ./gradlew checkIde -PverifierJar=/path/to/verifier-cli-1.398-all.jar
   ```

   Override the IDE with `-PcheckIdeIde=[latest-IU]` or a path. The task builds the plugin and writes `build/verifier/plugins-to-check.txt` for you.

## Support

Visit [setuphub.dev](https://setuphub.dev) for more information or report issues on our [GitHub Repository](https://github.com/dev-kraken/setuphub-dev).
