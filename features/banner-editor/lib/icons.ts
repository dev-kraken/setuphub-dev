import {
  type Icon,
  IconActivity,
  IconAdjustments,
  IconAlertCircle,
  IconAnchor,
  IconAperture,
  IconApps,
  IconArchive,
  IconArrowRight,
  IconAward,
  IconBell,
  IconBolt,
  IconBook,
  IconBookmark,
  IconBox,
  IconBrandGithub,
  IconBrandReact,
  IconBrandTypescript,
  IconBriefcase,
  IconBrush,
  IconBug,
  IconBuildingSkyscraper,
  IconBulb,
  IconCalendar,
  IconCamera,
  IconChartBar,
  IconCheck,
  IconCircleCheck,
  IconClipboard,
  IconClock,
  IconCloud,
  IconCode,
  IconCoffee,
  IconCommand,
  IconCompass,
  IconCpu,
  IconCreditCard,
  IconCrown,
  IconCube,
  IconDatabase,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconDiamond,
  IconDownload,
  IconEdit,
  IconEye,
  IconFile,
  IconFileCode,
  IconFilter,
  IconFingerprint,
  IconFlag,
  IconFlame,
  IconFolder,
  IconGift,
  IconGitBranch,
  IconGitCommit,
  IconGitMerge,
  IconGitPullRequest,
  IconGlobe,
  IconHash,
  IconHeadphones,
  IconHeart,
  IconHome,
  IconInbox,
  IconInfoCircle,
  IconKey,
  IconLayersSubtract,
  IconLayout,
  IconLifebuoy,
  IconLink,
  IconList,
  IconLock,
  IconMail,
  IconMap,
  IconMapPin,
  IconMaximize,
  IconMessage,
  IconMicrophone,
  IconMoodSmile,
  IconMoon,
  IconMusic,
  IconPackage,
  IconPalette,
  IconPaperclip,
  IconPencil,
  IconPhone,
  IconPhoto,
  IconPin,
  IconPlanet,
  IconPlayerPlay,
  IconPlug,
  IconPlus,
  IconPower,
  IconPrinter,
  IconPuzzle,
  IconQrcode,
  IconRadar,
  IconRefresh,
  IconRocket,
  IconSearch,
  IconSend,
  IconServer,
  IconSettings,
  IconShare,
  IconShield,
  IconShoppingCart,
  IconSparkles,
  IconSpeakerphone,
  IconStar,
  IconSun,
  IconTag,
  IconTarget,
  IconTerminal,
  IconThumbUp,
  IconTool,
  IconTrash,
  IconTrendingUp,
  IconTrophy,
  IconUpload,
  IconUser,
  IconUsers,
  IconVideo,
  IconWand,
  IconWifi,
  IconWorld,
  IconX,
  IconZoomIn,
} from '@tabler/icons-react';

/** Icon metadata with category for filtering */
export interface IconMeta {
  name: string;
  component: Icon;
  category: IconCategory;
  keywords: string[];
}

export type IconCategory =
  | 'development'
  | 'communication'
  | 'media'
  | 'interface'
  | 'business'
  | 'objects'
  | 'nature'
  | 'actions';

/** Curated list of icons for the banner editor */
export const ICON_LIST: IconMeta[] = [
  // Development
  { name: 'Code', component: IconCode, category: 'development', keywords: ['programming', 'developer'] },
  { name: 'Terminal', component: IconTerminal, category: 'development', keywords: ['console', 'cli', 'command'] },
  { name: 'GitBranch', component: IconGitBranch, category: 'development', keywords: ['version', 'control', 'git'] },
  { name: 'GitCommit', component: IconGitCommit, category: 'development', keywords: ['version', 'control', 'save'] },
  { name: 'GitMerge', component: IconGitMerge, category: 'development', keywords: ['version', 'control', 'combine'] },
  { name: 'GitPullRequest', component: IconGitPullRequest, category: 'development', keywords: ['pr', 'review'] },
  { name: 'Bug', component: IconBug, category: 'development', keywords: ['debug', 'error', 'issue'] },
  { name: 'Database', component: IconDatabase, category: 'development', keywords: ['storage', 'sql', 'data'] },
  { name: 'Server', component: IconServer, category: 'development', keywords: ['backend', 'hosting', 'api'] },
  { name: 'Cpu', component: IconCpu, category: 'development', keywords: ['processor', 'chip', 'hardware'] },
  { name: 'FileCode', component: IconFileCode, category: 'development', keywords: ['source', 'script', 'file'] },
  { name: 'BrandGithub', component: IconBrandGithub, category: 'development', keywords: ['github', 'repo'] },
  { name: 'BrandReact', component: IconBrandReact, category: 'development', keywords: ['react', 'frontend'] },
  { name: 'BrandTypescript', component: IconBrandTypescript, category: 'development', keywords: ['typescript', 'ts'] },
  { name: 'Command', component: IconCommand, category: 'development', keywords: ['cmd', 'shortcut', 'mac'] },
  { name: 'Plug', component: IconPlug, category: 'development', keywords: ['plugin', 'extension', 'connect'] },

  // Communication
  { name: 'Mail', component: IconMail, category: 'communication', keywords: ['email', 'message', 'letter'] },
  { name: 'Message', component: IconMessage, category: 'communication', keywords: ['chat', 'comment', 'talk'] },
  { name: 'Send', component: IconSend, category: 'communication', keywords: ['submit', 'share', 'deliver'] },
  { name: 'Bell', component: IconBell, category: 'communication', keywords: ['notification', 'alert', 'ring'] },
  { name: 'Phone', component: IconPhone, category: 'communication', keywords: ['call', 'mobile', 'contact'] },
  { name: 'Inbox', component: IconInbox, category: 'communication', keywords: ['messages', 'mailbox'] },
  { name: 'Share', component: IconShare, category: 'communication', keywords: ['social', 'send', 'distribute'] },
  { name: 'Speakerphone', component: IconSpeakerphone, category: 'communication', keywords: ['announce', 'broadcast'] },

  // Media
  { name: 'Photo', component: IconPhoto, category: 'media', keywords: ['image', 'picture', 'gallery'] },
  { name: 'Video', component: IconVideo, category: 'media', keywords: ['movie', 'recording', 'film'] },
  { name: 'Camera', component: IconCamera, category: 'media', keywords: ['photo', 'capture', 'snapshot'] },
  { name: 'Music', component: IconMusic, category: 'media', keywords: ['audio', 'sound', 'song'] },
  { name: 'Microphone', component: IconMicrophone, category: 'media', keywords: ['audio', 'record', 'voice'] },
  { name: 'Headphones', component: IconHeadphones, category: 'media', keywords: ['audio', 'listen', 'music'] },
  { name: 'PlayerPlay', component: IconPlayerPlay, category: 'media', keywords: ['video', 'start', 'media'] },

  // Interface
  { name: 'Settings', component: IconSettings, category: 'interface', keywords: ['config', 'gear', 'preferences'] },
  { name: 'Adjustments', component: IconAdjustments, category: 'interface', keywords: ['settings', 'config', 'tune'] },
  { name: 'Search', component: IconSearch, category: 'interface', keywords: ['find', 'lookup', 'magnify'] },
  { name: 'Filter', component: IconFilter, category: 'interface', keywords: ['sort', 'narrow', 'refine'] },
  { name: 'Home', component: IconHome, category: 'interface', keywords: ['house', 'main', 'dashboard'] },
  { name: 'User', component: IconUser, category: 'interface', keywords: ['person', 'account', 'profile'] },
  { name: 'Users', component: IconUsers, category: 'interface', keywords: ['people', 'team', 'group'] },
  { name: 'Layout', component: IconLayout, category: 'interface', keywords: ['grid', 'design', 'template'] },
  { name: 'Layers', component: IconLayersSubtract, category: 'interface', keywords: ['stack', 'depth', 'design'] },
  { name: 'Apps', component: IconApps, category: 'interface', keywords: ['grid', 'menu', 'launcher'] },
  { name: 'List', component: IconList, category: 'interface', keywords: ['menu', 'items', 'bullets'] },
  { name: 'Maximize', component: IconMaximize, category: 'interface', keywords: ['fullscreen', 'expand', 'resize'] },
  { name: 'Eye', component: IconEye, category: 'interface', keywords: ['view', 'visible', 'show'] },
  { name: 'Menu', component: IconDeviceDesktop, category: 'interface', keywords: ['desktop', 'screen', 'monitor'] },

  // Business
  { name: 'Briefcase', component: IconBriefcase, category: 'business', keywords: ['work', 'job', 'portfolio'] },
  { name: 'ChartBar', component: IconChartBar, category: 'business', keywords: ['analytics', 'stats', 'graph'] },
  { name: 'TrendingUp', component: IconTrendingUp, category: 'business', keywords: ['growth', 'increase', 'profit'] },
  { name: 'CreditCard', component: IconCreditCard, category: 'business', keywords: ['payment', 'money', 'finance'] },
  { name: 'ShoppingCart', component: IconShoppingCart, category: 'business', keywords: ['buy', 'commerce', 'store'] },
  {
    name: 'Building',
    component: IconBuildingSkyscraper,
    category: 'business',
    keywords: ['office', 'company', 'city'],
  },
  { name: 'Calendar', component: IconCalendar, category: 'business', keywords: ['date', 'schedule', 'event'] },
  { name: 'Clock', component: IconClock, category: 'business', keywords: ['time', 'hours', 'schedule'] },
  { name: 'Award', component: IconAward, category: 'business', keywords: ['prize', 'achievement', 'medal'] },
  { name: 'Trophy', component: IconTrophy, category: 'business', keywords: ['winner', 'champion', 'prize'] },
  { name: 'Crown', component: IconCrown, category: 'business', keywords: ['king', 'premium', 'royal'] },
  { name: 'Target', component: IconTarget, category: 'business', keywords: ['goal', 'aim', 'focus'] },

  // Objects
  { name: 'Star', component: IconStar, category: 'objects', keywords: ['favorite', 'rating', 'bookmark'] },
  { name: 'Heart', component: IconHeart, category: 'objects', keywords: ['love', 'like', 'favorite'] },
  { name: 'Bolt', component: IconBolt, category: 'objects', keywords: ['lightning', 'fast', 'energy'] },
  { name: 'Sparkles', component: IconSparkles, category: 'objects', keywords: ['magic', 'ai', 'new'] },
  { name: 'Diamond', component: IconDiamond, category: 'objects', keywords: ['gem', 'premium', 'valuable'] },
  { name: 'Flame', component: IconFlame, category: 'objects', keywords: ['fire', 'hot', 'trending'] },
  { name: 'Rocket', component: IconRocket, category: 'objects', keywords: ['launch', 'startup', 'fast'] },
  { name: 'Lightbulb', component: IconBulb, category: 'objects', keywords: ['idea', 'innovation', 'tip'] },
  { name: 'Key', component: IconKey, category: 'objects', keywords: ['password', 'access', 'security'] },
  { name: 'Lock', component: IconLock, category: 'objects', keywords: ['security', 'private', 'protected'] },
  { name: 'Shield', component: IconShield, category: 'objects', keywords: ['security', 'protection', 'safe'] },
  { name: 'Gift', component: IconGift, category: 'objects', keywords: ['present', 'reward', 'surprise'] },
  { name: 'Box', component: IconBox, category: 'objects', keywords: ['package', 'container', 'product'] },
  { name: 'Package', component: IconPackage, category: 'objects', keywords: ['box', 'delivery', 'npm'] },
  { name: 'Cube', component: IconCube, category: 'objects', keywords: ['3d', 'block', 'object'] },
  { name: 'Folder', component: IconFolder, category: 'objects', keywords: ['directory', 'files', 'storage'] },
  { name: 'File', component: IconFile, category: 'objects', keywords: ['document', 'paper', 'page'] },
  { name: 'Book', component: IconBook, category: 'objects', keywords: ['docs', 'documentation', 'read'] },
  { name: 'Bookmark', component: IconBookmark, category: 'objects', keywords: ['save', 'favorite', 'mark'] },
  { name: 'Tag', component: IconTag, category: 'objects', keywords: ['label', 'category', 'price'] },
  { name: 'Hash', component: IconHash, category: 'objects', keywords: ['number', 'hashtag', 'channel'] },
  { name: 'Link', component: IconLink, category: 'objects', keywords: ['url', 'chain', 'connect'] },
  { name: 'Anchor', component: IconAnchor, category: 'objects', keywords: ['link', 'marine', 'stable'] },
  { name: 'Pin', component: IconPin, category: 'objects', keywords: ['location', 'mark', 'attach'] },
  { name: 'MapPin', component: IconMapPin, category: 'objects', keywords: ['location', 'place', 'marker'] },
  { name: 'Compass', component: IconCompass, category: 'objects', keywords: ['direction', 'navigation', 'explore'] },
  { name: 'Map', component: IconMap, category: 'objects', keywords: ['location', 'navigation', 'geography'] },
  { name: 'Globe', component: IconGlobe, category: 'objects', keywords: ['world', 'international', 'web'] },
  { name: 'World', component: IconWorld, category: 'objects', keywords: ['earth', 'global', 'planet'] },
  { name: 'Planet', component: IconPlanet, category: 'objects', keywords: ['space', 'orbit', 'saturn'] },
  { name: 'Cloud', component: IconCloud, category: 'objects', keywords: ['storage', 'weather', 'sync'] },
  { name: 'Sun', component: IconSun, category: 'objects', keywords: ['light', 'day', 'bright'] },
  { name: 'Moon', component: IconMoon, category: 'objects', keywords: ['night', 'dark', 'sleep'] },
  { name: 'Coffee', component: IconCoffee, category: 'objects', keywords: ['drink', 'cafe', 'break'] },
  { name: 'Wand', component: IconWand, category: 'objects', keywords: ['magic', 'wizard', 'edit'] },
  { name: 'Brush', component: IconBrush, category: 'objects', keywords: ['paint', 'design', 'art'] },
  { name: 'Palette', component: IconPalette, category: 'objects', keywords: ['colors', 'design', 'art'] },
  { name: 'Pencil', component: IconPencil, category: 'objects', keywords: ['write', 'edit', 'draw'] },
  { name: 'Tool', component: IconTool, category: 'objects', keywords: ['wrench', 'fix', 'utility'] },
  { name: 'Puzzle', component: IconPuzzle, category: 'objects', keywords: ['extension', 'plugin', 'piece'] },
  { name: 'Qrcode', component: IconQrcode, category: 'objects', keywords: ['scan', 'code', 'barcode'] },
  { name: 'Fingerprint', component: IconFingerprint, category: 'objects', keywords: ['auth', 'identity', 'biometric'] },
  { name: 'Lifebouy', component: IconLifebuoy, category: 'objects', keywords: ['help', 'support', 'rescue'] },
  { name: 'Aperture', component: IconAperture, category: 'objects', keywords: ['lens', 'camera', 'focus'] },
  { name: 'Radar', component: IconRadar, category: 'objects', keywords: ['scan', 'detect', 'monitor'] },
  { name: 'Wifi', component: IconWifi, category: 'objects', keywords: ['network', 'internet', 'wireless'] },
  {
    name: 'DeviceMobile',
    component: IconDeviceMobile,
    category: 'objects',
    keywords: ['phone', 'mobile', 'smartphone'],
  },

  // Nature
  { name: 'Activity', component: IconActivity, category: 'nature', keywords: ['pulse', 'health', 'heartbeat'] },
  { name: 'MoodSmile', component: IconMoodSmile, category: 'nature', keywords: ['happy', 'emoji', 'face'] },

  // Actions
  { name: 'Check', component: IconCheck, category: 'actions', keywords: ['done', 'complete', 'yes'] },
  { name: 'CircleCheck', component: IconCircleCheck, category: 'actions', keywords: ['done', 'success', 'verified'] },
  { name: 'X', component: IconX, category: 'actions', keywords: ['close', 'cancel', 'remove'] },
  { name: 'Plus', component: IconPlus, category: 'actions', keywords: ['add', 'new', 'create'] },
  { name: 'Edit', component: IconEdit, category: 'actions', keywords: ['modify', 'change', 'update'] },
  { name: 'Trash', component: IconTrash, category: 'actions', keywords: ['delete', 'remove', 'bin'] },
  { name: 'Download', component: IconDownload, category: 'actions', keywords: ['save', 'export', 'get'] },
  { name: 'Upload', component: IconUpload, category: 'actions', keywords: ['import', 'send', 'share'] },
  { name: 'Refresh', component: IconRefresh, category: 'actions', keywords: ['reload', 'sync', 'update'] },
  { name: 'ZoomIn', component: IconZoomIn, category: 'actions', keywords: ['magnify', 'enlarge', 'scale'] },
  { name: 'Power', component: IconPower, category: 'actions', keywords: ['on', 'off', 'switch'] },
  { name: 'ThumbUp', component: IconThumbUp, category: 'actions', keywords: ['like', 'approve', 'good'] },
  { name: 'ArrowRight', component: IconArrowRight, category: 'actions', keywords: ['next', 'forward', 'go'] },
  { name: 'Flag', component: IconFlag, category: 'actions', keywords: ['report', 'mark', 'country'] },
  { name: 'Clipboard', component: IconClipboard, category: 'actions', keywords: ['copy', 'paste', 'tasks'] },
  { name: 'Paperclip', component: IconPaperclip, category: 'actions', keywords: ['attach', 'file', 'link'] },
  { name: 'Printer', component: IconPrinter, category: 'actions', keywords: ['print', 'document', 'output'] },
  { name: 'Archive', component: IconArchive, category: 'actions', keywords: ['store', 'save', 'backup'] },
  { name: 'InfoCircle', component: IconInfoCircle, category: 'actions', keywords: ['info', 'help', 'about'] },
  { name: 'AlertCircle', component: IconAlertCircle, category: 'actions', keywords: ['warning', 'error', 'caution'] },
];

/** Map for quick icon lookup by name */
export const ICON_MAP = Object.fromEntries(ICON_LIST.map((icon) => [icon.name, icon.component])) as Record<
  string,
  Icon
>;

/** All available icon names */
export type IconName = (typeof ICON_LIST)[number]['name'];

/** All available icon categories */
export const ICON_CATEGORIES: IconCategory[] = [
  'development',
  'interface',
  'business',
  'objects',
  'communication',
  'media',
  'actions',
  'nature',
];

/**
 * Type guard to check if a string is a valid IconName.
 */
export function isValidIconName(icon: string): icon is IconName {
  return icon in ICON_MAP;
}

/**
 * Get icon by name with fallback to Activity.
 */
export function getIcon(name: string): Icon {
  return ICON_MAP[name] ?? IconActivity;
}
