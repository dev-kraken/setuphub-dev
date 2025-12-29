# Contributing to SetupHub

Thank you for your interest in contributing to **SetupHub**! We are building the best way for developers to sync their environments, and we'd love your help.

Whether you're fixing a bug, improving documentation, or proposing a new feature, your contributions are welcome.

## Code of Conduct

Please be respectful and inclusive. We are a community of professionals and learners. Harassment or intolerant behavior will not be tolerated.

## Development Setup

The project is a monorepo managed with `pnpm`.

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (Project uses v18+)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- [Git](https://git-scm.com/)

### 2. Fork and Clone

1. Fork the repository on GitHub.
2. Clone your fork locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/setuphub-dev.git
   cd setuphub-dev
   ```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Setting Up the Web App (`/app`)

1. Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in the required environment variables in `.env.local` (Database URL, Auth secrets, etc.).
3. Run the development server:

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view it.

### 5. Setting Up the Extension (`/ide-extension`)

1. We have convenience scripts in the root `package.json` to help with extension development.
2. To build and watch the extension in development mode:

   ```bash
   pnpm ext:dev
   ```

3. To run tests for the extension:

   ```bash
   pnpm ext:test
   ```

**Tip**: The best way to develop the extension is to open the root folder in VS Code. Then, inside VS Code:

1. Go to the "Run and Debug" side panel.
2. Select "Extension" from the dropdown.
3. Press `F5`. This will launch a new "Extension Development Host" window with your local changes active.

## Workflow

1. **Create a Branch**: Always create a new branch for your work.

   ```bash
   git checkout -b feature/amazing-new-thing
   ```

2. **Make Changes**: Write your code and improve the project.
3. **Test**: Ensure the app runs and tests pass.
4. **Commit**: descriptive commit messages are appreciated.

   ```bash
   git commit -m "feat: add support for syncing windsurf themes"
   ```

5. **Push**: Push to your fork.

   ```bash
   git push origin feature/amazing-new-thing
   ```

6. **Pull Request**: Open a PR against the `main` branch of the original repository. Describe your changes clearly.

## Questions?

If you have questions, please open a standard Issue on GitHub, and we'll get back to you!
