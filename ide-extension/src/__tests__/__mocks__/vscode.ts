export const window = {
    createStatusBarItem: jest.fn(() => ({
        show: jest.fn(),
        hide: jest.fn(),
        dispose: jest.fn(),
        text: '',
        tooltip: '',
        command: '',
    })),
    showInformationMessage: jest.fn(),
    showErrorMessage: jest.fn(),
    showWarningMessage: jest.fn(),
    showInputBox: jest.fn(),
    showQuickPick: jest.fn(),
    withProgress: jest.fn(),
};

export const commands = {
    registerCommand: jest.fn(),
    executeCommand: jest.fn(),
};

export const workspace = {
    getConfiguration: jest.fn(() => ({
        get: jest.fn(),
        update: jest.fn(),
    })),
};

export const env = {
    openExternal: jest.fn(),
    clipboard: {
        writeText: jest.fn(),
    },
    appName: 'Visual Studio Code',
};

export const StatusBarAlignment = {
    Left: 1,
    Right: 2,
};

export const Uri = {
    parse: jest.fn((url) => ({ toString: () => url })),
};

export const ProgressLocation = {
    Notification: 15,
};
