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
  'intellij-idea': {
    id: 'intellij-idea',
    label: 'IntelliJ IDEA',
    icon: '/images/ide-icons/intellij-idea.svg',
  },
  phpstorm: {
    id: 'phpstorm',
    label: 'PHPStorm',
    icon: '/images/ide-icons/phpstorm.svg',
  },
  webstorm: {
    id: 'webstorm',
    label: 'WebStorm',
    icon: '/images/ide-icons/webstorm.svg',
  },
  pycharm: {
    id: 'pycharm',
    label: 'PyCharm',
    icon: '/images/ide-icons/pycharm.svg',
  },
  junie: {
    id: 'junie',
    label: 'Junie',
    icon: '/images/ide-icons/junie.svg',
  },
  default:{
    id: 'unknown',
    label: 'Unknown',
    icon: '/images/logos/icon-light.svg',
  }
} as const satisfies Record<string, { id: string; label: string; icon: string }>;

export type IDEId = keyof typeof IDE_REGISTRY;

const DEFAULT_IDE_ID: IDEId = 'default';

/**
 * Get IDE metadata by editor name.
 * Falls back to VS Code if editor is not found.
 */
export function getIdeMeta(editorName: string) {
  return IDE_REGISTRY[editorName as IDEId] ?? IDE_REGISTRY[DEFAULT_IDE_ID];
}
