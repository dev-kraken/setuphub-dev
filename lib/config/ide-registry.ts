/**
 * IDE Registry
 *
 * Configuration for supported IDEs/editors.
 */

const IDE_REGISTRY = {
  vscode: {
    id: 'vscode',
    label: 'Visual Studio Code',
    icon: '/images/ide-icons/vscode.svg',
  },
  cursor: {
    id: 'cursor',
    label: 'Cursor',
    icon: '/images/ide-icons/cursor.svg',
  },
  antigravity: {
    id: 'antigravity',
    label: 'Antigravity',
    icon: '/images/ide-icons/antigravity.png',
  },
  windsurf: {
    id: 'windsurf',
    label: 'Windsurf',
    icon: '/images/ide-icons/windsurf.svg',
  },
} as const satisfies Record<string, { id: string; label: string; icon: string }>;

export type IDEId = keyof typeof IDE_REGISTRY;

const DEFAULT_IDE_ID: IDEId = 'vscode';

/**
 * Get IDE metadata by editor name.
 * Falls back to VS Code if editor is not found.
 */
export function getIdeMeta(editorName: string) {
  return IDE_REGISTRY[editorName as IDEId] ?? IDE_REGISTRY[DEFAULT_IDE_ID];
}
