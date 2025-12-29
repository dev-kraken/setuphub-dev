# SetupHub

**SetupHub** is the ultimate solution for developers who work across multiple machines or environments. It allows you to seamlessly sync your IDE setup—extensions, settings, keybindings, and themes—across devices.

Targeting modern developers, SetupHub currently supports VS Code, Cursor, Windsurf, and Antigravity, ensuring your development environment feels consistent everywhere you go.

## Architecture

This project is a monorepo consisting of two main components:

1. **Web Application (`/app`)**: A modern Next.js 16+ application that serves as the central hub for managing your profiles, browsing community setups, and configuring synchronization settings.
2. **IDE Extension (`/ide-extension`)**: A VS Code-compatible extension that runs locally in your editor to handle the actual syncing process (uploading/downloading settings).

## Key Features

- **Cross-Device Sync**: Keep your VS Code/Cursor/Windsurf settings identical across work and personal machines.
- **Profile Management**: Create different profiles for different workflows (e.g., "Work", "Personal", "Streaming").
- **Community Setups**: Browse and adopt popular developer setups and themes.
- **Secure Storage**: Your settings are encrypted and securely stored.
- **Platform Agnostic**: Works with any editor built on the VS Code engine.

## Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **pnpm**: v8 or higher (we use pnpm workspaces)
- **PostgreSQL**: For the database (e.g., via Neon or local Docker)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/dev-kraken/setuphub-dev.git
   cd setuphub-dev
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   # Update .env.local with your database credentials and API keys
   ```

4. Push the database schema:

   ```bash
   pnpm db:push
   ```

### Running Locally

To start the **Next.js Web App**:

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

To run the **IDE Extension** in debug mode:

```bash
pnpm ext:dev
```

This will verify the extension build and is useful for development. To debug strictly, open the project in VS Code and press `F5` with the extension folder active.

## Tech Stack

- **Framework**: [Next.js 16+ (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Extension**: VS Code Extension API

## License

This project is licensed under the MIT License.
