'use strict';

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const paths = {
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  film: 'M4 7h16v13H4z M4 12h16 M8 7l4 5 M14 7l4 5',
  compass: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M16 8l-2 6-6 2 2-6z',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4',
  captions: 'M3 5h18v14H3z M10 9H7v6h3 M17 9h-3v6h3',
  cast: 'M3 16a5 5 0 0 1 5 5 M3 12a9 9 0 0 1 9 9 M3 20v1 M3 8V4h18v16h-5',
  plus: 'M12 5v14 M5 12h14',
  share: 'M8 10H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-2 M12 15V3 M8.5 6.5 12 3l3.5 3.5',
  list: 'M4 6h16 M4 12h16 M4 18h12',
  grid: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z',
  sort: 'M7 4v16 M7 4 3 8 M7 4l4 4 M17 20V4 M17 20l-4-4 M17 20l4-4',
  filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
  shuffle: 'M16 3h5v5 M4 20 21 3 M21 16v5h-5 M15 15l6 6 M4 4l5 5',
  eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  eyeOff: 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-8-10-8a18.45 18.45 0 0 1 5.06-5.94 M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19 M1 1l22 22',
  folder: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z',
  folderPlus: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z M12 11v6 M9 14h6',
  palette: 'M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.3-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4c3 0 5.6-2.5 5.6-5.6C23 5.4 18 2 12 2Z M7.5 10.5h.01 M10.5 7.5h.01 M14.5 7.5h.01 M17.5 10.5h.01',
  link: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',

  sidebar: 'M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z M9 3v18',
  search: 'm21 21-4.3-4.3 M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z',
  home: 'm3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z M9 21v-6h6v6',
  rank: 'M18 20V10 M12 20V4 M6 20v-6',
  new: 'M4 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z M4 7l2.2-4h11.6L20 7 M8.5 3l-1.5 4 M15.5 3l1.5 4 M10 11.2l5 2.8-5 2.8v-5.6Z',
  channelRomance: 'M16.5 3.5c-1.8 0-3.4.9-4.5 2.3-1.1-1.4-2.7-2.3-4.5-2.3C4.4 3.5 2 5.9 2 9c0 4 4.1 7.4 10 12.2 5.9-4.8 10-8.2 10-12.2 0-3.1-2.4-5.5-5.5-5.5Z M7.2 7.5a2.4 2.4 0 0 1 2.4 2.4 M18.5 14.5l1 2 2 1-2 1-1 2-1-2-2-1 2-1Z',
  channelFantasy: 'M12 2.5l2.3 5.8 5.7 2.2-5.7 2.2L12 18.5l-2.3-5.8-5.7-2.2 5.7-2.2L12 2.5Z M5 17.5l.9 2 2 .9-2 .9-.9 2-.9-2-2-.9 2-.9.9-2Z M19 2.5l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7.7-1.6Z',
  channelSuspense: 'M2.2 12s3.6-6.5 9.8-6.5 9.8 6.5 9.8 6.5-3.6 6.5-9.8 6.5S2.2 12 2.2 12Z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z M12 3v1.5 M18.5 5.5l-1.2 1.2 M5.5 5.5l1.2 1.2',
  channelRebirth: 'M3 19h18 M4.2 15.5 6 6.5l6 4.8 6-4.8 1.8 9H4.2Z M12 3v2 M6 3.5l1 1.5 M18 3.5l-1 1.5',
  channelCostume: 'M12 18.5c-4.6 0-8.5-2.8-9.8-7 2.4-4 6-6.2 9.8-6.2s7.4 2.2 9.8 6.2c-1.3 4.2-5.2 7-9.8 7Z M12 18.5V5.3 M12 18.5 6.8 7.2 M12 18.5l5.2-11.3 M9 21h6',
  channelUrban: 'M3 21h18 M5 21V8l6-3v16 M11 21V10l8-2v13 M8 10h.01 M8 14h.01 M15 12h.01 M15 16h.01',
  tv: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z M8 20h8 M10 11.5v-3l3 1.5Z',
  history: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 6v6l4 2',
  favorite: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.77 1.02 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z',
  sliders: 'M4 21v-7 M4 10V3 M12 21v-9 M12 8V3 M20 21v-5 M20 12V3 M1 14h6 M9 8h6 M17 16h6',
  back: 'm15 18-6-6 6-6',
  chevronRight: 'm9 18 6-6-6-6',
  chevronDown: 'm6 9 6 6 6-6',
  close: 'M18 6 6 18 M6 6l12 12',
  refresh: 'M20 5v5h-5 M20 10a8 8 0 1 0 0 5',
  play: 'm7 4 13 8-13 8Z',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 16v-4 M12 8h.01',
  previous: 'M19 20 9 12l10-8v16Z M5 19V5',
  next: 'm5 4 10 8-10 8V4Z M19 5v14',
  seekBack: 'M11 17l-5-5 5-5 M18 17l-5-5 5-5',
  seekForward: 'm13 17 5-5-5-5 M6 17l5-5-5-5',
  pip: 'M21 13V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6 M14 15h7v5h-7Z',
  fullscreen: 'M8 3H5a2 2 0 0 0-2 2v3 M21 8V5a2 2 0 0 0-2-2h-3 M3 16v3a2 2 0 0 0 2 2h3 M16 21h3a2 2 0 0 0 2-2v-3',
  menu: 'M4 7h16 M4 12h16 M4 17h16',
  more: 'M5 12h.01 M12 12h.01 M19 12h.01',
  language: 'M3 5h12 M9 3v2 M6 8c1 4 4 7 8 9 M12 5c-1 6-4 10-9 13 M13 21l4-10 4 10 M14.5 18h5',
  empty: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z M9 10h6 M9 14h4',
  alert: 'M12 9v4 M12 17h.01 M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z',
  check: 'M20 6 9 17l-5-5',
};

const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name] || paths.tv}"/></svg>`;

const dict = {
  en: {
    videoQuality: 'Stream quality', playbackSpeed: 'Speed',
    pauseSlides: 'Pause slideshow', resumeSlides: 'Resume slideshow',
    home: 'Home',
    moviesNav: 'Movies',
    seriesNav: 'Series',
    discoverPage: 'Discover',
    searchHeadline: 'What would you like to watch?',
    searchModeTitles: 'Titles',
    searchModeGenres: 'Genres & Tags',
    searchModeSmart: 'AI Search',
    myLists: 'My Library',
    browseNav: 'Browse',
    detailsBtn: 'Details',
    searchNav: 'Search',
    resumeNamedEpisode: 'Resume episode {number}',
    playNamedEpisode: 'Play episode {number}',
    nextNamedEpisode: 'Next: Episode {number}',
    playNextEpisode: 'Play next episode',
    episodesUnwatched: '{count} unwatched',
    nextUp: 'Next up',
    playNextUp: 'Play now',
    cancelNextUp: 'Cancel',
    jumpToEpisode: 'Jump to episode',
    episodeNumber: 'Episode number',
    goToEpisode: 'Go',
    episodeNotFound: 'Choose an available episode number.',
    renameFolder: 'Rename',
    folderRenamed: 'Folder renamed',
    moveToFolder: 'Move to folder',
    folderMoved: 'Moved to {name}',
    watchlist: 'Watchlist',
    listNav: 'My Library',
    mobileLibrary: 'Library',
    mobileMore: 'More',
    systemLanguage: 'Device language',
    appSettings: 'App',
    refreshApp: 'Refresh app',
    refreshAction: 'Refresh',
    refreshAppDescription: 'Reload Coconut TV to get the latest version.',
    installApp: 'Add to Home Screen',
    installTipDescription: 'Open Coconut TV from your Home Screen.',
    installShowSteps: 'Show me',
    dismissInstallTip: 'Dismiss install tip',
    installGuideDone: 'Done',
    installNow: 'Install app',
    installAppleShare: 'Open Coconut TV in Safari and tap Share. If Share is hidden, open the page menu first.',
    installAppleHome: 'Choose Add to Home Screen.',
    installShareAction: 'Share',
    installAddAction: 'Add',
    installOpenAsWebApp: 'Open as Web App',
    installAppleAdd: 'Turn on Open as Web App if shown, then tap Add.',
    installAndroidMenu: 'Open your browser’s menu.',
    installAndroidAdd: 'Choose Install app or Add to Home screen, then confirm.',
    installDesktopHelp: 'Use the install icon in your browser’s address bar. In Safari on Mac, choose File → Add to Dock.',
    folders: 'Folders',
    myFolders: 'My Folders',
    folderEmptyTitle: 'This folder is empty',
    folderEmptyHint: 'Open a series and choose Add to folder.',
    noFoldersTitle: 'Start a folder',
    folderCountOne: '{count} title',
    folderCountMany: '{count} titles',
    folderDeletePrompt: 'Delete “{name}” from My Folders?',
    folderCreated: 'Folder created',
    folderDeleted: 'Folder deleted',
    folderCancel: 'Cancel',
    folderName: 'Folder name',
    folderCreate: 'Create folder',
    folderEmpty: 'Create folders to organize your series.',
    folderAdd: 'Add to folder',
    folderDelete: 'Delete folder',
    folderBack: 'All folders',
    allFilter: 'All',
    newest: 'Newest',
    oldest: 'Oldest',
    newFolderBtn: 'New Folder',
    closeDetails: 'Close',
    moreInfo: 'More info',
    playNow: 'Play S1 E1',
    trailerBtn: 'First episode',
    markAllWatched: 'Mark all watched',
    unmarkAllWatched: 'Watched',
    moreLikeThis: 'More Like This',
    surprise: 'Surprise Me',
    catalogFilters: 'Filters',
    catalogType: 'Type',
    catalogGenre: 'Genre',
    catalogAllGenres: 'All genres',
    resetCatalogFilters: 'Reset',
    chooseCatalogPage: 'Choose page',
    catalogPageLabel: 'Page {page}',
    catalogPageOf: 'Page {page} of {total}',
    airingSeasons: 'New Releases',
    newSeasonNowAiring: 'New episodes now airing',
    newEpisodeBadge: 'NEW RELEASE',
    trendingSeries: 'Trending Series',
    trendingMovies: 'Popular Live Action',
    continueWatching: 'Continue Watching',
    thisWeek: 'Popular',
    viewAll: 'View All',
    liquidGlass: 'Liquid Glass Effect',
    liquidGlassDesc: 'Enable translucent surfaces and subtle background color',
    hideWatched: 'Hide Watched Content',
    hideWatchedDesc: 'Hide series you have already watched from discovery grids',
    skipIntro: 'Skip First 5 Seconds',
    skipIntroDesc: 'Start unwatched episodes at 0:05. Resume positions are preserved.',
    seekStepDesc: 'Seconds to skip forwards or backwards',
    playbackSectionSub: 'Configure your video player preferences',
    appearanceSectionSub: 'Configure visual effects and appearance',
    homeLayoutSub: 'Reorder or toggle visibility of rows on your Home page',
    neuralSectionSub: 'Resize decoded video on this device with bicubic interpolation. Stream quality stays the same.',
    ambientSectionSub: 'Manage preloading, watch history, and saved lists',
    accentColorDesc: 'Choose your interface highlight and ambient glow color',
    reduceMotion: 'Reduce Motion',
    reduceMotionDesc: 'Reduce interface motion and transitions',
    subtitles: 'Subtitles',
    captionsOff: 'Off',
    newEpisodes: 'New Episodes',
    fromWatchlistWeek: 'Episode changes for your 12 most recently saved series',
    deviceNotifications: 'Watchlist update badge',
    deviceNotificationsSub: 'Show an unread badge when this panel finds new episodes',
    noNewEpisodes: 'No unread episode notifications',
    homeLayout: 'Home Layout',
    accentColor: 'Accent Color',
    spoilerMode: 'Spoiler Mode',
    spoilerModeDesc: 'Hide episode thumbnails, descriptions, and plot details',
    moveUp: 'Move up',
    moveDown: 'Move down',
    brandName: 'Coconut TV',
    discoveryPrompt: 'What are you in the mood for?',
    discoveryHint: 'Find a short drama by genre, type, or popularity.',
    footerTagline: 'Short dramas, one episode at a time.',
    advertisingLabel: 'Advertising space',
    adContactLabel: 'Advertising inquiries',
    adTitleAdvertise: 'Your ad could be here',
    adTextAdvertise: 'Get your business in front of short drama viewers.',
    adTitleLocal: 'Reach short drama fans',
    adTextLocal: 'Ask about placements on Coconut TV.',
    adTitleSponsor: 'Sponsor this space',
    adTextSponsor: 'Have a campaign in mind? We’d like to hear from you.',
    heroHeadline: 'Short Dramas',
    heroIntro: 'Big stories told in short episodes. Explore the latest series and watch from the beginning or pick up where you left off.',
    heroQuality: 'Maximum streaming resolution',
    heroEpisodeCount: 'Episodes in this series',
    featured: 'This Week',
    previousSlide: 'Previous title',
    nextSlide: 'Next title',
    openNavigation: 'Open navigation',
    closeNavigation: 'Close navigation',
    sortOrder: 'Sort order',
    dramaShelf: 'Drama & Romance',
    dramaShelfCopy: 'Exciting, emotional, and unexpected.',
    dramaShelfBrowse: 'Browse more romance',
    actionShelf: 'Action & Adventure',
    actionShelfCopy: 'High stakes and hard choices.',
    actionShelfBrowse: 'Browse more action',
    comedyShelf: 'Comedy',
    comedyShelfCopy: 'Amusing, unexpected, and over the top.',
    comedyShelfBrowse: 'Browse more comedy',
    discoverGroup: 'Discover',
    channelsGroup: 'Channels',
    browse: 'Trending This Week',
    searchResults: 'Search Results',
    yourLibrary: 'Library',
    discover: 'Home',
    rank: 'Top Charts',
    new: 'New Releases',
    history: 'History',
    favorite: 'Saved',
    settings: 'Settings',
    allTypes: 'All types',
    live: 'Live Action',
    animation: 'Anime & Comic',
    ai: 'AI Series',
    any: 'All Genres',
    romance: 'Romance',
    fantasy: 'Fantasy',
    suspense: 'Suspense',
    comedy: 'Comedy',
    costume: 'Period',
    rebirth: 'Comeback',
    family: 'Family',
    urban: 'Urban',
    action: 'Action',
    sortHot: 'Most Popular',
    sortNew: 'Latest',
    sortCollect: 'Most Saved',
    prevPage: 'Prev',
    nextPage: 'Next',
    pageOf: 'Page',
    backToBrowse: 'Back to Browse',
    seriesDetails: 'Series Details',
    watchNow: 'Play S1 E1',
    topSpotlightBadge: 'Top Series Today',
    neural4kReady: 'Upscale',
    neuralSection: 'Video Upscaling',
    neuralEnable: 'Video upscaling',
    neuralPresetLabel: 'Output target',
    neuralPresetDesc: '4K uses more GPU power. Available output depends on the video and device.',
    upscaleExplainer: 'Resizes video frames on this device. Stream quality and source detail stay the same.',
    upscaleSource: 'Source size',
    upscalePending: 'Waiting for video',
    upscaleUnavailable: 'Unavailable · using source size',
    upscaleOutput: '{size} output',
    upscaleTarget: '{size} target',
    neuralOff: 'Off',
    neuralBalanced: '1440p',
    neuralUltra: '4K',
    neuralProfileOff: 'Source size',
    neuralProfileBalanced: '1440p',
    neuralProfileUltra: '4K',
    neuralToastOn: 'Upscaling enabled',
    neuralToastOff: 'Upscaling disabled',
    episodesDirectory: 'Episodes',
    selectEpisodePrompt: 'Choose any episode below to launch the full-screen cinema player',
    watchEpisode1: 'Play S1 E1',
    resumeEpisode: 'Resume',
    saveToLibrary: 'Add to Watchlist',
    inLibrary: 'In Watchlist',
    specCategory: 'Category',
    specEpisodes: 'Total Episodes',
    specQuality: 'Master Quality',
    specAudio: 'Audio & Codec',
    specStatus: 'Status',
    statusComplete: 'Full Series',
    noSynopsis: 'No synopsis available.',
    loadingSynopsis: 'Loading synopsis…',
    synopsisError: 'Couldn’t load the synopsis.',
    episodeListError: 'Couldn’t load the episodes.',
    episodesEmpty: 'No episodes available.',
    episodes: 'Episodes',
    episode: 'Episode',
    eps: 'Episodes',
    episodeCountOne: '{count} episode',
    episodeCountMany: '{count} episodes',
    epShort: 'Ep.',
    playerViewOptions: 'Player settings',
    autoNext: 'Auto Next Episode',
    autoNextDesc: 'Automatically play the next episode when one ends',
    loopEpisode: 'Loop Current Episode',
    streamStats: 'Stream diagnostics',
    streamStatsDesc: 'Show source size, rendered size, codec, and buffer',
    videoFit: 'Video Fit',
    fitContain: 'Fit',
    fitCover: 'Fill',
    fitZoom: 'Wide',
    bufferMode: 'Prioritize Server & Buffer',
    bufferModeDesc: 'Use the fastest streaming profile for continuous playback',
    bufFast: 'Fast Start',
    bufBalanced: 'Balanced',
    bufStable: 'Max Stability',
    seekStep: 'Seek Time',
    defaultQuality: 'Preferred Quality',
    defaultQualityDesc: 'Default video quality when available',
    defaultSpeed: 'Default Playback Speed',
    defaultSpeedDesc: 'Initial speed for episode playback',
    autoQuality: 'Auto',
    q1080: '1080p Full HD',
    q720: '720p HD',
    q540: '540p qHD',
    q480: '480p SD',
    q360: '360p Smooth',
    q240: '240p Saver',
    searchPlaceholder: 'Search for short dramas & series...',
    loading: 'Loading…',
    noResults: 'No matching dramas',
    noResultsDesc: 'Try a different keyword or filter selection.',
    emptySaved: 'Your watchlist is empty',
    emptySavedDesc: 'Click the + button on any series to add it to your watchlist.',
    emptyHistory: 'No watch history yet',
    emptyHistoryDesc: 'Episodes you watch will appear here so you can pick up anytime.',
    browseStories: 'Explore Discover',
    connectionError: 'Unable to load catalog',
    connectionErrorDesc: 'Please check your connection and try again.',
    tryAgain: 'Try Again',
    saved: 'Added to Watchlist',
    removed: 'Removed from Watchlist',
    settingsSubtitle: 'Appearance, playback, and library preferences.',
    resetDefaults: 'Reset Defaults',
    defaultsReset: 'Settings restored to defaults',
    appearanceSection: 'Appearance',
    playbackSection: 'Playback',
    ambientSection: 'Library & Storage',
    storageSection: 'Preloading & Library Data',
    appearance: 'Theme Mode',
    appearanceDesc: 'Choose a theme or follow your device',
    language: 'Interface Language',
    languageDesc: 'Display language for menus and labels',
    gridDensity: 'Poster Grid Density',
    gridDensityDesc: 'Columns per row on desktop',
    compactSidebar: 'Compact sidebar',
    compactSidebarDesc: 'Show only icons in the desktop sidebar',
    preloadPages: 'Lazy-Load Next 3 Pages',
    preloadPagesDesc: 'Automatically prefetch the next 3 catalog pages in the background',
    light: 'Light',
    dark: 'Dark',
    system: 'Auto',
    watchHistoryCount: 'Watch History',
    savedLibraryCount: 'Saved Watchlist',
    clearHistory: 'Clear History',
    clearSaved: 'Clear Saved',
    historyCleared: 'Watch history cleared',
    savedCleared: 'Saved watchlist cleared',
    preparing: 'Loading stream…',
    preparingDesc: 'Preparing high-definition segments for instant playback.',
    playError: 'Playback unavailable',
    playErrorDesc: 'The stream could not be loaded. Try again or select another resolution.',
    requestTimeout: 'The streaming server took too long to respond.',
    sourceUnavailable: 'The video provider is not returning a playable source. Please try again later.',
    unavailable: 'Unavailable',
    pipUnavailable: 'Picture in Picture is not supported on this device.',
    noEpisodes: 'No playable episodes found for this series.',
    of: 'of',
    itemsCount: 'titles',
    hudResolution: 'Resolution',
    hudUpscaler: 'Upscale',
    hudCodec: 'Codec',
    hudBuffer: 'Buffer',
    hudBitrate: 'Bitrate',
    liveActionTab: 'Live Action',
    matchScore: 'Match',
    statusAiring: 'Airing',
    hdBadge: 'HD',
    playS1E1: 'Play episode 1',
    newEpNowAiring: 'New episodes now airing',
    trendingThisWeek: 'Trending this week',
    sortNewest: 'Newest',
    sortOldest: 'Oldest',
    episodeSortAsc: 'Sort ascending',
    episodeSortDesc: 'Sort descending',
    gridView: 'Grid view',
    listView: 'List view',
    episodeWatched: 'Mark episode watched',
    allEpisodesWatched: 'All episodes marked watched',
    searchEpisodesPlaceholder: 'Search episodes...',
    customColor: 'Custom Color',
    signedInAs: 'Signed in as',
    accountBtn: 'Account',
    signInTab: 'Sign In',
    createAccountTab: 'Create Account',
    authSuccess: 'Welcome,',
    signedOutToast: 'Signed out',
  },
  zh: {
    videoQuality: '片源画质', playbackSpeed: '播放速度',
    pauseSlides: '暂停轮播', resumeSlides: '继续轮播',
    home: '首页',
    moviesNav: '真人剧',
    seriesNav: '剧集',
    discoverPage: '发现',
    searchHeadline: '今天想看什么？',
    searchModeTitles: '片名搜索',
    searchModeGenres: '题材标签',
    searchModeSmart: 'AI 智能搜索',
    myLists: '我的收藏',
    browseNav: '浏览',
    detailsBtn: '详情',
    searchNav: '搜索',
    resumeNamedEpisode: '续播第 {number} 集',
    playNamedEpisode: '播放第 {number} 集',
    nextNamedEpisode: '下一集：第 {number} 集',
    playNextEpisode: '播放下一集',
    episodesUnwatched: '{count} 集未看',
    nextUp: '接下来',
    playNextUp: '立即播放',
    cancelNextUp: '取消',
    jumpToEpisode: '跳转到分集',
    episodeNumber: '分集编号',
    goToEpisode: '跳转',
    episodeNotFound: '请输入可播放的分集编号。',
    renameFolder: '重命名',
    folderRenamed: '收藏夹已重命名',
    moveToFolder: '移至收藏夹',
    folderMoved: '已移至{name}',
    watchlist: '追剧列表',
    listNav: '我的收藏',
    mobileLibrary: '收藏',
    mobileMore: '更多',
    systemLanguage: '跟随设备',
    appSettings: '应用',
    refreshApp: '刷新应用',
    refreshAction: '刷新',
    refreshAppDescription: '重新加载椰子短剧以获取最新版本。',
    installApp: '添加到主屏幕',
    installTipDescription: '从主屏幕直接打开椰子短剧。',
    installShowSteps: '查看步骤',
    dismissInstallTip: '关闭安装提示',
    installGuideDone: '完成',
    installNow: '安装应用',
    installAppleShare: '在 Safari 浏览器中打开椰子短剧，然后轻点“分享”。若未看到分享按钮，请先打开页面菜单。',
    installAppleHome: '选择“添加到主屏幕”。',
    installShareAction: '分享',
    installAddAction: '添加',
    installOpenAsWebApp: '作为网页 App 打开',
    installAppleAdd: '如果看到“作为网页 App 打开”，请将其打开，然后轻点“添加”。',
    installAndroidMenu: '打开浏览器菜单。',
    installAndroidAdd: '选择“安装应用”或“添加到主屏幕”，然后确认。',
    installDesktopHelp: '使用浏览器地址栏中的安装图标。在 Mac 的 Safari 中，选择“文件 → 添加到程序坞”。',
    folders: '收藏夹',
    myFolders: '我的收藏夹',
    folderEmptyTitle: '这个收藏夹还没有剧集',
    folderEmptyHint: '打开剧集详情后，选择添加到收藏夹。',
    noFoldersTitle: '创建第一个收藏夹',
    folderCountOne: '{count} 部剧集',
    folderCountMany: '{count} 部剧集',
    folderDeletePrompt: '要从我的收藏夹中删除“{name}”吗？',
    folderCreated: '收藏夹已创建',
    folderDeleted: '收藏夹已删除',
    folderCancel: '取消',
    folderName: '收藏夹名称',
    folderCreate: '新建收藏夹',
    folderEmpty: '创建收藏夹，整理你喜欢的短剧。',
    folderAdd: '添加到收藏夹',
    folderDelete: '删除收藏夹',
    folderBack: '全部收藏夹',
    allFilter: '全部',
    newest: '最新添加',
    oldest: '最早添加',
    newFolderBtn: '新建收藏夹',
    closeDetails: '关闭',
    moreInfo: '更多详情',
    playNow: '播放 S1 E1',
    trailerBtn: '观看第一集',
    markAllWatched: '全部标为已看',
    unmarkAllWatched: '已全部看完',
    moreLikeThis: '相似推荐',
    surprise: '随机推荐',
    catalogFilters: '筛选',
    catalogType: '类型',
    catalogGenre: '题材',
    catalogAllGenres: '全部题材',
    resetCatalogFilters: '重置',
    chooseCatalogPage: '选择页码',
    catalogPageLabel: '第 {page} 页',
    catalogPageOf: '第 {page} 页，共 {total} 页',
    airingSeasons: '最新上线',
    newSeasonNowAiring: '新剧集正在热播中',
    newEpisodeBadge: '最新更新',
    trendingSeries: '热门短剧榜',
    trendingMovies: '热门真人短剧',
    continueWatching: '继续观看',
    thisWeek: '本周热门',
    viewAll: '查看全部',
    liquidGlass: '液态玻璃光效',
    liquidGlassDesc: '启用半透明界面和柔和背景色',
    hideWatched: '隐藏已看内容',
    hideWatchedDesc: '在发现页与推荐列表中隐藏已观看的剧集',
    skipIntro: '跳过前 5 秒',
    skipIntroDesc: '未观看的分集从第 5 秒开始，已保存的续播位置保持不变。',
    seekStepDesc: '快进或快退的时间跨度（秒）',
    playbackSectionSub: '配置视频播放器与流媒体偏好',
    appearanceSectionSub: '配置界面视觉光效与主题外观',
    homeLayoutSub: '调整首页各内容栏目的显示顺序与开关',
    neuralSectionSub: '在本机使用双三次插值放大视频，片源画质保持不变。',
    ambientSectionSub: '管理后台预加载、观看历史与追剧列表',
    accentColorDesc: '选择界面高亮主题色与背景流光色彩',
    reduceMotion: '减弱动态效果',
    reduceMotionDesc: '减少界面动效和过渡动画',
    subtitles: '字幕',
    captionsOff: '关闭',
    newEpisodes: '剧集更新通知',
    fromWatchlistWeek: '最近保存的 12 部剧集的集数变化',
    deviceNotifications: '片单更新角标',
    deviceNotificationsSub: '打开此面板发现更新时，在铃铛上显示数量。',
    noNewEpisodes: '暂无未读的剧集更新通知',
    homeLayout: '首页布局',
    accentColor: '主题强调色',
    spoilerMode: '防剧透模式',
    spoilerModeDesc: '隐藏剧情简介和分集预览画面',
    moveUp: '上移',
    moveDown: '下移',
    brandName: '椰子短剧',
    discoveryPrompt: '今天想看什么？',
    discoveryHint: '按题材、人气或类型挑一部喜欢的短剧。',
    footerTagline: '短剧随时看，一集接一集。',
    advertisingLabel: '广告位',
    adContactLabel: '广告合作咨询',
    adTitleAdvertise: '此处可刊登您的广告',
    adTextAdvertise: '让更多短剧观众认识您的品牌。',
    adTitleLocal: '触达短剧观众',
    adTextLocal: '欢迎咨询椰子短剧广告投放。',
    adTitleSponsor: '赞助此广告位',
    adTextSponsor: '如果您有合作计划，欢迎联系我们。',
    heroHeadline: '短剧剧场',
    heroIntro: '用短短几集讲好一个故事。探索最新剧集，从第一集看起，或继续上次的进度。',
    heroQuality: '最高画质',
    heroEpisodeCount: '本剧集数',
    featured: '本周热播',
    previousSlide: '上一个剧集',
    nextSlide: '下一个剧集',
    openNavigation: '打开导航',
    closeNavigation: '关闭导航',
    sortOrder: '排序方式',
    dramaShelf: '剧情与爱情',
    dramaShelfCopy: '心动与意外，尽在故事里。',
    dramaShelfBrowse: '浏览更多爱情短剧',
    actionShelf: '动作与冒险',
    actionShelfCopy: '险境之中，每一个选择都至关重要。',
    actionShelfBrowse: '浏览更多动作短剧',
    comedyShelf: '喜剧',
    comedyShelfCopy: '轻松好笑，出乎意料。',
    comedyShelfBrowse: '浏览更多喜剧',
    discoverGroup: '探索发现',
    channelsGroup: '精选频道',
    browse: '本周热门剧集',
    searchResults: '搜索结果',
    yourLibrary: '资料库',
    discover: '主页',
    rank: '热门榜单',
    new: '最新上架',
    history: '观看历史',
    favorite: '我的收藏',
    settings: '偏好设置',
    allTypes: '全部类型',
    live: '真人短剧',
    animation: '动态漫剧',
    ai: 'AI 剧场',
    any: '全部题材',
    romance: '甜宠爱情',
    fantasy: '奇幻玄幻',
    suspense: '烧脑悬疑',
    comedy: '都市喜剧',
    costume: '古装仙侠',
    rebirth: '逆袭反转',
    family: '家庭伦理',
    urban: '现代都市',
    action: '热血动作',
    sortHot: '最受欢迎',
    sortNew: '最新上线',
    sortCollect: '最多收藏',
    prevPage: '上一页',
    nextPage: '下一页',
    pageOf: '第',
    backToBrowse: '返回浏览',
    seriesDetails: '剧集详情',
    watchNow: '播放 S1 E1',
    topSpotlightBadge: '今日热播榜首',
    neural4kReady: '超分',
    neuralSection: '视频超分',
    neuralEnable: '视频超分',
    neuralPresetLabel: '输出目标',
    neuralPresetDesc: '4K 会占用更多 GPU 资源。实际输出取决于视频和设备。',
    upscaleExplainer: '在本机放大视频画面，片源画质和原始细节保持不变。',
    upscaleSource: '原始尺寸',
    upscalePending: '等待视频',
    upscaleUnavailable: '暂不可用 · 按原始尺寸播放',
    upscaleOutput: '输出 {size}',
    upscaleTarget: '目标 {size}',
    neuralOff: '关闭',
    neuralBalanced: '1440p',
    neuralUltra: '4K',
    neuralProfileOff: '原始尺寸',
    neuralProfileBalanced: '1440p',
    neuralProfileUltra: '4K',
    neuralToastOn: '已开启 4K 画质增强',
    neuralToastOff: '已关闭 4K 画质增强',
    episodesDirectory: '剧集选集',
    selectEpisodePrompt: '点击任意分集即可进入全屏影院播放页',
    watchEpisode1: '播放 S1 E1',
    resumeEpisode: '继续观看',
    saveToLibrary: '加入追剧列表',
    inLibrary: '已在追剧列表',
    specCategory: '题材类型',
    specEpisodes: '总集数',
    specQuality: '最高画质',
    specAudio: '音视频编码',
    specStatus: '更新状态',
    statusComplete: '全集已完结',
    noSynopsis: '暂无剧情简介。',
    loadingSynopsis: '正在加载剧情简介…',
    synopsisError: '无法加载剧情简介。',
    episodeListError: '无法加载剧集。',
    episodesEmpty: '暂无可用剧集。',
    episodes: '选集',
    episode: '第',
    eps: '集',
    episodeCountOne: '共 {count} 集',
    episodeCountMany: '共 {count} 集',
    epShort: '第',
    playerViewOptions: '播放设置',
    autoNext: '自动连播下一集',
    autoNextDesc: '当前分集播放结束后自动切换至下一集',
    loopEpisode: '单集循环播放',
    streamStats: '实时流媒体诊断',
    streamStatsDesc: '在播放器左上角显示分辨率、4K 超分状态、编码和缓冲深度',
    videoFit: '画面比例',
    fitContain: '适应',
    fitCover: '填充',
    fitZoom: '宽幕',
    bufferMode: '服务器与缓冲策略',
    bufferModeDesc: '优先使用最快节点并保持连续播放',
    bufFast: '极速起播',
    bufBalanced: '均衡模式',
    bufStable: '超稳缓冲',
    seekStep: '快进时间',
    defaultQuality: '首选画质',
    defaultQualityDesc: '打开剧集时默认优先使用的清晰度',
    defaultSpeed: '默认播放倍速',
    defaultSpeedDesc: '开始播放时的初始倍速',
    autoQuality: '自动',
    q1080: '1080p 超清',
    q720: '720p 高清',
    q540: '540p 均衡',
    q480: '480p 标清',
    q360: '360p 流畅',
    q240: '240p 省流',
    searchPlaceholder: '搜索短剧片名、题材或关键词...',
    loading: '加载中…',
    noResults: '未找到相关剧集',
    noResultsDesc: '请尝试其他关键词或筛选条件。',
    emptySaved: '追剧列表为空',
    emptySavedDesc: '点击任意剧集右上角的 + 按钮即可加入追剧列表。',
    emptyHistory: '暂无观看记录',
    emptyHistoryDesc: '观看过的剧集会自动保存在这里，方便随时续播。',
    browseStories: '前往发现页',
    connectionError: '无法加载片库',
    connectionErrorDesc: '请检查网络连接后重试。',
    tryAgain: '重试',
    saved: '已加入追剧列表',
    removed: '已从追剧列表移除',
    settingsSubtitle: '外观、播放与资料库偏好设置。',
    resetDefaults: '恢复默认设置',
    defaultsReset: '已恢复默认设置',
    appearanceSection: '外观与光效',
    playbackSection: '播放设置',
    ambientSection: '数据与资料库',
    storageSection: '预加载与资料库',
    appearance: '主题模式',
    appearanceDesc: '选择深浅色主题或跟随系统',
    language: '界面语言',
    languageDesc: '设置导航栏与按钮显示语言',
    gridDensity: '海报网格密度',
    gridDensityDesc: '桌面端每行显示的海报数',
    compactSidebar: '紧凑侧栏',
    compactSidebarDesc: '桌面端侧栏仅显示图标',
    preloadPages: '预加载片库',
    preloadPagesDesc: '浏览时在后台自动预加载后续三页',
    light: '浅色',
    dark: '深色',
    system: '自动',
    watchHistoryCount: '观看历史',
    savedLibraryCount: '追剧列表',
    clearHistory: '清除历史',
    clearSaved: '清空列表',
    historyCleared: '观看历史已清除',
    savedCleared: '追剧列表已清空',
    preparing: '正在加载视频流…',
    preparingDesc: '正在准备高清分片，即将自动播放。',
    playError: '无法播放此剧集',
    playErrorDesc: '视频流暂时无法连接，请重试或切换其他分辨率。',
    requestTimeout: '流媒体服务器响应超时。',
    sourceUnavailable: '视频提供方暂时无法返回可播放的视频源，请稍后重试。',
    unavailable: '暂不可用',
    pipUnavailable: '当前浏览器不支持画中画。',
    noEpisodes: '该剧集暂无可播放分集。',
    of: '/',
    itemsCount: '部作品',
    hudResolution: '源分辨率',
    hudUpscaler: '4K 神经超分',
    hudCodec: '音视频编码',
    hudBuffer: '缓冲深度',
    hudBitrate: '实时码率',
    liveActionTab: '真人短剧',
    matchScore: '匹配度',
    statusAiring: '热播中',
    hdBadge: '超清 HD',
    playS1E1: '播放第 1 集',
    newEpNowAiring: '新剧集正在热播中',
    trendingThisWeek: '本周热门',
    sortNewest: '最新添加',
    sortOldest: '最早添加',
    episodeSortAsc: '正序排列',
    episodeSortDesc: '倒序排列',
    gridView: '网格视图',
    listView: '列表视图',
    episodeWatched: '标记为已看',
    allEpisodesWatched: '已将全部剧集标为已看',
    searchEpisodesPlaceholder: '搜索集数或标题...',
    customColor: '自定义颜色',
    signedInAs: '当前登录',
    accountBtn: '账号',
    signInTab: '登录账号',
    createAccountTab: '创建账号',
    authSuccess: '欢迎，',
    signedOutToast: '已退出登录',
  },
};

function read(k, d) {
  try {
    const value = JSON.parse(localStorage.getItem(k));
    if (value == null) return d;
    if (Array.isArray(d)) {
      if (!Array.isArray(value)) return d;
      const records = value.filter(item => item && typeof item === 'object' && !Array.isArray(item));
      if (k === 'duanju.folders') return records.filter(folder => typeof folder.id === 'string').map(folder => ({
        ...folder, name: String(folder.name || ''),
        series: Array.isArray(folder.series) ? folder.series.filter(item => item && typeof item === 'object' && item.id) : [],
      }));
      return records;
    }
    if (d && typeof d === 'object' && Array.isArray(value)) return d;
    if (d !== null && typeof value !== typeof d) return d;
    return value;
  } catch {
    return d;
  }
}
function store(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
}

// Clear any legacy broken server/token overrides so the app works with zero setup
try {
  localStorage.removeItem('duanju.apiOrigin');
  sessionStorage.removeItem('duanju.apiToken');
} catch {}

function deviceLanguage() {
  const preferred = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const locale of preferred) {
    const language = locale?.split('-')[0].toLowerCase();
    if (language === 'zh' || language === 'en') return language;
  }
  return 'en';
}

let languagePreference = read('duanju.lang', 'system');
if (!['system', 'en', 'zh'].includes(languagePreference)) languagePreference = 'system';
let lang = languagePreference === 'system' ? deviceLanguage() : languagePreference;
let liquidGlass = read('duanju.liquidGlass', true);
let reduceMotion = read('duanju.reduceMotion', false);
let hideSpoilers = read('duanju.hideSpoilers', false);
let hideWatched = read('duanju.hideWatched', false);
let skipIntro = read('duanju.skipIntro', false);
let deviceAlerts = read('duanju.deviceAlerts', false);
let releaseUpdateCount = 0;
let accentChoice = read('duanju.accent', 'teal');
let customAccentHex = read('duanju.customAccent', '#a78bfa');
if (!/^#[0-9a-f]{6}$/i.test(customAccentHex)) customAccentHex = '#a78bfa';
let activeFolder = '';
let folderFormOpen = false;
let confirmFolderDelete = false;
let libraryTypeFilter = 'all';
let librarySortNewest = true;
let searchMode = 'titles';
let detailEpSortDesc = false;
let detailEpViewMode = read('duanju.epViewMode', 'list') === 'grid' ? 'grid' : 'list'; // 'list' | 'grid'
let detailEpSearchQuery = '';
let heroTimer;
let heroReading = false;
let heroPaused = false;
let gridCols = Number(read('duanju.gridCols', 6)) || 6;
if (![4, 5, 6].includes(gridCols)) gridCols = 6;
let preloadPagesEnabled = Boolean(read('duanju.preloadPages', false));

// Coconut Neural 4K Real-Time Upscaler State ('off' | 'balanced' | 'ultra')
let neuralMode = read('duanju.videoUpscale', 'off');
if (!['off', 'balanced', 'ultra'].includes(neuralMode)) neuralMode = 'off';

let activeView = 'catalog'; // 'catalog' | 'detail' | 'player' | 'settings'
let route = 'discover'; // 'discover' | 'rank' | 'new' | 'history' | 'favorite' | 'folders'
let activeNav = 'home';
let genre = '';
let type = 'all';
let sort = 'hot_score';

// Exact-Grid-Multiple Stream Buffer & 3-Page Ahead Preloading State
let currentPage = 1;
let failedPage = 0;
let streamBuffer = []; // Deduplicated list of all fetched items for current query
let streamSeenIds = new Set();
let catalogSources = [];
let streamRequest;
let catalogAbort = new AbortController();
let items = [];
let loading = false;
let loadNonce = 0;
let playerNonce = 0;
let detailNonce = 0;
let pageIntent = 0;
let detailSynopsisState = 'loading';
let detailEpisodesState = 'loading';
let detailScroll = 0;
const seriesRequests = new Map();
const seriesBundles = new Map();

// Home Spotlight Slideshow & ShuttleTV Shelves State
let heroSlides = [];
const heroArtworkPrefetched = new Set();
const heroPosterPalettes = new Map();
let heroIndex = 0;
const genreShelves = [
  { key: 'continue', copyKey: 'continueWatching', nav: 'history' },
  { key: 'airing', copyKey: 'airingSeasons', nav: 'new', endpoint: '/api/new', landscape: true },
  { key: 'trending', copyKey: 'trendingSeries', nav: 'discover' },
  { key: 'live', copyKey: 'trendingMovies', nav: 'live', type: 'live' },
  { key: 'animation', copyKey: 'animation', nav: 'series', type: 'animation' },
];
const shelfItems = new Map();
const shelfCache = new Map();
let shelfObserver;
const shelfSorts = { hot_score: 'thisWeek', online_time: 'sortNew', hot_collect: 'sortCollect' };
let shelfLanguage = '';
let continueShelfKey = '';
let shelfLayoutKey = '';
const accentColors = {
  teal: ['#9ce3d6', '#156257', 'Teal', '蓝绿色'],
  purple: ['#a78bfa', '#6d28d9', 'Purple', '紫色'],
  blue: ['#60a5fa', '#2563eb', 'Blue', '蓝色'],
  red: ['#f87171', '#dc2626', 'Red', '红色'],
  green: ['#4ade80', '#16a34a', 'Green', '绿色'],
  orange: ['#fb923c', '#ea580c', 'Orange', '橙色'],
  pink: ['#f472b6', '#db2777', 'Pink', '粉色'],
  cyan: ['#22d3ee', '#0891b2', 'Cyan', '青色'],
};

let currentSeries = null;
let episodes = [];
let episodeRangeIndex = 0;
let detailEpisodeRangeIndex = 0;
let currentEpisode = null;
let nextUpEpisode = null;
let nextUpTimer;
let currentJob = null;
let hls = null;
let lastSave = 0;

let defaultQuality = read('duanju.defaultQuality', 'auto');
let defaultSpeed = String(read('duanju.defaultSpeed', '1'));
if (!['0.5', '0.75', '1', '1.25', '1.5', '1.75', '2'].includes(defaultSpeed)) defaultSpeed = '1';
if (!['auto', '240p', '360p', '480p', '540p', '720p', '1080p'].includes(defaultQuality)) defaultQuality = 'auto';
let currentQuality = defaultQuality || 'auto';
let episodeQualities = [];
let pendingPlaybackIntent;
let currentSpeed = defaultSpeed || '1';
let videoFit = read('duanju.videoFit', 'contain');
let bufferMode = read('duanju.bufferMode', 'balanced');
let seekStep = Number(read('duanju.seekStep', 10)) || 10;
if (![5, 10, 15].includes(seekStep)) seekStep = 10;
let autoplayNext = Boolean(read('duanju.autoplay', true));
let showHud = Boolean(read('duanju.hud', false));

const t = (k) => dict[lang][k] || dict.en[k] || k;
const esc = (s) =>
  String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );

const history = () => read('duanju.history', []);
const favorites = () => read('duanju.favorites', []);
const watchedEpisodesMap = () => read('duanju.watchedEpisodes', {});
const apiOrigin = () => String(window.DUANJU_CONFIG?.apiOrigin || '').replace(/\/+$/, '');
const endpoint = (url) => (/^https?:\/\//.test(url) ? url : apiOrigin() + url);

function isEpisodeWatched(seriesId, episodeId) {
  const list = watchedEpisodesMap()[seriesId];
  return Array.isArray(list) && list.includes(String(episodeId));
}

function isSeriesFullyWatched(seriesId, totalEps = 0) {
  const list = watchedEpisodesMap()[seriesId];
  if (Array.isArray(list) && totalEps > 0 && new Set(list.map(String)).size >= totalEps) return true;
  const h = history().find((x) => x.id === seriesId);
  return Boolean(totalEps === 1 && h?.episodeNumber === 1 && h.duration && h.time >= h.duration - 5);
}

function toggleEpisodeWatched(seriesId, episodeId) {
  const map = watchedEpisodesMap();
  const set = new Set(Array.isArray(map[seriesId]) ? map[seriesId] : []);
  const eid = String(episodeId);
  if (set.has(eid)) set.delete(eid);
  else set.add(eid);
  map[seriesId] = [...set];
  store('duanju.watchedEpisodes', map);
}

function markAllSeriesEpisodesWatched(seriesId, epList) {
  if (!seriesId || !Array.isArray(epList)) return;
  const map = watchedEpisodesMap();
  map[seriesId] = epList.map((e) => String(e.id));
  store('duanju.watchedEpisodes', map);
  toast(t('allEpisodesWatched'));
}

/* ==========================================================================
   Top-Layer Entry / Exit Animation & Dialog Light-Dismiss Helpers
   ========================================================================== */
function canTransitionDisplay() {
  const probe = document.createElement('div');
  probe.style.transition = 'display 1ms allow-discrete';
  return probe.style.transitionProperty === 'display';
}

const supportsTopLayerExit = () =>
  typeof CSSStartingStyleRule !== 'undefined' &&
  CSS.supports('overlay: auto') &&
  canTransitionDisplay();

async function closeTopLayer(el) {
  if (!el) return;
  if (supportsTopLayerExit()) {
    if (el.open) el.close();
    return;
  }
  el.setAttribute('data-closing', '');
  await Promise.allSettled(el.getAnimations().map((a) => a.finished));
  if (!el.hasAttribute('data-closing')) return;
  el.removeAttribute('data-closing');
  if (el.open) el.close();
}

function bindDialogLightDismiss(dialog, onDismiss) {
  if (!dialog) return;
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    dialog.addEventListener('click', (e) => {
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      ) {
        if (onDismiss) onDismiss();
        else closeTopLayer(dialog);
      }
    });
  }
}

// Exact multiple of grid columns so every page has 0 empty slots:
// 5 cols -> 15 items (3 full rows of 5)
// 4 cols -> 16 items (4 full rows of 4)
// 6 cols -> 18 items (3 full rows of 6)
function getPageSize() {
  if (gridCols === 4) return 16;
  if (gridCols === 6) return 18;
  return 15;
}

async function api(url, opts = {}) {
  let response;
  try {
    response = await fetch(endpoint(url), {
      ...opts,
      headers: {
        Accept: 'application/json',
        ...(opts.body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...opts.headers,
      },
      signal: opts.signal || AbortSignal.timeout(60_000),
    });
  } catch (error) {
    if (opts.signal?.aborted && error.name !== 'TimeoutError') throw error;
    throw new Error(
      error.name === 'TimeoutError'
        ? t('requestTimeout')
        : t('connectionErrorDesc')
    );
  }
  let data;
  try {
    data = await response.json();
  } catch (error) {
    if (opts.signal?.aborted && error.name !== 'TimeoutError') throw error;
    throw new Error(t(error.name === 'TimeoutError' ? 'requestTimeout' : 'connectionErrorDesc'));
  }
  if (!response.ok || data?.error) {
    throw new Error(
      (data?.code || data?.errorCode) === 'ANONYMOUS_LIMITED'
        ? t('sourceUnavailable')
        : typeof data?.error === 'string'
        ? data.error
        : data?.error?.message || data?.message || t('connectionErrorDesc')
    );
  }
  return data;
}

function imageUrl(url) {
  return url ? endpoint('/api/image?url=' + encodeURIComponent(url)) : '';
}
function titleOf(item) {
  return item?.title || item?.name || item?.series?.title || 'Untitled';
}

function hasChineseCharacters(text) {
  return /\p{Script=Han}/u.test(text);
}

function getSeriesBundle(id) {
  const hit = seriesBundles.get(id);
  if (hit && hit.expires > Date.now()) return hit.promise;

  const entry = { expires: Date.now() + 300_000 };
  entry.promise = api('/api/series/' + encodeURIComponent(id) + '/bundle').then(bundle => {
    entry.value = bundle;
    if ((!bundle.series?.title || !Array.isArray(bundle.episodes)) && seriesBundles.get(id) === entry) {
      seriesBundles.delete(id);
    }
    return bundle;
  }).catch(error => {
    if (seriesBundles.get(id) === entry) seriesBundles.delete(id);
    throw error;
  });
  seriesBundles.set(id, entry);
  if (seriesBundles.size > 12) seriesBundles.delete(seriesBundles.keys().next().value);
  return entry.promise;
}

function getSeriesMetadata(id) {
  const bundle = seriesBundles.get(id);
  if (bundle && bundle.expires > Date.now()) return bundle.promise.then(result => result.series);
  const cached = seriesRequests.get(id);
  if (cached && cached.expires > Date.now()) return cached.promise;

  const entry = { expires: Date.now() + 300_000 };
  const promise = api('/api/series/' + encodeURIComponent(id)).then(series => {
    entry.value = series;
    return series;
  }).catch(error => {
    if (seriesRequests.get(id) === entry) seriesRequests.delete(id);
    throw error;
  });
  entry.promise = promise;
  seriesRequests.set(id, entry);
  if (seriesRequests.size > 32) seriesRequests.delete(seriesRequests.keys().next().value);
  return promise;
}
function librarySeriesType(item) {
  const kind = Number(item?.content_type);
  if (kind === 1004 || item?.type === 'animation') return 'animation';
  if ([1, 2, 6, 7].includes(kind) || item?.type === 'live') return 'live';
  return '';
}

function normalize(item) {
  return {
    ...item,
    id: String(item.id || item.series_id || item.series?.id || ''),
    title: titleOf(item),
  };
}
function listOf(data) {
  if (Array.isArray(data)) return data;
  return data?.items || data?.series || data?.list || [];
}

function toast(message) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('visible');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('visible'), 2500);
}

/* ==========================================================================
   Video frame resampling preferences
   ========================================================================== */
let upscaleResult = { state: 'off' };
let videoResampler;
let resamplerLoading;
const playerScripts = new Map();

function loadPlayerScript(src) {
  if (!playerScripts.has(src)) {
    const request = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => {
        script.remove();
        reject(new Error(t('playErrorDesc')));
      };
      document.head.append(script);
    }).catch(error => {
      playerScripts.delete(src);
      throw error;
    });
    playerScripts.set(src, request);
  }
  return playerScripts.get(src);
}

function prepareResampler() {
  if (videoResampler || resamplerLoading || neuralMode === 'off' || activeView !== 'player') return;
  resamplerLoading = loadPlayerScript('/video-resampler.js?v=6').then(() => {
    videoResampler = window.createVideoResampler?.($('#video'), $('#upscale-canvas'), result => {
      upscaleResult = result;
      updateUpscaleStatus(result);
    });
    videoResampler?.setMode(activeView === 'player' ? neuralMode : 'off');
  }).catch(() => {
    if (neuralMode !== 'off' && activeView === 'player') {
      upscaleResult = { state: 'unavailable' };
      updateUpscaleStatus(upscaleResult);
    }
  }).finally(() => { resamplerLoading = undefined; });
}

function updateUpscaleStatus({ state, width, height }) {
  const labels = {
    off: 'upscaleSource',
    pending: 'upscalePending',
    native: 'upscaleSource',
    unavailable: 'upscaleUnavailable',
  };
  const output = state === 'active'
    ? t('upscaleOutput').replace('{size}', `${width} × ${height}`)
    : t(labels[state] || 'upscaleSource');
  const target = t(neuralMode === 'ultra' ? 'neuralUltra' : neuralMode === 'balanced' ? 'neuralBalanced' : 'neuralOff');
  const status = $('#player-upscale-status');
  if (status.textContent !== output) status.textContent = output;
  $('#hud-upscaler').textContent = output;
  const targetText = neuralMode === 'off' ? target : t('upscaleTarget').replace('{size}', target);
  status.title = `${t('neuralEnable')} · ${targetText} · ${output}`;
}

function setNeuralMode(mode, notify = false) {
  if (!['off', 'balanced', 'ultra'].includes(mode)) mode = 'off';
  neuralMode = mode;
  store('duanju.videoUpscale', neuralMode);
  applyNeuralState();
  if (notify) {
    toast(neuralMode === 'off' ? t('neuralToastOff') : t('neuralToastOn'));
  }
}

function applyNeuralState() {
  const isEnabled = neuralMode !== 'off';
  const stage = $('#video-stage');

  if (stage) {
    stage.classList.toggle('neural-active', isEnabled);
  }

  if (videoResampler) videoResampler.setMode(neuralMode);
  else upscaleResult = { state: isEnabled ? 'pending' : 'off' };
  prepareResampler();

  $$('#neural-segmented button').forEach(btn => {
    const selected = btn.dataset.neuralOpt === neuralMode;
    btn.classList.toggle('active', selected);
    btn.setAttribute('aria-pressed', String(selected));
  });

  setCustomSelectValue('default-neural-dropdown', neuralMode);

  updateUpscaleStatus(upscaleResult);

  if (currentJob) {
    updateStreamBadgeAndHud(currentJob);
  }
}

/* ==========================================================================
   View Switching (Catalog, Series Detail Page, Player Page, Settings Page)
   ========================================================================== */
function showView(viewName) {
  if (viewName !== 'player') ++playerNonce;
  if (activeView === 'player' && viewName !== 'player') {
    finishWatchMeasurement();
    lastPlayedEpisode = '';
    recordProgress(true);
    stopStream();
    $('#video-stage').classList.remove('screen-fill');
    document.body.classList.remove('player-filling-screen');
    if (document.fullscreenElement === $('#video-stage')) document.exitFullscreen().catch(() => {});
  }
  activeView = viewName;
  if (viewName !== 'player') trackCurrentPage();
  if (viewName !== 'catalog') scheduleAdvertising();
  if (mobileUtilities.matches(':popover-open')) mobileUtilities.hidePopover();
  if (releasePanel.matches(':popover-open')) releasePanel.hidePopover();
  if (viewName === 'player') prepareResampler();
  document.body.dataset.view = viewName;
  $('#catalog-view').hidden = !['catalog', 'detail'].includes(viewName);
  const detailDialog = $('#detail-view');
  if (viewName === 'detail') {
    detailDialog.removeAttribute('data-closing');
    detailDialog.hidden = false;
    if (!detailDialog.open) detailDialog.showModal();
  } else {
    if (detailDialog.open) {
      closeTopLayer(detailDialog).then(() => {
        if (activeView !== 'detail') detailDialog.hidden = true;
      });
    } else {
      detailDialog.hidden = true;
    }
  }
  $('#player-view').hidden = viewName !== 'player';
  $('#settings-view').hidden = viewName !== 'settings';
  closeAllCustomSelects();
  setCatalogFiltersOpen(false);
  setStreamSettingsOpen(false);
  setEpisodeDrawerOpen(false);
  renderNav();
  if (viewName !== 'detail') window.scrollTo({ top: 0, behavior: 'instant' });
  scheduleHeroRotation();
}

/* ==========================================================================
   Uniform-Width Custom Liquid Glass Dropdown Engine
   ========================================================================== */
function customSelectMarkup(id, label) {
  return `<div class="custom-select" id="${esc(id)}">
    <button type="button" class="custom-select-trigger" aria-expanded="false" aria-haspopup="listbox" aria-controls="${esc(id)}-menu" aria-label="${esc(label)}">
      <span class="custom-select-value" id="${esc(id)}-label"></span>
      <span class="custom-select-chevron" aria-hidden="true">${icon('chevronDown')}</span>
    </button>
    <div class="custom-select-menu" id="${esc(id)}-menu" role="listbox" aria-label="${esc(label)}" hidden></div>
  </div>`;
}

function setCustomSelectOptions(dropdownId, options, selectedValue) {
  const wrap = $('#' + dropdownId);
  const menu = $('#' + dropdownId + '-menu');
  const labelEl = $('#' + dropdownId + '-label');
  if (!wrap || !menu || !labelEl) return;

  const chosen =
    options.find((o) => String(o.value) === String(selectedValue)) ||
    options[0] || { value: '', label: '' };

  const trigger = wrap.querySelector('.custom-select-trigger');
  trigger?.setAttribute('aria-haspopup', 'listbox');
  trigger?.setAttribute('aria-controls', menu.id);
  menu.setAttribute('role', 'listbox');
  menu.setAttribute('aria-label', trigger?.getAttribute('aria-label') || '');
  wrap.dataset.value = String(chosen.value);
  labelEl.textContent = chosen.label;

  const optionsKey = JSON.stringify(options);
  if (menu.dataset.optionsKey === optionsKey) {
    setCustomSelectValue(dropdownId, chosen.value);
    return;
  }
  menu.dataset.optionsKey = optionsKey;
  menu.innerHTML = options
    .map((opt) => {
      const isSelected = String(opt.value) === String(chosen.value);
      return `<button type="button" class="custom-select-option ${
        isSelected ? 'is-selected' : ''
      }" role="option" tabindex="-1" aria-selected="${isSelected}" data-select-id="${esc(dropdownId)}" data-opt-value="${esc(opt.value)}">
        <span>${esc(opt.label)}</span>
        <span class="custom-select-check" aria-hidden="true">${icon('check')}</span>
      </button>`;
    })
    .join('');
}

function setCustomSelectValue(dropdownId, value) {
  const wrap = $('#' + dropdownId);
  const menu = $('#' + dropdownId + '-menu');
  const labelEl = $('#' + dropdownId + '-label');
  if (!wrap || !menu || !labelEl) return;

  const buttons = [...menu.querySelectorAll('.custom-select-option')];
  const match = buttons.find((b) => b.dataset.optValue === String(value)) || buttons[0];
  if (!match) return;

  wrap.dataset.value = match.dataset.optValue;
  labelEl.textContent = match.querySelector('span')?.textContent || '';
  buttons.forEach((b) => {
    b.classList.toggle('is-selected', b === match);
    b.setAttribute('aria-selected', String(b === match));
  });
}

function closeAllCustomSelects(exceptEl = null) {
  $$('.has-open-select').forEach((el) => el.classList.remove('has-open-select'));
  $$('.custom-select.is-open').forEach((sel) => {
    if (sel === exceptEl) return;
    sel.classList.remove('is-open');
    const trigger = sel.querySelector('.custom-select-trigger');
    const menu = sel.querySelector('.custom-select-menu');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    if (menu) menu.hidden = true;
  });
}

function handleCustomSelectChange(dropdownId, val) {
  if (dropdownId === 'catalog-page-dropdown') {
    if (Number(val) !== currentPage) goToPage(val);
  } else if (dropdownId === 'player-range-dropdown') {
    episodeRangeIndex = Number(val) || 0;
    renderEpisodeList();
    $('#episode-list').scrollTop = 0;
    $('#player-range-dropdown .custom-select-trigger')?.focus({ preventScroll: true });
  } else if (dropdownId.startsWith('shelf-sort-')) {
    const shelf = $('#' + dropdownId)?.closest('.genre-shelf');
    if (shelf) loadGenreShelf(shelf, val);
  } else if (dropdownId === 'player-captions') {
    captionTracks().forEach((track, index) => { track.mode = val === String(index) ? 'showing' : 'disabled'; });
  } else if (dropdownId === 'type-dropdown') {
    type = val || 'all';
    loadCatalog();
  } else if (dropdownId === 'genre-dropdown') {
    genre = val;
    if (activeNav.startsWith('channel:')) {
      activeNav = genre ? `channel:${genre}` : 'discover';
      renderNav();
    }
    loadCatalog();
  } else if (dropdownId === 'sort-dropdown') {
    sort = val || 'hot_score';
    loadCatalog();
  } else if (dropdownId === 'quality-dropdown') {
    changePlaybackQuality(val || 'auto');
  } else if (dropdownId === 'speed-dropdown') {
    currentSpeed = val || '1';
    $('#video').defaultPlaybackRate = $('#video').playbackRate = Number(currentSpeed) || 1;
  } else if (dropdownId === 'default-neural-dropdown') {
    setNeuralMode(val || 'balanced', true);
  } else if (dropdownId === 'default-quality-dropdown') {
    defaultQuality = val || 'auto';
    currentQuality = defaultQuality;
    store('duanju.defaultQuality', defaultQuality);
    setCustomSelectValue('quality-dropdown', defaultQuality);
  } else if (dropdownId === 'default-speed-dropdown') {
    defaultSpeed = val || '1';
    currentSpeed = defaultSpeed;
    store('duanju.defaultSpeed', defaultSpeed);
    setCustomSelectValue('speed-dropdown', defaultSpeed);
    $('#video').defaultPlaybackRate = $('#video').playbackRate = Number(currentSpeed) || 1;
  } else if (dropdownId === 'default-buffer-dropdown') {
    bufferMode = val || 'balanced';
    store('duanju.bufferMode', bufferMode);
    if (hls) {
      const cfg = hlsBufferConfig();
      hls.config.maxBufferLength = cfg.maxBufferLength;
      hls.config.backBufferLength = cfg.backBufferLength;
    }
  }
}

/* ==========================================================================
   Sidebar Expand / Collapse, Theme & Preferences State
   ========================================================================== */
function colorLuminance(hex) {
  const values = hex.replace('#', '').match(/../g).map(part => {
    const value = parseInt(part, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}

function contrastRatio(first, second) {
  const a = colorLuminance(first), b = colorLuminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function mixColor(first, second, weight) {
  const channels = hex => hex.replace('#', '').match(/../g).map(part => parseInt(part, 16));
  const a = channels(first), b = channels(second);
  return '#' + a.map((value, i) => Math.round(value * (1 - weight) + b[i] * weight).toString(16).padStart(2, '0')).join('');
}

function readableAccent(color, light) {
  const background = light ? '#e0e0ea' : '#222228';
  const target = light ? '#000000' : '#ffffff';
  const opacity = light ? 0.14 : 0.18;
  for (let step = 0; step <= 100; step++) {
    const candidate = mixColor(color, target, step / 100);
    const tinted = mixColor(background, candidate, opacity);
    if (contrastRatio(candidate, tinted) >= 4.5) return candidate;
  }
  return target;
}

function applyAppearance() {
  document.documentElement.dataset.glass = String(liquidGlass);
  document.documentElement.dataset.reduceMotion = String(reduceMotion);
  document.documentElement.dataset.spoilers = String(hideSpoilers);
  $('#settings-liquid-glass').checked = liquidGlass;
  $('#settings-reduce-motion').checked = reduceMotion;
  $('#settings-spoilers').checked = hideSpoilers;
  if ($('#settings-hide-watched')) $('#settings-hide-watched').checked = hideWatched;
  if ($('#device-alerts-toggle')) $('#device-alerts-toggle').checked = deviceAlerts;

  const color =
    accentChoice === 'custom'
      ? [customAccentHex, customAccentHex]
      : Object.hasOwn(accentColors, accentChoice) ? accentColors[accentChoice] : accentColors.teal;
  document.documentElement.style.setProperty('--accent-dark', readableAccent(color[0], false));
  document.documentElement.style.setProperty('--accent-light', readableAccent(color[1], true));
  if ($('#custom-accent-picker')) $('#custom-accent-picker').value = customAccentHex;
  scheduleHeroRotation();
}

function applyGridDensity() {
  $('#catalog').dataset.cols = String(gridCols);
  $$('#cols-segmented button').forEach((btn) => {
    btn.classList.toggle('active', Number(btn.dataset.colsOpt) === gridCols);
  });
}

function applyTheme() {
  const preference = read('duanju.theme', 'dark');
  const theme = ['light', 'dark', 'system'].includes(preference) ? preference : 'dark';
  const resolved =
    theme === 'system'
      ? matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark'
      : theme;
  document.documentElement.dataset.theme = resolved;
  const metaTheme = $('meta[name="theme-color"]');
  if (metaTheme) metaTheme.content = resolved === 'light' ? '#f4f5f3' : '#0e1011';
  $$('#theme-segmented button').forEach((btn) => {
    const active = btn.dataset.themeOpt === theme;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}

function applyPlayerPrefs() {
  $('#video-stage').dataset.fit = videoFit;
  $('#stream-hud').hidden = !showHud;
  $('#settings-autoplay').checked = autoplayNext;
  if ($('#settings-skip-intro')) $('#settings-skip-intro').checked = skipIntro;
  $('#hud-toggle').checked = showHud;
  $('#settings-preload-pages').checked = preloadPagesEnabled;

  setCustomSelectValue('default-quality-dropdown', defaultQuality);
  setCustomSelectValue('default-speed-dropdown', defaultSpeed);
  setCustomSelectValue('default-buffer-dropdown', bufferMode);
  applyNeuralState();

  $$('#fit-segmented button').forEach((b) =>
    b.classList.toggle('active', b.dataset.fitOpt === videoFit)
  );
  $$('#seek-segmented button, #settings-seek-segmented button').forEach((b) =>
    b.classList.toggle('active', Number(b.dataset.seekOpt) === seekStep)
  );
}

/* ==========================================================================
   Navigation, Channels, Dropdowns & Headings
   ========================================================================== */
function renderNav() {
  const nav = [
    ['home', 'home', 'home'],
    ['discover', 'compass', 'browseNav'],
    ['search', 'search', 'searchNav'],
    ['favorite', 'favorite', 'listNav'],
  ];
  const selected = activeView === 'settings' ? 'settings'
    : ['history', 'folders'].includes(activeNav) ? 'favorite'
    : ['live', 'series'].includes(activeNav) || activeNav.startsWith('channel:')
      ? 'discover' : activeNav;
  const renderLink = ([key, glyph, label], mobile) => `
    <button type="button" data-nav="${key}" ${selected === key ? 'aria-current="page"' : ''}>
      ${mobile ? icon(glyph) : ''}<span>${esc(t(mobile && key === 'favorite' ? 'mobileLibrary' : label))}</span>
    </button>`;
  $('#masthead-nav').innerHTML = nav.filter(([key]) => key !== 'search').map((item) => renderLink(item, false)).join('');
  $('#mobile-nav-links').innerHTML = nav.map((item) => renderLink(item, true)).join('');
  const settingsSelected = selected === 'settings';
  $('#mobile-more').classList.toggle('is-active', settingsSelected);
  if (settingsSelected) $('#mobile-settings').setAttribute('aria-current', 'page');
  else $('#mobile-settings').removeAttribute('aria-current');
  $('#top-search-bar').hidden = false;
  $('#mobile-nav').hidden = false;

  const brand = $('#masthead-brand');
  brand.setAttribute('aria-label', t('brandName'));
  brand.title = t('home');
  for (const [id, key, glyph, label] of [
    ['masthead-search', 'search', 'search', 'searchPlaceholder'],
    ['masthead-settings', 'settings', 'settings', 'settings'],
  ]) {
    const link = $('#' + id);
    if (!link) continue;
    link.innerHTML = icon(glyph);
    link.setAttribute('aria-label', t(label));
    link.title = t(label);
    link.classList.toggle('active', selected === key);
  }

  const bellBtn = $('#masthead-new');
  const bellGlyph = $('#masthead-new-glyph');
  const bellBadge = $('#bell-badge');
  if (bellGlyph) bellGlyph.innerHTML = icon('bell');
  if (bellBtn) {
    bellBtn.setAttribute('aria-label', t('newEpisodes'));
    bellBtn.title = t('newEpisodes');
  }
  const savedCount = releaseUpdateCount;
  const showUpdateBadge = deviceAlerts && savedCount > 0;
  if (bellBadge) {
    bellBadge.textContent = String(savedCount);
    bellBadge.hidden = !showUpdateBadge;
  }
  $('#mobile-dock-dot').hidden = !showUpdateBadge;
  const mobileCount = $('#mobile-alert-count');
  mobileCount.textContent = String(savedCount);
  mobileCount.hidden = !showUpdateBadge;
}

function setCatalogFiltersOpen(open) {
  const panel = $('#filters');
  if (!open && !panel.hidden && panel.querySelector('.is-open')) closeAllCustomSelects();
  panel.hidden = !open;
  $('#catalog-filters-toggle').setAttribute('aria-expanded', String(open));
}

function renderCatalogFilterSummary() {
  const defaultType = activeNav === 'live' ? 'live' : 'all';
  const count = Number(type !== defaultType) + Number(route === 'discover' && Boolean(genre));
  const badge = $('#catalog-filter-count');
  badge.textContent = String(count);
  badge.hidden = count === 0;
  $('#catalog-filter-reset').hidden = count === 0;
  $$('#catalog-types [data-catalog-type]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.catalogType === type));
  });
}

const catalogGenres = ['romance', 'fantasy', 'suspense', 'comedy', 'costume', 'rebirth', 'family', 'urban', 'action'];

function renderFilterDropdowns() {
  $('#sort-dropdown .custom-select-trigger').setAttribute('aria-label', t('sortOrder'));
  $('#type-dropdown .custom-select-trigger').setAttribute('aria-label', t('catalogType'));
  $('#genre-dropdown .custom-select-trigger').setAttribute('aria-label', t('catalogGenre'));
  const typeOptions = [
    { value: 'all', label: t('allTypes') },
    { value: 'live', label: t('liveActionTab') },
    { value: 'animation', label: t('animation') },
    { value: 'ai', label: t('ai') },
  ];
  setCustomSelectOptions('type-dropdown', typeOptions, type);
  const genreOptions = [
    { value: '', label: t('catalogAllGenres') },
    ...catalogGenres.map(key => ({ value: key, label: t(key) })),
  ];
  setCustomSelectOptions('genre-dropdown', genreOptions, genre);

  const sortOptions = [
    { value: 'hot_score', label: t('sortHot') },
    { value: 'online_time', label: t('sortNew') },
    { value: 'hot_collect', label: t('sortCollect') },
  ];
  setCustomSelectOptions('sort-dropdown', sortOptions, sort);

  const neuralOptions = [
    { value: 'balanced', label: t('neuralProfileBalanced') },
    { value: 'ultra', label: t('neuralProfileUltra') },
    { value: 'off', label: t('neuralProfileOff') },
  ];
  setCustomSelectOptions('default-neural-dropdown', neuralOptions, neuralMode);

  const speedOptions = [
    { value: '0.5', label: '0.5×' },
    { value: '0.75', label: '0.75×' },
    { value: '1', label: '1.0×' },
    { value: '1.25', label: '1.25×' },
    { value: '1.5', label: '1.5×' },
    { value: '1.75', label: '1.75×' },
    { value: '2', label: '2.0×' },
  ];
  $('#speed-dropdown .custom-select-trigger').setAttribute('aria-label', t('playbackSpeed'));
  $('#quality-dropdown .custom-select-trigger').setAttribute('aria-label', t('videoQuality'));
  setCustomSelectOptions('speed-dropdown', speedOptions, currentSpeed);
  setCustomSelectOptions('default-speed-dropdown', speedOptions, defaultSpeed);

  const bufferOptions = [
    { value: 'fast', label: t('bufFast') },
    { value: 'balanced', label: t('bufBalanced') },
    { value: 'stable', label: t('bufStable') },
  ];
  setCustomSelectOptions('default-buffer-dropdown', bufferOptions, bufferMode);
}

function renderQualitySelectOptions(qualitiesList = episodeQualities) {
  if (qualitiesList.length) episodeQualities = qualitiesList;
  const available = new Set(episodeQualities.map(q => typeof q === 'string' ? q : q.label || q.height + 'p'));
  const tiers = [
    { value: 'auto', label: t('autoQuality') },
    ...[1080, 720, 540, 480, 360, 240].map(height => ({ value: height + 'p', label: t('q' + height) })),
  ];
  const options = tiers.filter(tier => tier.value === 'auto' || !available.size || available.has(tier.value));
  setCustomSelectOptions('quality-dropdown', options, currentQuality || defaultQuality || 'auto');
  setCustomSelectOptions('default-quality-dropdown', tiers, defaultQuality || 'auto');
}

function changePlaybackQuality(quality) {
  if (quality === currentQuality) return;
  if (!currentEpisode) { currentQuality = quality; return; }
  const video = $('#video');
  const pending = pendingPlaybackIntent?.episodeId === currentEpisode.id ? pendingPlaybackIntent : null;
  const seek = video.readyState >= 1 ? video.currentTime : pending?.seek || 0;
  const shouldPlay = video.readyState >= 1 ? !video.paused : pending?.shouldPlay ?? true;
  return playEpisode(currentEpisode.id, quality, seek, shouldPlay);
}

function playbackReadyAt(job, seek) {
  if (!job.manifestUrl) return false;
  if (['complete', 'completed'].includes(job.status)) return true;
  if (!['ready', 'streaming'].includes(job.status)) return false;
  return !seek || Number(job.bufferedSeconds || 0) >= seek + 1;
}

function renderSearchQuickTags() {
  const container = $('#search-quick-tags');
  if (!container) return;
  const showTags = activeNav === 'search' && searchMode !== 'titles';
  container.hidden = !showTags;
  if (!showTags) return;

  const tagKeys =
    searchMode === 'ai'
      ? ['rebirth', 'romance', 'suspense', 'fantasy', 'costume', 'urban']
      : ['romance', 'fantasy', 'suspense', 'comedy', 'costume', 'rebirth', 'family', 'urban', 'action'];
  const currentQ = $('#search-input')?.value.trim() || '';
  container.innerHTML = tagKeys
    .map((key) => {
      const label = t(key);
      const isSelected = currentQ.toLowerCase() === label.toLowerCase() || genre === key;
      return `<button type="button" class="search-tag-pill ${
        isSelected ? 'active' : ''
      }" data-quick-tag="${esc(key)}" data-quick-label="${esc(label)}">${esc(label)}</button>`;
    })
    .join('');
}

function renderHeading() {
  const library = ['history', 'favorite', 'folders'].includes(route);
  const search = activeNav === 'search';
  const isDiscover = activeNav === 'discover' || activeNav.startsWith('channel:');
  const q = $('#search-input').value.trim();

  const titleKey = library
    ? 'myLists'
    : search
      ? q
        ? 'searchResults'
        : 'trendingThisWeek'
      : activeNav === 'series'
        ? 'seriesNav'
        : activeNav === 'live'
          ? 'live'
          : isDiscover
            ? 'browseNav'
            : activeNav === 'home'
              ? 'browse'
              : activeNav;
  $('#page-title').textContent = t(titleKey);
  $('#browse-header').hidden = route === 'folders';

  // Search Pane & Modes
  $('#search-pane').hidden = !search;
  if ($('#search-clear-btn')) $('#search-clear-btn').hidden = !q;
  $$('#search-mode-tabs .search-mode-btn').forEach((btn) => {
    const active = btn.dataset.searchMode === searchMode;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', String(active));
  });
  renderSearchQuickTags();

  // Library Header Block (Watchlist / Folders / History)
  const libBlock = $('#library-header-block');
  if (libBlock) libBlock.hidden = !library;
  if ($('#watchlist-tab-count')) {
    $('#watchlist-tab-count').textContent = String(favorites().length);
  }
  $('#library-tabs').setAttribute('aria-label', t('myLists'));
  $('#library-tabs').querySelectorAll('[data-nav]').forEach((button) => {
    if (button.dataset.nav === activeNav) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  $$('.library-filter-pills .lib-pill').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.libType === libraryTypeFilter);
  });
  if ($('#library-sort-label')) {
    $('#library-sort-label').textContent = t(librarySortNewest ? 'sortNewest' : 'sortOldest');
  }
  $('#new-folder-quick-btn').hidden = route === 'folders';
  $('#library-subfilters').hidden = !library || (route === 'folders' && !activeFolder);
  $('#folder-pane').hidden = route !== 'folders';

  const catalogActions = $('#unified-control-bar');
  catalogActions.hidden = library || search || route === 'new';
  if (catalogActions.hidden) setCatalogFiltersOpen(false);
  $('#catalog-types').hidden = !isDiscover;
  $('#catalog-type-row').hidden = isDiscover;
  $('#catalog-genre-row').hidden = route !== 'discover';
  $('#sort-dropdown').hidden = route !== 'discover';
  $('#surprise-button').hidden = !isDiscover && !['series', 'live'].includes(activeNav);
  renderCatalogFilterSummary();
}

function translate() {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.title = `${dict.en.brandName} · ${dict.zh.brandName}`;
  $$('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  $('#search-input').placeholder = t('searchPlaceholder');
  $('#episode-jump-input').placeholder = t('episodeNumber');
  if (nextUpEpisode) $('#next-up-heading').textContent = episodeLabel(nextUpEpisode);
  if ($('#detail-ep-search-input')) {
    $('#detail-ep-search-input').placeholder = t('searchEpisodesPlaceholder');
  }
  $('#language-switch').textContent = lang === 'zh' ? 'EN' : '中文';
  $('#mobile-language-value').textContent = lang === 'zh' ? 'English' : '中文';
  $('#dismiss-install-tip').setAttribute('aria-label', t('dismissInstallTip'));
  $('#install-guide-title').textContent = t(installPlatform() === 'desktop' ? 'installNow' : 'installApp');
  $('#install-settings-row strong').textContent = t(installPlatform() === 'desktop' ? 'installNow' : 'installApp');
  $('#retry-play').textContent = t('tryAgain');
  $('#stream-settings-toggle').setAttribute('aria-label', t('playerViewOptions'));
  $('#player-episodes-toggle').setAttribute('aria-label', t('episodes'));
  $('#player-episodes-close').setAttribute('aria-label', t('closeDetails'));
  $('#player-captions .custom-select-trigger').setAttribute('aria-label', t('subtitles'));
  renderSettingsSections();
  $$('#lang-segmented button').forEach((btn) => {
    const selected = btn.dataset.langOpt === languagePreference;
    btn.classList.toggle('active', selected);
    btn.setAttribute('aria-pressed', String(selected));
  });
  renderQualitySelectOptions(currentJob?.qualities || []);
  renderNav();
  renderFilterDropdowns();
  renderHeading();
  applyNeuralState();
  renderHeroSlideshow();
  renderPaginationControls();
  if (route === 'folders') renderFolders();
  if (items.length || ['favorite', 'history'].includes(route)) {
    renderCards();
  }
  if (currentSeries) {
    renderSeriesDetailContent();
    renderPlayerDetails();
  }
  updateSettingsCounts();
}

function bindImageFallbacks(root) {
  if (!root) return;
  root.querySelectorAll('img[data-poster]').forEach((img) => {
    const markLoaded = () => img.classList.add('is-loaded');
    if (img.complete && img.naturalWidth > 0) {
      markLoaded();
      return;
    }
    img.addEventListener('load', markLoaded, { once: true });
    img.addEventListener(
      'error',
      () => {
        if (!img.dataset.retried && img.src) {
          img.dataset.retried = '1';
          setTimeout(() => {
            img.src = img.src + (img.src.includes('?') ? '&' : '?') + 'retry=1';
          }, 500);
          return;
        }
        const parent = img.parentElement;
        if (parent) {
          img.remove();
          if (!parent.querySelector('.card-placeholder')) {
            const ph = document.createElement('span');
            ph.className = 'card-placeholder';
            ph.innerHTML = icon('tv');
            parent.prepend(ph);
          }
        }
      },
      { once: false }
    );
  });
}

/* ==========================================================================
   Home Spotlight Slideshow Carousel (#hero-slideshow) & Shelves
   ========================================================================== */
function isFeaturedCatalog() {
  const q = $('#search-input')?.value.trim() || '';
  return (
    activeView === 'catalog' &&
    route === 'discover' &&
    ['home', 'live', 'series'].includes(activeNav) &&
    !genre &&
    !q &&
    currentPage === 1
  );
}

function shouldShowHeroSlideshow() {
  return isFeaturedCatalog() && heroSlides.length > 0;
}

function shouldShowHomeShelves() {
  return shouldShowHeroSlideshow() && activeNav === 'home';
}

function setHeroSlide(index) {
  if (!heroSlides.length) return;
  const nextIndex = (index + heroSlides.length) % heroSlides.length;
  if (nextIndex === heroIndex) return;
  const direction = index < heroIndex ? -1 : 1;
  heroIndex = nextIndex;
  renderHeroSlideshow(direction);
}

function shelfMarkup({ key, copyKey }) {
      const isLandscape = key === 'airing';
      return `
      <section class="genre-shelf ${isLandscape ? 'is-landscape-shelf' : ''}" data-shelf="${key}" data-sort="hot_score" aria-labelledby="shelf-${key}-title">
        <div class="shelf-toolbar">
          <div class="shelf-heading">
            <h2 id="shelf-${key}-title">${esc(t(copyKey))}</h2>
            ${
              ['trending', 'live', 'animation'].includes(key)
                ? customSelectMarkup('shelf-sort-' + key, t('sortOrder'))
                : ''
            }
          </div>
          <button type="button" class="shelf-browse" data-shelf-view>${esc(t('viewAll'))} ${icon('chevronRight')}</button>
        </div>
        <div class="shelf-reel">
          <div class="shelf-track" tabindex="0" aria-labelledby="shelf-${key}-title"></div>
          <button type="button" class="shelf-arrow prev" data-shelf-dir="-1" aria-label="${esc(t('prevPage'))}" disabled>${icon('back')}</button>
          <button type="button" class="shelf-arrow next" data-shelf-dir="1" aria-label="${esc(t('nextPage'))}" disabled>${icon('chevronRight')}</button>
        </div>
      </section>
    `;
}

function bindShelfControls(shelf) {
  const track = shelf.querySelector('.shelf-track');
  track.addEventListener('scroll', () => updateShelfArrows(shelf), { passive: true });
}

function renderContinueWatching(layout, featuredVisible) {
  const container = $('#home-resume');
  const preference = layout.find(shelf => shelf.key === 'continue');
  const enabled = preference.visible && activeView === 'catalog' && activeNav === 'home' && currentPage === 1 &&
    (!loading || featuredVisible) && !genre && !$('#search-input').value.trim();
  const recent = enabled ? history().filter(item => playbackTarget(item)).slice(0, 12) : [];
  container.hidden = !recent.length;
  if (container.hidden) return;

  const key = JSON.stringify([lang, ...recent.map(item => [
    item.id, item.episodeId, item.time, item.duration, item.completed, item.nextEpisodeId, item.nextEpisodeNumber,
  ])]);
  if (continueShelfKey === key) {
    updateShelfArrows(container.firstElementChild);
    return;
  }
  continueShelfKey = key;
  container.innerHTML = shelfMarkup(preference);
  const shelf = container.firstElementChild;
  bindShelfControls(shelf);
  loadGenreShelf(shelf, 'hot_score', recent);
}

function renderGenreShelves(visible) {
  const container = $('#genre-shelves');
  const layout = readHomeLayout();
  renderContinueWatching(layout, visible);
  container.hidden = !visible;
  if (!visible) return;

  const layoutKey = JSON.stringify(layout);
  if (shelfLanguage !== lang || shelfLayoutKey !== layoutKey) {
    shelfObserver?.disconnect();
    shelfLanguage = lang;
    shelfLayoutKey = layoutKey;
    container.innerHTML = layout.filter(shelf => shelf.visible && shelf.key !== 'continue').map(shelfMarkup).join('');
    if ('IntersectionObserver' in window) {
      shelfObserver = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting || activeView !== 'catalog') continue;
          const shelf = entry.target;
          shelfObserver.unobserve(shelf);
          if (!shelf.dataset.loaded) loadGenreShelf(shelf, shelf.dataset.sort);
        }
      }, { rootMargin: '240px 0px' });
    }
    container.querySelectorAll('.genre-shelf').forEach(shelf => {
      setCustomSelectOptions('shelf-sort-' + shelf.dataset.shelf,
        Object.entries(shelfSorts).map(([value, label]) => ({ value, label: t(label) })), 'hot_score');
      bindShelfControls(shelf);
      if (shelfObserver) {
        shelf.querySelector('.shelf-track').innerHTML = '<span class="shelf-placeholder" aria-hidden="true"></span>'.repeat(6);
        shelfObserver.observe(shelf);
      } else {
        loadGenreShelf(shelf, 'hot_score');
      }
    });
  } else {
    container.querySelectorAll('.genre-shelf').forEach(shelf => {
      if (!shelf.dataset.loaded && shelfObserver) {
        shelfObserver.unobserve(shelf);
        shelfObserver.observe(shelf);
      }
      updateShelfArrows(shelf);
    });
    for (const button of container.querySelectorAll('[data-save]')) {
      const saved = favorites().some((item) => item.id === button.dataset.save);
      button.setAttribute('aria-pressed', String(saved));
      button.classList.toggle('saved', saved);
      button.innerHTML = icon(saved ? 'check' : 'plus');
    }
  }
}

function updateShelfArrows(shelf) {
  const track = shelf.querySelector('.shelf-track');
  shelf.querySelector('[data-shelf-dir="-1"]').disabled = track.scrollLeft <= 1;
  shelf.querySelector('[data-shelf-dir="1"]').disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
}

async function loadGenreShelf(shelf, selectedSort, recent = []) {
  const source = genreShelves.find((entry) => entry.key === shelf.dataset.shelf);
  if (!source) return;
  const track = shelf.querySelector('.shelf-track');
  shelf.dataset.loaded = 'true';
  shelf.dataset.sort = selectedSort;
  track.setAttribute('aria-busy', 'true');
  const params = new URLSearchParams({ sort: selectedSort });
  if (source.type) params.set('type', source.type);
  const url = source.endpoint || '/api/discover?' + params;
  let request = source.key === 'continue' ? Promise.resolve(recent.slice(0, 12)) : shelfCache.get(url);
  if (!request) {
    request = api(url).then((page) => listOf(page).map(normalize).filter((item) => item.id).slice(0, 18));
    shelfCache.set(url, request);
    track.innerHTML = '<span class="shelf-placeholder" aria-hidden="true"></span>'.repeat(6);
  }
  try {
    const titles = await request;
    if (!shelf.isConnected || shelf.dataset.sort !== selectedSort) return;
    const saved = new Set(favorites().map((item) => item.id));
    for (const title of titles) shelfItems.set(title.id, title);

    const isContinue = source.key === 'continue';

    track.innerHTML = titles.length
      ? titles
          .map((item) => {
            const target = isContinue ? playbackTarget(item) : null;
            return `<article class="shelf-card">
        <button type="button" class="shelf-title-button" ${
          isContinue
            ? `data-watch-hero="${esc(item.id)}"`
            : `data-open="${esc(item.id)}"`
        }>
          <span class="shelf-poster">
            ${
              item.cover_url
                ? `<img data-poster src="${esc(imageUrl(item.cover_url))}" alt="" loading="lazy" decoding="async">`
                : icon('tv')
            }
          </span>
          ${seriesCardCaption(item, target ? playbackActionLabel(target) : '', isContinue)}
          ${target ? `<span class="resume-play-mark" aria-hidden="true">${icon('play')}</span>` : ''}
          ${
              target && !target.next && item.duration > 0
                ? `<span class="watch-progress" style="width:${Math.min(
                    100,
                    (item.time / item.duration) * 100
                  )}%"></span>`
                : ''
            }
        </button>
        ${isContinue ? '' : `<button type="button" class="poster-save ${saved.has(item.id) ? 'saved' : ''}" data-save="${esc(
              item.id
            )}" aria-pressed="${saved.has(item.id)}" aria-label="${esc(t('watchlist'))}">${icon(
              saved.has(item.id) ? 'check' : 'plus'
            )}</button>`}
      </article>`;
          })
          .join('')
      : `<p class="shelf-status">${esc(t('noResults'))}</p>`;
    track.scrollLeft = 0;
    bindImageFallbacks(track);
  } catch {
    if (shelfCache.get(url) === request) shelfCache.delete(url);
    if (!shelf.isConnected || shelf.dataset.sort !== selectedSort) return;
    track.innerHTML = `<button type="button" class="shelf-status" data-shelf-retry>${esc(t('tryAgain'))}</button>`;
  } finally {
    if (shelf.isConnected && shelf.dataset.sort === selectedSort) {
      track.setAttribute('aria-busy', 'false');
      updateShelfArrows(shelf);
    }
  }
}

function scheduleHeroRotation() {
  clearTimeout(heroTimer);
  if (!shouldShowHeroSlideshow() || heroSlides.length < 2 || heroReading || heroPaused || document.hidden ||
      reduceMotion || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  heroTimer = setTimeout(() => setHeroSlide(heroIndex + 1), 9500);
}

function heroPosterPalette(pixels, sampleWidth = pixels.length / 4) {
  const sampleHeight = Math.floor(pixels.length / (4 * sampleWidth));
  const colors = new Map();
  for (let i = 0; i + 3 < pixels.length; i += 4) {
    const red = pixels[i];
    const green = pixels[i + 1];
    const blue = pixels[i + 2];
    const brightest = Math.max(red, green, blue);
    const darkest = Math.min(red, green, blue);
    if (pixels[i + 3] < 128 || brightest < 23 || darkest > 234) continue;

    // The outer fifth of the poster is more likely to contain its background color.
    const pixel = i / 4;
    const x = pixel % sampleWidth;
    const y = Math.floor(pixel / sampleWidth);
    const nearEdge = (
      Math.min(x, sampleWidth - 1 - x) < sampleWidth / 5 ||
      Math.min(y, sampleHeight - 1 - y) < sampleHeight / 5
    );
    const key = (red >> 6) * 16 + (green >> 6) * 4 + (blue >> 6);
    const swatch = colors.get(key) || { red: 0, green: 0, blue: 0, weight: 0 };
    const weight = (0.1 + ((brightest - darkest) / 56) ** 1.6) * (nearEdge ? 1.8 : 1);
    swatch.red += red * weight;
    swatch.green += green * weight;
    swatch.blue += blue * weight;
    swatch.weight += weight;
    colors.set(key, swatch);
  }

  let dominant;
  for (const swatch of colors.values()) {
    if (!dominant || swatch.weight > dominant.weight) dominant = swatch;
  }
  if (!dominant) return null;

  const color = '#' + [dominant.red, dominant.green, dominant.blue]
    .map(channel => Math.round(channel / dominant.weight).toString(16).padStart(2, '0')).join('');
  let glow = mixColor(color, '#000000', 0.25);
  while (contrastRatio('#ceced7', glow) < 4.8) glow = mixColor(glow, '#000000', 0.12);
  return { accent: color, glow, base: mixColor(glow, '#000000', 0.27) };
}

function sampleHeroPoster(artwork, poster) {
  if (!artwork || heroPosterPalettes.has(artwork)) return;
  try {
    const sample = document.createElement('canvas');
    sample.width = sample.height = 24;
    const context = sample.getContext('2d', { willReadFrequently: true });
    if (!context) return;
    context.drawImage(poster, 0, 0, sample.width, sample.height);
    const palette = heroPosterPalette(context.getImageData(0, 0, sample.width, sample.height).data, sample.width);
    if (!palette) return;
    heroPosterPalettes.set(artwork, palette);
    if (heroPosterPalettes.size > 16) heroPosterPalettes.delete(heroPosterPalettes.keys().next().value);
  } catch {
    // A failed canvas read can be retried the next time this poster is loaded.
  }
}

function applyHeroPosterPalette(hero, artwork, poster) {
  if (poster) sampleHeroPoster(artwork, poster);
  const palette = heroPosterPalettes.get(artwork);
  if (!palette) return;
  hero.style.setProperty('--hero-poster-accent', palette.accent);
  hero.style.setProperty('--hero-poster-glow', palette.glow);
  hero.style.setProperty('--hero-poster-base', palette.base);
  hero.classList.add('has-poster-palette');
}

function loadLandscapeHero(frame, isCurrent) {
  if (navigator.connection?.saveData || !isCurrent()) return;
  const image = new Image();
  image.className = 'hero-landscape-image';
  image.alt = '';
  image.crossOrigin = 'anonymous';
  image.decoding = 'async';
  image.fetchPriority = 'low';
  image.addEventListener('load', () => {
    if (!isCurrent() || image.naturalWidth < 1280 || image.naturalHeight < 720 ||
      image.naturalWidth / image.naturalHeight < 1.5) return;
    frame.querySelector('.stream-hero-art').append(image);
    frame.dataset.artwork = 'landscape';
  }, { once: true });
  image.src = endpoint('/api/series/' + encodeURIComponent(frame.dataset.heroId) + '/artwork?orientation=landscape');
}

function renderHeroSlideshow(direction = 0) {
  const heroEl = $('#hero-slideshow');
  const visible = shouldShowHeroSlideshow();
  const shelvesVisible = shouldShowHomeShelves();
  $('#featured-loading').hidden = !loading || visible || !isFeaturedCatalog();
  renderGenreShelves(shelvesVisible);
  updateInstallOffer(shelvesVisible);
  if ($('#mirror-banner')) $('#mirror-banner').hidden = !shelvesVisible;
  const showFooter = activeView === 'catalog' && !loading && ['home', 'discover', 'live', 'series', 'rank', 'new'].includes(activeNav);
  $('#cinema-footer').hidden = !showFooter;
  updateAdvertising(showFooter);
  heroEl.hidden = !visible;
  document.body.dataset.homeShelves = String(shelvesVisible);
  if (!visible) {
    clearTimeout(heroTimer);
    return;
  }
  const item = heroSlides[heroIndex] || heroSlides[0];
  if (!item) return;
  const cover = imageUrl(item.cover_url);
  const saved = favorites().some((entry) => entry.id === item.id);
  const target = playbackTarget(history().find((entry) => entry.id === item.id));
  const focused = document.activeElement;
  const oldControl = heroEl.contains(focused) ? focused.dataset : {};
  const title = titleOf(item);
  const previous = heroEl.querySelector('.hero-frame.is-waiting')
    ? heroEl.querySelector('.hero-frame.is-previous')
    : heroEl.querySelector('.hero-frame-current');
  const motion = direction && previous && previous.dataset.heroId !== item.id &&
    !reduceMotion && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const description = item.description || seriesRequests.get(item.id)?.value?.description || '';
  const episodeCount = seriesEpisodeCount(item);
  const genreLabel = seriesGenreLine(item, 1);

  heroEl.innerHTML = `
    <div class="hero-frame hero-frame-current" data-hero-id="${esc(item.id)}">
    <article class="hero-slide" aria-roledescription="slide" aria-label="${esc(title)}">
      <div class="stream-hero-art" aria-hidden="true">
        ${cover ? `<img class="stream-hero-image" crossorigin="anonymous" src="${esc(cover)}" alt="" fetchpriority="high" decoding="async">` : ''}
      </div>
      <div class="hero-slide-copy">
        <h1 class="hero-slide-title" title="${esc(title)}"${hasChineseCharacters(title) ? ' lang="zh-CN"' : ''}>${esc(title)}</h1>
        <div class="hero-slide-badges" data-feature-meta>
          ${episodeCount ? `<span>${esc(episodeCount)}</span>` : ''}
          ${genreLabel ? `<span>${esc(genreLabel)}</span>` : ''}
        </div>
        <p class="hero-slide-desc" data-feature-description ${description ? '' : 'hidden'}>${esc(description)}</p>
        <div class="hero-slide-actions">
          <button class="hero-watch-btn" type="button" data-watch-hero="${esc(item.id)}">${icon('play')}${esc(playbackActionLabel(target))}</button>
          <button type="button" class="hero-glass-btn" data-open="${esc(item.id)}">${icon('info')}${esc(t('detailsBtn'))}</button>
          <button type="button" class="stream-hero-save" data-save="${esc(item.id)}" aria-label="${esc(t('watchlist'))}" aria-pressed="${saved}">${icon(saved ? 'check' : 'plus')}</button>
        </div>
      </div>
    </article>
    </div>
    <div class="hero-carousel-controls" role="group" aria-label="${esc(t('featured'))}" ${heroSlides.length > 1 ? '' : 'hidden'}>
      <button type="button" class="hero-pause" data-hero-pause aria-pressed="${heroPaused}" aria-label="${esc(t(heroPaused ? 'resumeSlides' : 'pauseSlides'))}">${heroPaused ? icon('play') : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14"/></svg>'}</button>
      <button type="button" class="hero-arrow-btn" data-hero-dir="prev" aria-label="${esc(t('previousSlide'))}">${icon('back')}</button>
      ${heroSlides.map((slide, idx) => `<button type="button" class="hero-dot ${idx === heroIndex ? 'active' : ''}"
        data-hero-dot="${idx}" aria-label="${esc(titleOf(slide))}" aria-pressed="${idx === heroIndex}"></button>`).join('')}
      <button type="button" class="hero-arrow-btn" data-hero-dir="next" aria-label="${esc(t('nextSlide'))}">${icon('chevronRight')}</button>
    </div>`;
  const frame = heroEl.querySelector('.hero-frame-current');
  applyHeroPosterPalette(frame, cover);
  let artworkTimeout;

  function startTransition() {
    if (!motion || heroEl.hidden || !frame.isConnected || !frame.classList.contains('is-waiting')) return;
    clearTimeout(artworkTimeout);
    previous.classList.add('is-leaving');
    frame.classList.replace('is-waiting', 'is-entering');
    frame.inert = false;
    let finished = false;
    const finish = () => {
      if (finished || !frame.isConnected) return;
      finished = true;
      previous.remove();
      frame.classList.remove('is-entering');
    };
    frame.addEventListener('animationend', event => {
      if (event.target === frame) finish();
    });
    setTimeout(finish, 520);
  }

  if (motion) {
    previous.classList.remove('hero-frame-current', 'is-entering', 'is-waiting', 'is-leaving');
    previous.classList.add('is-previous');
    previous.inert = true;
    previous.setAttribute('aria-hidden', 'true');
    const offset = direction * 38;
    frame.style.setProperty('--hero-slide-offset', offset + 'px');
    previous.style.setProperty('--hero-slide-offset', -offset + 'px');
    frame.classList.add('is-waiting');
    frame.inert = true;
    heroEl.insertBefore(previous, frame);
    artworkTimeout = setTimeout(startTransition, 1250);
  }

  const heroImage = frame.querySelector('.stream-hero-image');
  const isCurrent = () => !heroEl.hidden && frame === heroEl.querySelector('.hero-frame-current');
  const artworkReady = () => {
    startTransition();
    loadLandscapeHero(frame, isCurrent);
  };
  if (heroImage) {
    const posterReady = () => {
      if (!isCurrent()) return;
      heroImage.classList.add('is-loaded');
      applyHeroPosterPalette(frame, cover, heroImage);
      artworkReady();
      const next = heroSlides[(heroIndex + 1) % heroSlides.length];
      if (next && next.id !== item.id && !navigator.connection?.saveData && !heroArtworkPrefetched.has(next.id)) {
        heroArtworkPrefetched.add(next.id);
        if (heroArtworkPrefetched.size > 8) heroArtworkPrefetched.delete(heroArtworkPrefetched.values().next().value);
        const preload = new Image();
        preload.decoding = 'async';
        preload.crossOrigin = 'anonymous';
        const nextCover = imageUrl(next.cover_url);
        if (nextCover) {
          preload.onload = () => sampleHeroPoster(nextCover, preload);
          preload.src = nextCover;
        }
      }
    };
    const posterFailed = () => {
      if (!isCurrent()) return;
      heroImage.hidden = true;
      artworkReady();
    };
    if (heroImage.complete) {
      if (heroImage.naturalWidth) posterReady();
      else posterFailed();
    } else {
      heroImage.addEventListener('load', posterReady, { once: true });
      heroImage.addEventListener('error', posterFailed, { once: true });
    }
  } else {
    artworkReady();
  }
  if ('heroPause' in oldControl) heroEl.querySelector('[data-hero-pause]')?.focus({ preventScroll: true });
  if (oldControl.heroDir) heroEl.querySelector(`[data-hero-dir="${oldControl.heroDir}"]`)?.focus({ preventScroll: true });
  if (oldControl.heroDot != null) heroEl.querySelector('.hero-dot.active')?.focus({ preventScroll: true });
  if (oldControl.save) heroEl.querySelector('.stream-hero-save')?.focus({ preventScroll: true });
  getSeriesMetadata(item.id).then((data) => {
    if (!isCurrent()) return;
    const desc = frame.querySelector('[data-feature-description]');
    if (data.description) {
      desc.textContent = data.description;
      desc.hidden = false;
    }
  }).catch(() => {});
  scheduleHeroRotation();
}

/* ==========================================================================
   Exact-Grid-Multiple Pagination & 3-Page Ahead Lazy Preloader
   ========================================================================== */
function buildCatalogUrl(contentType) {
  const q = $('#search-input').value.trim();
  let url;
  if (q) {
    url = '/api/search?q=' + encodeURIComponent(q);
    const searchFilters = {
      live: 'content_type_short_play',
      animation: 'content_type_dynamic_comic',
      ai: 'content_type_ai_dynamic_comic',
    };
    if (searchFilters[contentType]) url += '&filter=' + searchFilters[contentType];
  } else if (route === 'rank') {
    const rankContent = {
      all: '',
      live: 'human',
      animation: 'comic_series_rank',
      ai: 'ai_playlet',
    };
    url = '/api/rank?content=' + encodeURIComponent(rankContent[contentType] || '');
  } else if (route === 'new') {
    url = '/api/new';
  } else {
    const params = new URLSearchParams();
    if (contentType !== 'all') params.set('type', contentType);
    if (genre) params.set('genre', genre);
    if (sort) params.set('sort', sort);
    url = '/api/discover' + (params.toString() ? '?' + params.toString() : '');
  }

  return url;
}

function createCatalogSources() {
  if (['history', 'favorite', 'folders'].includes(route)) return [];
  const browsingAll = route === 'discover' && type === 'all' && !$('#search-input').value.trim();
  const types = browsingAll ? ['all', 'live', 'animation', 'ai'] : [type];
  return types.map((contentType) => ({ url: buildCatalogUrl(contentType), cursor: '', visited: new Set() }));
}

function prewarmPageCovers(pageItems = []) {
  pageItems.slice(0, 10).forEach((item) => {
    if (item?.cover_url) {
      const img = new Image();
      img.decoding = 'async';
      img.src = imageUrl(item.cover_url);
    }
  });
}

function fetchNextStreamBatch(nonce) {
  if (streamRequest?.nonce === nonce) return streamRequest.promise;
  const source = catalogSources[0];
  const url = new URL(source.url, location.origin);
  if (source.cursor) url.searchParams.set('cursor', source.cursor);
  const promise = api(url.pathname + url.search, {
    signal: AbortSignal.any([catalogAbort.signal, AbortSignal.timeout(60_000)]),
  }).then((data) => {
    if (nonce !== loadNonce) return;

    if (!source.cursor && activeNav === 'home' && !shelfCache.has(source.url)) {
      shelfCache.set(source.url, Promise.resolve(listOf(data).map(normalize).filter(item => item.id).slice(0, 18)));
    }
    for (const rawItem of listOf(data)) {
      const item = normalize(rawItem);
      if (item.id && !streamSeenIds.has(item.id)) {
        streamSeenIds.add(item.id);
        streamBuffer.push(item);
      }
    }

    source.visited.add(source.cursor);
    const nextCursor = String(data.cursor || data.next_cursor || '');
    catalogSources.shift();
    if (data.has_more && nextCursor && !source.visited.has(nextCursor)) {
      source.cursor = nextCursor;
      catalogSources.push(source);
    }
  }).finally(() => {
    if (streamRequest?.promise === promise) streamRequest = undefined;
  });
  streamRequest = { nonce, promise };
  return promise;
}

async function ensureBufferForPage(targetPage, nonce, batchLimit = Infinity) {
  const requiredCount = targetPage * getPageSize();
  for (let batches = 0; batches < batchLimit && nonce === loadNonce && streamBuffer.length < requiredCount && catalogSources.length; batches++) {
    await fetchNextStreamBatch(nonce);
  }
}

function getPageItems(pageNum) {
  const pageSize = getPageSize();
  const start = (pageNum - 1) * pageSize;
  return streamBuffer.slice(start, start + pageSize);
}

function totalKnownPages() {
  const pageSize = getPageSize();
  return Math.max(1, Math.ceil(streamBuffer.length / pageSize));
}

// Lazy-loads up to (fromPage + 3) in the background so the next 3 pages are always ready
async function ensureNextPagesPreloaded(fromPage, nonce) {
  if (activeView !== 'catalog' || shouldShowHomeShelves() || !preloadPagesEnabled || navigator.connection?.saveData || document.hidden || ['history', 'favorite', 'folders'].includes(route)) return;
  const targetMaxPage = fromPage + 3;
  try {
    await ensureBufferForPage(targetMaxPage, nonce, 8);
    if (nonce !== loadNonce) return;
    const nextSlice = getPageItems(fromPage + 1);
    prewarmPageCovers(nextSlice);
    renderPaginationControls();
  } catch {
    // Silent background preload failure
  }
}

function renderPaginationControls() {
  const pager = $('#pagination-bottom');
  const maxPage = totalKnownPages();
  const hasMore = catalogSources.length > 0;
  const canGoNext = streamBuffer.length > currentPage * getPageSize() || hasMore;

  pager.hidden = (maxPage <= 1 && !canGoNext && currentPage === 1) || shouldShowHomeShelves();
  if (pager.hidden) return;

  const previous = pager.querySelector('[data-page-action="prev"]');
  const next = pager.querySelector('[data-page-action="next"]');
  previous.disabled = currentPage <= 1;
  next.disabled = !canGoNext;
  previous.setAttribute('aria-label', t('prevPage'));
  next.setAttribute('aria-label', t('nextPage'));

  const pageLabel = page => t('catalogPageLabel').replace('{page}', page);
  const options = Array.from({ length: hasMore ? maxPage + 1 : maxPage }, (_, index) => ({
    value: String(index + 1),
    label: pageLabel(index + 1),
  }));
  $('#catalog-page-dropdown .custom-select-trigger').setAttribute('aria-label', t('chooseCatalogPage'));
  setCustomSelectOptions('catalog-page-dropdown', options, currentPage);
  if (!hasMore) {
    $('#catalog-page-dropdown-label').textContent = t('catalogPageOf')
      .replace('{page}', currentPage)
      .replace('{total}', maxPage);
  }
}

async function goToPage(targetPage) {
  const intent = ++pageIntent;
  const p = Math.max(1, Math.min(Math.floor(Number(targetPage) || 1), totalKnownPages() + 1));
  failedPage = 0;
  const nonce = loadNonce;
  const existingSlice = getPageItems(p);
  const pageSize = getPageSize();

  if (existingSlice.length === pageSize || (existingSlice.length > 0 && !catalogSources.length)) {
    currentPage = p;
    items = existingSlice;
    renderHeroSlideshow();
    renderCards();
    renderPaginationControls();
    window.scrollTo({ top: 0, behavior: reduceMotion || matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    ensureNextPagesPreloaded(currentPage, nonce);
    return;
  }

  skeleton();
  try {
    await ensureBufferForPage(p, nonce);
    if (nonce !== loadNonce || intent !== pageIntent) return;
    const loadedSlice = getPageItems(p);
    loading = false;
    if (loadedSlice.length) {
      currentPage = p;
      items = loadedSlice;
    }
    renderHeroSlideshow();
    renderCards();
    renderPaginationControls();
    window.scrollTo({ top: 0, behavior: reduceMotion || matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    ensureNextPagesPreloaded(currentPage, nonce);
  } catch (error) {
    if (nonce === loadNonce && intent === pageIntent) {
      failedPage = p;
      loading = false;
      showMessage(t('connectionError'), error.message, 'retry');
    }
  }
}

function skeleton() {
  loading = true;
  $('#catalog-message').hidden = true;
  const count = getPageSize();
  $('#catalog').innerHTML = Array.from(
    { length: count },
    () => '<div class="skeleton" aria-hidden="true"><div class="poster-art"></div></div>'
  ).join('');
  $('#result-count').textContent = t('loading');
}

function showMessage(title, description, action = '') {
  const actionLabel = action === 'browse' ? t('browseStories') : t('tryAgain');
  $('#catalog').innerHTML = '';
  $('#catalog-message').hidden = false;
  $('#catalog-message').innerHTML = `${icon(action === 'browse' ? 'empty' : 'alert')}<h3>${esc(
    title
  )}</h3><p>${esc(description)}</p>${
    action
      ? `<button type="button" class="secondary-btn" data-empty-action="${esc(action)}">${esc(
          actionLabel
        )}</button>`
      : ''
  }`;
  $('#result-count').textContent = '';
  $('#pagination-bottom').hidden = true;
}

const episodeNumberFormat = new Intl.NumberFormat('en-US');

function episodeCountLabel(value) {
  const count = Number(value);
  if (!Number.isSafeInteger(count) || count < 1) return '';
  return t(count === 1 ? 'episodeCountOne' : 'episodeCountMany')
    .replace('{count}', episodeNumberFormat.format(count));
}

function seriesEpisodeCount(item) {
  return episodeCountLabel(item.episode_count) || episodeCountLabel(item.episodes?.length);
}

function seriesCardCaption(item, status = '', isResume = false) {
  const title = titleOf(item);
  const summary = status || seriesEpisodeCount(item);
  return `<span class="series-card-caption">
    <strong class="series-card-title"${hasChineseCharacters(title) ? ' lang="zh-CN"' : ''} title="${esc(title)}">${esc(title)}</strong>
    ${summary ? `<span class="series-card-meta${isResume ? ' resume-caption' : ''}">${esc(summary)}</span>` : ''}
  </span>`;
}

function libraryCardStatus(item, progress, watched) {
  const target = playbackTarget(progress);
  if (target?.next) return target.number
    ? t('nextNamedEpisode').replace('{number}', target.number)
    : t('playNextEpisode');
  if (target) return playbackActionLabel(target);
  const total = Number(item.episode_count || item.episodes?.length);
  if (total > 0 && Array.isArray(watched) && watched.length > 0 && watched.length < total) {
    return t('episodesUnwatched').replace('{count}', episodeNumberFormat.format(total - watched.length));
  }
  return '';
}

function renderCards() {
  if (shouldShowHomeShelves()) {
    loading = false;
    $('#catalog').replaceChildren();
    $('#catalog-message').hidden = true;
    return;
  }
  const saved = new Set(favorites().map((x) => x.id));
  const isLibrary = ['history', 'favorite', 'folders'].includes(route);
  let visible = [...items];

  if (hideWatched && !isLibrary) {
    visible = visible.filter((item) => !isSeriesFullyWatched(item.id, item.episode_count || 0));
  }

  $('#catalog-message').hidden = true;
  const pageSize = getPageSize();
  const rankOffset = (currentPage - 1) * pageSize;
  const watchHistory = new Map(history().map(entry => [entry.id, entry]));
  const watched = isLibrary ? watchedEpisodesMap() : {};

  $('#catalog').innerHTML = visible
    .map((item, index) => {
      const h = watchHistory.get(item.id);
      const isDeferred = index >= 10 ? ' is-deferred' : '';
      const imgAttrs =
        index < 5
          ? 'fetchpriority="high"'
          : index >= 10
            ? 'loading="lazy"'
            : '';
      const showNewPill = !isLibrary && route === 'new';

      return `<article class="poster-card${isDeferred}" data-card="${esc(item.id)}" style="--card-idx:${index}">
        <button type="button" class="poster-open" data-open="${esc(item.id)}">
          <div class="poster-art">
            ${
              item.cover_url
                ? `<img data-poster src="${esc(imageUrl(item.cover_url))}" alt="" ${imgAttrs}>`
                : `<span class="card-placeholder">${icon('tv')}</span>`
            }
            ${
              route === 'rank'
                ? `<span class="poster-number">#${rankOffset + index + 1}</span>`
                : showNewPill
                  ? `<span class="card-pill-badge">${esc(t('newEpisodeBadge'))}</span>`
                  : ''
            }
            ${
              h?.duration
                ? `<span class="watch-progress" style="width:${Math.min(
                    100,
                    Math.max(5, (h.time / h.duration) * 100)
                  )}%"></span>`
                : ''
            }
          </div>
          ${seriesCardCaption(item, isLibrary ? libraryCardStatus(item, h, watched[item.id]) : '')}
        </button>
        <button type="button" class="poster-save ${saved.has(item.id) ? 'saved' : ''}" data-save="${esc(
          item.id
        )}" aria-label="${esc(t('watchlist'))}" aria-pressed="${saved.has(item.id)}">${icon(saved.has(item.id) ? 'check' : 'plus')}</button>
      </article>`;
    })
    .join('');

  bindImageFallbacks($('#catalog'));
  $('#result-count').textContent = visible.length
    ? `${t('pageOf')} ${currentPage} · ${visible.length} ${t('itemsCount')}`
    : '';

  if (!visible.length && (route !== 'folders' || (activeFolder && libraryTypeFilter !== 'all'))) {
    showMessage(
      t(route === 'favorite' ? 'emptySaved' : route === 'history' ? 'emptyHistory' : 'noResults'),
      t(
        route === 'favorite'
          ? 'emptySavedDesc'
          : route === 'history'
            ? 'emptyHistoryDesc'
            : 'noResultsDesc'
      ),
      ['history', 'favorite'].includes(route) ? 'browse' : ''
    );
  }
  loading = false;
}

async function loadCatalog() {
  catalogAbort.abort();
  catalogAbort = new AbortController();
  const nonce = ++loadNonce;
  currentPage = 1;
  $('#pagination-bottom').hidden = true;
  failedPage = 0;
  streamBuffer = [];
  streamSeenIds = new Set();
  catalogSources = createCatalogSources();
  if (activeView === 'catalog') $('#catalog-view').hidden = false;
  renderHeading();
  heroSlides = [];
  heroIndex = 0;
  skeleton();
  renderHeroSlideshow();

  try {
    if (['history', 'favorite', 'folders'].includes(route)) {
      const folder = read('duanju.folders', []).find((entry) => entry.id === activeFolder);
      const source = route === 'favorite' ? favorites() : route === 'history' ? history() : folder?.series || [];
      let sourceList = source.map(normalize);
      if (libraryTypeFilter !== 'all') {
        sourceList = sourceList.filter(entry => {
          const known = librarySeriesType(entry) ||
            librarySeriesType(seriesBundles.get(entry.id)?.value?.series) ||
            librarySeriesType(seriesRequests.get(entry.id)?.value);
          return known === libraryTypeFilter;
        });
      }
      if (!librarySortNewest) {
        sourceList = [...sourceList].reverse();
      }
      if (route === 'folders') renderFolders();
      streamBuffer = sourceList;
      items = getPageItems(1);
      renderHeroSlideshow();
      renderCards();
      renderPaginationControls();
      return;
    }

    await ensureBufferForPage(1, nonce);
    if (nonce !== loadNonce) return;

    if (['home', 'live', 'series'].includes(activeNav) && !genre && !$('#search-input').value.trim()) {
      heroSlides = streamBuffer.slice(0, 5);
      heroIndex = 0;
    }

    items = getPageItems(1);
    loading = false;
    renderHeroSlideshow();
    renderCards();
    renderPaginationControls();

    // Proactively lazy-load the next 3 pages in the background
    ensureNextPagesPreloaded(1, nonce);
  } catch (error) {
    if (nonce !== loadNonce) return;
    loading = false;
    renderHeroSlideshow();
    showMessage(t('connectionError'), error.message, 'retry');
  }
}

const catalogRoutes = {
  home: 'discover', live: 'discover', series: 'discover', discover: 'discover', search: 'discover',
  rank: 'rank', new: 'new', favorite: 'favorite', history: 'history', folders: 'folders',
};

function navigate(navKey, options = {}) {
  if (navKey === 'settings') {
    openSettingsPage();
    return;
  }
  const channel = navKey.startsWith('channel:') && catalogGenres.includes(navKey.slice(8));
  activeNav = channel || Object.hasOwn(catalogRoutes, navKey) ? navKey : 'home';
  route = channel ? 'discover' : catalogRoutes[activeNav];
  genre = channel ? navKey.split(':')[1] : '';
  type = options.type || (navKey === 'live' ? 'live' : 'all');
  if (options.sort || navKey === 'home' || navKey === 'search') sort = options.sort || 'hot_score';
  if (navKey === 'folders') {
    activeFolder = '';
    folderFormOpen = Boolean(options.createFolder);
    confirmFolderDelete = false;
    libraryTypeFilter = 'all';
  }
  $('#search-input').value = '';
  showView('catalog');
  if (location.hash !== '#' + activeNav) location.hash = activeNav;
  renderFilterDropdowns();
  loadCatalog();
  if (navKey === 'search') $('#search-input').focus({ preventScroll: true });
}

function findItemById(id) {
  return (
    streamBuffer.find((x) => x.id === id) ||
    heroSlides.find((x) => x.id === id) ||
    shelfItems.get(id) ||
    items.find((x) => x.id === id) ||
    favorites().find((x) => x.id === id) ||
    history().find((x) => x.id === id) ||
    (currentSeries?.id === id ? currentSeries : null)
  );
}

function folderTitleCount(count) {
  return t(count === 1 ? 'folderCountOne' : 'folderCountMany')
    .replace('{count}', episodeNumberFormat.format(count));
}

function folderEditor(folder) {
  const id = folder ? 'folder-rename-form' : 'folder-create-form';
  return `<form id="${id}" class="folder-create-form" ${folderFormOpen ? '' : 'hidden'}>
    <label for="folder-name-input">${esc(t('folderName'))}</label>
    <div class="folder-actions">
      <input id="folder-name-input" autocomplete="off" name="name" required maxlength="48" value="${esc(folder?.name || '')}">
      <button type="submit" class="folder-primary">${esc(t(folder ? 'renameFolder' : 'folderCreate'))}</button>
      <button type="button" class="folder-text-button" data-folder-create-cancel>${esc(t('folderCancel'))}</button>
    </div>
  </form>`;
}

function renderFolders() {
  const folders = read('duanju.folders', []);
  const selected = folders.find(folder => folder.id === activeFolder);
  const pane = $('#folder-pane');
  $('#library-subfilters').hidden = !selected?.series.length;
  if (selected) {
    pane.innerHTML = `
      <div class="folder-detail">
        <button type="button" class="folder-back" data-folder-back>${icon('back')} <span>${esc(t('folderBack'))}</span></button>
        <div class="folder-heading">
          <div class="folder-name-block">
            <span class="folder-mark" aria-hidden="true">${icon('folder')}</span>
            <div><h1 tabindex="-1" data-folder-title>${esc(selected.name)}</h1><p>${esc(folderTitleCount(selected.series.length))}</p></div>
          </div>
          <div class="folder-actions">
            <button type="button" class="folder-text-button" data-folder-rename aria-expanded="${folderFormOpen}" aria-controls="folder-rename-form" ${confirmFolderDelete ? 'hidden' : ''}>${esc(t('renameFolder'))}</button>
            <button type="button" class="folder-text-button" data-folder-delete ${confirmFolderDelete || folderFormOpen ? 'hidden' : ''}>${esc(t('folderDelete'))}</button>
          </div>
        </div>
        ${folderEditor(selected)}
        ${confirmFolderDelete ? `<div class="folder-delete-confirm">
          <span>${esc(t('folderDeletePrompt').replace('{name}', selected.name))}</span>
          <div class="folder-actions">
            <button type="button" class="folder-text-button" data-folder-delete-cancel>${esc(t('folderCancel'))}</button>
            <button type="button" class="folder-danger" data-folder-delete-confirm>${esc(t('folderDelete'))}</button>
          </div>
        </div>` : ''}
      </div>
      ${selected.series.length ? '' : `<div class="folder-empty-card">
        <span class="folder-mark" aria-hidden="true">${icon('empty')}</span>
        <strong>${esc(t('folderEmptyTitle'))}</strong>
        <p>${esc(t('folderEmptyHint'))}</p>
        <button type="button" class="folder-primary" data-nav="discover">${esc(t('discoverPage'))} ${icon('chevronRight')}</button>
      </div>`}`;
    return;
  }

  pane.innerHTML = `
    <div class="folder-heading">
      <h1 data-folder-title tabindex="-1">${esc(t('myFolders'))}</h1>
      <button type="button" class="folder-primary" data-folder-create aria-expanded="${folderFormOpen}" aria-controls="folder-create-form">
        ${icon('plus')} <span>${esc(t('newFolderBtn'))}</span>
      </button>
    </div>
    ${folderEditor()}
    ${folders.length ? `<div class="folder-list">${folders.map(folder =>
      `<button type="button" class="folder-card" data-folder-open="${esc(folder.id)}">
        <span class="folder-mark" aria-hidden="true">${icon('folder')}</span>
        <span class="folder-card-copy"><strong>${esc(folder.name)}</strong><small>${esc(folderTitleCount(folder.series.length))}</small></span>
        <span class="folder-chevron" aria-hidden="true">${icon('chevronRight')}</span>
      </button>`).join('')}</div>` : `<div class="folder-empty-card">
        <span class="folder-mark" aria-hidden="true">${icon('folderPlus')}</span>
        <strong>${esc(t('noFoldersTitle'))}</strong>
        <p>${esc(t('folderEmpty'))}</p>
      </div>`}`;
}

$('#folder-pane').addEventListener('submit', event => {
  if (!event.target.matches('#folder-create-form, #folder-rename-form')) return;
  event.preventDefault();
  const name = String(new FormData(event.target).get('name') || '').trim();
  if (!name) return $('#folder-name-input')?.focus();
  const folders = read('duanju.folders', []);
  if (event.target.id === 'folder-rename-form') {
    const folder = folders.find(item => item.id === activeFolder);
    if (!folder) return;
    folder.name = name;
    store('duanju.folders', folders);
    folderFormOpen = false;
    renderFolders();
    $('[data-folder-rename]')?.focus();
    toast(t('folderRenamed'));
    return;
  }
  const folder = { id: crypto.randomUUID(), name, series: [] };
  store('duanju.folders', [...folders, folder]);
  folderFormOpen = false;
  renderFolders();
  $('#folder-pane').querySelector(`[data-folder-open="${folder.id}"]`)?.focus();
  toast(t('folderCreated'));
});

$('#folder-pane').addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.matches('[data-folder-create], [data-folder-create-cancel], [data-folder-rename]')) {
    folderFormOpen = !button.hasAttribute('data-folder-create-cancel') && !folderFormOpen;
    renderFolders();
    if (folderFormOpen) {
      $('#folder-name-input')?.select();
      $('#folder-name-input')?.focus();
    } else {
      $(activeFolder ? '[data-folder-rename]' : '[data-folder-create]')?.focus();
    }
    return;
  }
  if (button.hasAttribute('data-folder-delete') || button.hasAttribute('data-folder-delete-cancel')) {
    confirmFolderDelete = button.hasAttribute('data-folder-delete');
    renderFolders();
    $(confirmFolderDelete ? '[data-folder-delete-cancel]' : '[data-folder-delete]')?.focus();
    return;
  }
  const remove = button.hasAttribute('data-folder-delete-confirm');
  if (!remove && !button.matches('[data-folder-open], [data-folder-back]')) return;
  if (remove) {
    store('duanju.folders', read('duanju.folders', []).filter(folder => folder.id !== activeFolder));
    toast(t('folderDeleted'));
  }
  activeFolder = button.dataset.folderOpen || '';
  folderFormOpen = false;
  confirmFolderDelete = false;
  libraryTypeFilter = 'all';
  loadCatalog();
  $('[data-folder-title]')?.focus({ preventScroll: true });
});

$('#detail-folders').addEventListener('change', (event) => {
  const checkbox = event.target.closest('[data-folder-membership]');
  if (!checkbox || !currentSeries) return;
  const folders = read('duanju.folders', []);
  const folder = folders.find((item) => item.id === checkbox.dataset.folderMembership);
  if (!folder) return;
  folder.series = folder.series.filter((item) => item.id !== currentSeries.id);
  if (checkbox.checked) folder.series.unshift(currentSeries);
  store('duanju.folders', folders);
});

$('#detail-folders').addEventListener('click', event => {
  const button = event.target.closest('[data-folder-move]');
  if (!button || !currentSeries || route !== 'folders') return;
  const folders = read('duanju.folders', []);
  const source = folders.find(folder => folder.id === activeFolder);
  const destination = folders.find(folder => folder.id === button.dataset.folderMove);
  const entry = source?.series.find(item => item.id === currentSeries.id);
  if (!entry || !destination || source === destination) return;
  if (!destination.series.some(item => item.id === entry.id)) destination.series.unshift(entry);
  source.series = source.series.filter(item => item.id !== entry.id);
  store('duanju.folders', folders);
  closeDetails();
  toast(t('folderMoved').replace('{name}', destination.name));
});

function toggleSave(id) {
  const saved = favorites();
  const index = saved.findIndex((x) => x.id === id);
  if (index >= 0) {
    saved.splice(index, 1);
    toast(t('removed'));
  } else {
    const found = findItemById(id);
    if (!found) return;
    const item = currentSeries?.id === id ? { ...found, ...currentSeries } : found;
    const savedAt = Date.now();
    saved.unshift({ ...item, savedAt });
    if (!librarySeriesType(item)) {
      getSeriesMetadata(id).then(metadata => {
        if (!librarySeriesType(metadata)) return;
        const entries = favorites();
        const entry = entries.find(value => value.id === id && value.savedAt === savedAt);
        if (entry) {
          entry.content_type = metadata.content_type;
          if (metadata.type) entry.type = metadata.type;
          if (!entry.description && metadata.description) entry.description = metadata.description;
          store('duanju.favorites', entries);
          if (activeView === 'catalog' && route === 'favorite' && libraryTypeFilter !== 'all') loadCatalog();
        }
      }).catch(() => {});
    }
    toast(t('saved'));
  }
  store('duanju.favorites', saved);
  renderNav();
  renderHeading();
  if (route === 'favorite' && activeView === 'catalog') {
    loadCatalog();
  } else if (activeView === 'catalog') {
    renderHeroSlideshow();
    renderCards();
  }
  if (currentSeries?.id === id) {
    renderSeriesDetailContent();
    updatePlayerSave();
  }
  updateSettingsCounts();
}

/* ==========================================================================
   Vaul-Style Series Detail Bottom-Sheet Drawer (#detail-view)
   ========================================================================== */
const EPISODE_PAGE_SIZE = 30;

function seriesGenreLine(series, limit = Infinity) {
  const values = [series.category, ...(Array.isArray(series.categories) ? series.categories : [])];
  const genres = values
    .filter(value => typeof value === 'string')
    .map(value => value.trim())
    .filter(value => value && !/^(series|剧集)$/i.test(value));
  return [...new Set(genres)].slice(0, limit).join(lang === 'zh' ? '、' : ' · ');
}

function renderSeriesDetailContent() {
  if (!currentSeries) return;
  const isSaved = favorites().some((x) => x.id === currentSeries.id);
  const past = history().find((x) => x.id === currentSeries.id);
  const epCount = episodes.length || currentSeries.episode_count || 0;
  const cover = imageUrl(currentSeries.cover_url);

  const backdrop = $('#detail-backdrop-img');
  if (backdrop.dataset.seriesId !== currentSeries.id) {
    backdrop.dataset.seriesId = currentSeries.id;
    backdrop.parentElement.removeAttribute('data-orientation');
    backdrop.onload = () => {
      backdrop.parentElement.dataset.orientation =
        backdrop.naturalWidth < backdrop.naturalHeight ? 'portrait' : 'landscape';
    };
    backdrop.onerror = () => {
      const fallback = currentSeries?.id === backdrop.dataset.seriesId ? imageUrl(currentSeries.cover_url) : '';
      if (fallback && backdrop.src !== new URL(fallback, location.href).href) {
        backdrop.src = fallback;
      } else {
        backdrop.dataset.artworkFailed = 'true';
        backdrop.hidden = true;
      }
    };
    delete backdrop.dataset.artworkFailed;
    backdrop.hidden = false;
    backdrop.src = endpoint('/api/series/' + encodeURIComponent(currentSeries.id) + '/artwork');
  } else if (cover && backdrop.dataset.artworkFailed === 'true' &&
      backdrop.src !== new URL(cover, location.href).href) {
    delete backdrop.dataset.artworkFailed;
    backdrop.hidden = false;
    backdrop.src = cover;
  }
  const title = titleOf(currentSeries);
  const titleElement = $('#detail-title');
  titleElement.textContent = title;
  if (hasChineseCharacters(title)) titleElement.lang = 'zh-CN';
  else titleElement.removeAttribute('lang');

  const genreLine = $('#detail-genre-line');
  const genres = seriesGenreLine(currentSeries);
  genreLine.textContent = genres;
  genreLine.hidden = !genres;

  const synopsis = $('#detail-synopsis');
  synopsis.textContent = currentSeries.description || t({
    loading: 'loadingSynopsis', ready: 'noSynopsis', error: 'synopsisError',
  }[detailSynopsisState]);
  synopsis.dataset.state = currentSeries.description ? 'ready' : detailSynopsisState;

  const badges = $('#detail-badges');
  const count = episodeCountLabel(epCount);
  badges.innerHTML = count ? `<span class="detail-badge">${esc(count)}</span>` : '';
  badges.hidden = !count;

  const folderMenu = $('#detail-folders');
  const folders = read('duanju.folders', []);
  const source = route === 'folders' ? folders.find(folder =>
    folder.id === activeFolder && folder.series.some(item => item.id === currentSeries.id)) : null;
  const destinations = source ? folders.filter(folder => folder.id !== source.id) : folders;
  folderMenu.hidden = !destinations.length;
  folderMenu.innerHTML = `<summary>${icon('folder')} ${esc(t(source ? 'moveToFolder' : 'folderAdd'))}</summary>
    <div class="folder-options">${destinations.map(folder => source
      ? `<button type="button" data-folder-move="${esc(folder.id)}">${esc(folder.name)}</button>`
      : `<label><input type="checkbox" data-folder-membership="${esc(folder.id)}" ${folder.series.some(item => item.id === currentSeries.id) ? 'checked' : ''}> ${esc(folder.name)}</label>`
    ).join('')}</div>`;

  $('#detail-watch-label').textContent = playbackActionLabel(playbackTarget(past, episodes));

  const saveBtn = $('#detail-save-btn');
  saveBtn.classList.toggle('is-saved', isSaved);
  saveBtn.setAttribute('aria-pressed', String(isSaved));
  if ($('#detail-save-icon')) {
    $('#detail-save-icon').innerHTML = icon(isSaved ? 'check' : 'plus');
  }
  $('#detail-save-label').textContent = isSaved ? t('inLibrary') : t('saveToLibrary');

  $('#detail-episode-summary').textContent = detailEpisodesState === 'error'
    ? t('episodeListError')
    : episodeCountLabel(epCount) || t(detailEpisodesState === 'loading' ? 'loading' : 'episodesEmpty');
  $('#detail-episodes-retry').hidden = detailEpisodesState !== 'error';
  $('#detail-episode-grid').setAttribute('aria-busy', String(detailEpisodesState === 'loading'));

  renderDetailEpisodesGrid();
  renderDetailRecommendations();
}

function distinctEpisodeText(value, episodeNumber) {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text) return '';
  const parts = text.split(/\s*[-–—·:：]\s*/);
  const distinct = parts.filter(part => {
    const normalized = part.normalize('NFKC').trim();
    const label = normalized.match(/^(?:(?:episode|ep\.?|e)\s*#?\s*)?(\d+)$/i) ||
      normalized.match(/^第\s*(\d+)\s*(?:集|话|話|回|期)$/);
    return !label || Number(label[1]) !== episodeNumber;
  });
  return distinct.length === parts.length ? text : distinct.filter(Boolean).join(' · ');
}

function renderEpisodePicker({ ranges, list, index, rangeAttr, episodeAttr, current, withArtwork = false }) {
  const past = history().find((item) => item.id === currentSeries?.id);
  const savedWatched = watchedEpisodesMap()[currentSeries?.id];
  const watched = new Set(Array.isArray(savedWatched) ? savedWatched.map(String) : []);
  const total = Math.ceil(episodes.length / EPISODE_PAGE_SIZE);
  index = Math.max(0, Math.min(index, total - 1));
  ranges.hidden = total <= 1;
  ranges.innerHTML = total > 1 ? customSelectMarkup('player-range-dropdown', t('episodes')) : '';
  if (total > 1) {
    setCustomSelectOptions('player-range-dropdown', Array.from({ length: total }, (_, i) => {
      const start = i * EPISODE_PAGE_SIZE;
      const end = Math.min(episodes.length, start + EPISODE_PAGE_SIZE) - 1;
      return { value: String(i), label: `${t('episodes')} ${episodes[start].number}–${episodes[end].number}` };
    }), String(index));
  }

  const start = index * EPISODE_PAGE_SIZE;
  list.innerHTML = episodes.slice(start, start + EPISODE_PAGE_SIZE).map((ep) => {
    const playing = ep.id === current;
    const recent = ep.id === past?.episodeId || (!past?.episodeId && ep.number === past?.episodeNumber);
    const unavailable = ep.playable === false;
    const customTitle = withArtwork ? distinctEpisodeText(ep.title, ep.number) : '';
    const label = episodeLabel(ep) + (unavailable ? ` · ${t('unavailable')}` : recent && !playing ? ` · ${t('resumeEpisode')}` : '');
    return `<button type="button" class="episode-btn ${playing ? 'active' : ''} ${watched.has(ep.id) ? 'watched' : ''}"
      ${episodeAttr}="${esc(ep.id)}" aria-label="${esc(label)}" title="${esc(label)}"
      ${playing ? 'aria-current="true"' : ''} ${unavailable ? 'disabled' : ''}>
      ${withArtwork ? `<span class="episode-thumb">${ep.cover_url ? `<img data-poster src="${esc(imageUrl(ep.cover_url))}" alt="" loading="lazy">` : ''}</span>
        <span class="episode-card-title"><strong>${esc(episodeLabel(ep))}</strong>${customTitle ? `<small>${esc(customTitle)}</small>` : ''}</span>` : `<span>${esc(ep.number)}</span>`}
      ${playing ? icon('play') : ''}
    </button>`;
  }).join('');
  if (withArtwork) bindImageFallbacks(list);
  return index;
}

function renderDetailEpisodesGrid() {
  const listEl = $('#detail-episode-grid');
  const rangesEl = $('#detail-episode-ranges');
  if (!listEl || !rangesEl) return;

  // Update toolbar button icons & states
  const sortBtn = $('#detail-ep-sort-btn');
  if (sortBtn) {
    sortBtn.classList.toggle('active', detailEpSortDesc);
    sortBtn.title = t(detailEpSortDesc ? 'episodeSortDesc' : 'episodeSortAsc');
    sortBtn.setAttribute('aria-label', sortBtn.title);
  }
  const viewBtn = $('#detail-ep-view-toggle');
  if (viewBtn) {
    viewBtn.innerHTML = icon(detailEpViewMode === 'list' ? 'grid' : 'list');
    viewBtn.title = t(detailEpViewMode === 'list' ? 'gridView' : 'listView');
    viewBtn.setAttribute('aria-label', viewBtn.title);
  }

  let filtered = [...episodes];
  if (detailEpSearchQuery) {
    const q = detailEpSearchQuery.toLowerCase();
    filtered = filtered.filter(
      (ep) =>
        String(ep.number).includes(q) ||
        episodeLabel(ep).toLowerCase().includes(q) ||
        String(ep.title || '').toLowerCase().includes(q)
    );
  }
  if (detailEpSortDesc) {
    filtered.reverse();
  }

  const total = Math.ceil(filtered.length / EPISODE_PAGE_SIZE);
  detailEpisodeRangeIndex = Math.max(0, Math.min(detailEpisodeRangeIndex, Math.max(0, total - 1)));
  rangesEl.hidden = total <= 1;
  rangesEl.innerHTML =
    total > 1
      ? Array.from({ length: total }, (_, i) => {
          const start = i * EPISODE_PAGE_SIZE;
          const end = Math.min(filtered.length, start + EPISODE_PAGE_SIZE) - 1;
          return `<button type="button" class="range-btn ${
            i === detailEpisodeRangeIndex ? 'active' : ''
          }" data-detail-ep-range="${i}" aria-pressed="${i === detailEpisodeRangeIndex}">${
            filtered[start].number
          }–${filtered[end].number}</button>`;
        }).join('')
      : '';

  const start = detailEpisodeRangeIndex * EPISODE_PAGE_SIZE;
  const pageSlice = filtered.slice(start, start + EPISODE_PAGE_SIZE);
  const past = history().find((item) => item.id === currentSeries?.id);
  const fallbackCover = currentSeries?.cover_url ? imageUrl(currentSeries.cover_url) : '';

  listEl.classList.toggle('is-list-view', detailEpViewMode === 'list');
  listEl.classList.toggle('is-grid-view', detailEpViewMode === 'grid');

  if (!pageSlice.length) {
    const key = { loading: 'loading', error: 'episodeListError', ready: 'episodesEmpty' }[detailEpisodesState];
    listEl.innerHTML = `<p class="shelf-status">${esc(t(key))}</p>`;
    return;
  }

  if (detailEpViewMode === 'grid') {
    listEl.innerHTML = pageSlice
      .map((ep) => {
        const recent =
          ep.id === past?.episodeId || (!past?.episodeId && ep.number === past?.episodeNumber);
        const watched = isEpisodeWatched(currentSeries?.id, ep.id);
        const unavailable = ep.playable === false;
        const label = episodeLabel(ep);
        return `<button type="button" class="episode-btn ${recent ? 'active' : ''} ${
          watched ? 'watched' : ''
        }" data-watch-episode="${esc(ep.id)}" aria-label="${esc(label)}" title="${esc(label)}" ${
          unavailable ? 'disabled' : ''
        }>
          <span>${esc(ep.number)}</span>
        </button>`;
      })
      .join('');
    return;
  }

  // ShuttleTV Rich 16:9 Horizontal Episode List View
  listEl.innerHTML = pageSlice
    .map((ep) => {
      const recent =
        ep.id === past?.episodeId || (!past?.episodeId && ep.number === past?.episodeNumber);
      const watched = isEpisodeWatched(currentSeries?.id, ep.id);
      const unavailable = ep.playable === false;
      const thumbUrl = ep.cover_url ? imageUrl(ep.cover_url) : fallbackCover;
      const label = episodeLabel(ep);
      const title = distinctEpisodeText(ep.title, ep.number);
      const description = distinctEpisodeText(ep.description, ep.number);
      const heading = title ? `${label} · ${title}` : label;
      const showDescription = description && description.toLocaleLowerCase() !== title.toLocaleLowerCase();

      return `<div class="shuttle-ep-row ${recent ? 'active' : ''} ${
        watched ? 'is-watched' : ''
      }">
        <button type="button" class="shuttle-ep-thumb-btn" data-watch-episode="${esc(ep.id)}" ${
          unavailable ? 'disabled' : ''
        } aria-label="${esc(heading)}">
          ${
            thumbUrl
              ? `<img data-poster src="${esc(thumbUrl)}" alt="" loading="lazy" decoding="async">`
              : `<span class="card-placeholder">${icon('tv')}</span>`
          }
          <span class="shuttle-ep-play-badge">${icon('play')}</span>
        </button>
        <button type="button" class="shuttle-ep-meta" data-watch-episode="${esc(ep.id)}" ${unavailable ? 'disabled' : ''}>
          <strong>${esc(heading)}</strong>
          ${unavailable ? `<span class="shuttle-ep-sub">${esc(t('unavailable'))}</span>` : ''}
          ${showDescription ? `<span class="shuttle-ep-desc">${esc(description)}</span>` : ''}
        </button>
        <div class="shuttle-ep-actions">
          <button type="button" class="shuttle-ep-eye-btn ${
            watched ? 'is-watched' : ''
          }" data-toggle-ep-watched="${esc(ep.id)}" aria-pressed="${watched}" aria-label="${esc(t('episodeWatched'))}" title="${esc(
            t('episodeWatched')
          )}">
            ${icon(watched ? 'check' : 'eye')}
          </button>
          <button type="button" class="shuttle-ep-go-btn" data-watch-episode="${esc(ep.id)}" ${
            unavailable ? 'disabled' : ''
          } aria-label="${esc(controlLabel('Play', '播放') + ' · ' + episodeLabel(ep))}">
            ${icon('chevronRight')}
          </button>
        </div>
      </div>`;
    })
    .join('');

  bindImageFallbacks(listEl);
}

function renderDetailRecommendations() {
  const card = $('#detail-recommendations-card');
  const grid = $('#detail-recommendations-grid');
  if (!card || !grid || !currentSeries) return;

  const pool = [...streamBuffer, ...heroSlides, ...shelfItems.values()];
  const seen = new Set([currentSeries.id]);
  const recs = [];
  for (const candidate of pool) {
    if (!candidate?.id || seen.has(candidate.id)) continue;
    seen.add(candidate.id);
    recs.push(candidate);
    if (recs.length >= 6) break;
  }

  card.hidden = recs.length === 0;
  if (!recs.length) return;

  const saved = new Set(favorites().map((x) => x.id));
  grid.innerHTML = recs
    .map((item) => {
      return `<article class="poster-card" data-card="${esc(item.id)}">
        <button type="button" class="poster-open" data-open="${esc(item.id)}">
          <div class="poster-art">
            ${
              item.cover_url
                ? `<img data-poster src="${esc(imageUrl(item.cover_url))}" alt="" loading="lazy">`
                : `<span class="card-placeholder">${icon('tv')}</span>`
            }
          </div>
          ${seriesCardCaption(item)}
        </button>
        <button type="button" class="poster-save ${saved.has(item.id) ? 'saved' : ''}" data-save="${esc(
          item.id
        )}" aria-label="${esc(t('watchlist'))}" aria-pressed="${saved.has(item.id)}">${icon(
          saved.has(item.id) ? 'check' : 'plus'
        )}</button>
      </article>`;
    })
    .join('');
  bindImageFallbacks(grid);
}

function normalizeEpisodes(list) {
  return list.map((e) => ({ ...e, id: String(e.id), number: Number(e.number) }));
}

function openSeriesDetail(id) {
  if (activeView === 'catalog') detailScroll = window.scrollY;
  if (activeView === 'player' && currentSeries?.id !== id) { recordProgress(true); stopStream(); currentEpisode = null; }
  const previous = currentSeries?.id === id ? currentSeries : null;
  const bundle = seriesBundles.get(id);
  const cachedBundle = bundle?.expires > Date.now() ? bundle.value : undefined;
  const metadata = seriesRequests.get(id);
  currentSeries = { id, title: t('loading'), ...findItemById(id), ...previous,
    ...(metadata?.expires > Date.now() ? metadata.value : null), ...cachedBundle?.series };
  if (Array.isArray(cachedBundle?.episodes)) episodes = normalizeEpisodes(cachedBundle.episodes);
  const keepEpisodes = Array.isArray(cachedBundle?.episodes) || (previous && episodes.length);
  if (!keepEpisodes) episodes = [];
  detailSynopsisState = currentSeries.description ? 'ready' : 'loading';
  detailEpisodesState = keepEpisodes ? 'ready' : 'loading';
  detailEpisodeRangeIndex = 0;
  detailEpSearchQuery = '';
  if ($('#detail-ep-search-input')) $('#detail-ep-search-input').value = '';
  if ($('#detail-ep-search-wrap')) $('#detail-ep-search-wrap').hidden = true;

  showView('detail');
  $('#detail-view').scrollTop = 0;
  $('#detail-folders').open = false;
  location.hash = `series/${encodeURIComponent(id)}`;

  const nonce = ++detailNonce;
  const isOpen = () => nonce === detailNonce && activeView === 'detail';
  const restoreRange = () => {
    const past = history().find((x) => x.id === id);
    const index = episodes.findIndex((ep) => ep.id === past?.episodeId);
    if (index >= 0) detailEpisodeRangeIndex = Math.floor(index / EPISODE_PAGE_SIZE);
  };
  restoreRange();
  renderSeriesDetailContent();

  if (cachedBundle?.series?.title && Array.isArray(cachedBundle.episodes)) return;
  getSeriesBundle(id).then(bundle => {
    if (!isOpen()) return;
    currentSeries = normalize({ ...currentSeries, ...bundle.series });
    detailSynopsisState = bundle.series?.title ? 'ready' : 'error';
    if (Array.isArray(bundle.episodes)) {
      episodes = normalizeEpisodes(bundle.episodes);
      detailEpisodesState = 'ready';
      restoreRange();
    } else if (!keepEpisodes) {
      detailEpisodesState = 'error';
    }
    renderSeriesDetailContent();
  }).catch(() => {
    if (!isOpen()) return;
    detailSynopsisState = 'error';
    if (!keepEpisodes) detailEpisodesState = 'error';
    renderSeriesDetailContent();
  });
}

/* ==========================================================================
   Full-Page Cinema Player View (#player-view)
   ========================================================================== */
function updatePlayerSave() {
  const saved = Boolean(currentSeries && favorites().some((x) => x.id === currentSeries.id));
  $('#player-favorite').classList.toggle('is-saved', saved);
  $('#player-favorite').setAttribute('aria-pressed', String(saved));
}

function episodeLabel(ep) {
  return lang === 'zh' ? `第 ${ep?.number || 1} 集` : `${t('episode')} ${ep?.number || 1}`;
}

function renderEpisodeList() {
  episodeRangeIndex = renderEpisodePicker({
    ranges: $('#episode-ranges'), list: $('#episode-list'),
    index: episodeRangeIndex, rangeAttr: 'data-ep-range', episodeAttr: 'data-episode',
    current: currentEpisode?.id, withArtwork: true,
  });
}

function renderPlayerDetails() {
  if (!currentSeries) return;
  $('#player-title').textContent = titleOf(currentSeries);
  $('#player-episode-label').textContent = currentEpisode ? episodeLabel(currentEpisode) : '';
  const cover = imageUrl(currentSeries.cover_url);
  if (cover) {
    $('#player-cover').src = cover;
    $('#player-state-art').src = cover;
  } else {
    $('#player-cover').removeAttribute('src');
    $('#player-state-art').removeAttribute('src');
  }
  $('#episode-count').textContent = episodeCountLabel(episodes.length);

  renderEpisodeList();

  $('#playing-position').textContent =
    currentEpisode && episodes.length
      ? `${episodeLabel(currentEpisode)} ${t('of')} ${episodes.length}`
      : '';
  const curIdx = episodes.findIndex((x) => x.id === currentEpisode?.id);
  $('#previous-episode').disabled = curIdx <= 0 || !episodes.slice(0, curIdx).some((ep) => ep.playable !== false);
  $('#next-episode').disabled = curIdx < 0 || !episodes.slice(curIdx + 1).some((ep) => ep.playable !== false);
  updatePlayerSave();
}

async function openPlayerPage(seriesId, targetEpisodeId = '') {
  if (activeView === 'player' && currentSeries?.id !== seriesId) {
    finishWatchMeasurement();
    recordProgress(true);
    stopStream();
    currentEpisode = null;
  }
  const intent = ++playerNonce;
  if (!currentSeries || currentSeries.id !== seriesId || !episodes.length) {
    const initial = findItemById(seriesId);
    const originHash = location.hash;
    let bundle;
    try {
      bundle = await getSeriesBundle(seriesId);
    } catch (error) {
      if (intent === playerNonce && originHash === location.hash) {
        toast(error.message);
        if (activeView === 'catalog' && !items.length) loadCatalog();
      }
      return;
    }
    if (intent !== playerNonce || originHash !== location.hash) return;
    currentSeries = normalize({ ...initial, ...(bundle.series || {}) });
    if (!Array.isArray(bundle.episodes)) {
      episodes = [];
      if (activeView === 'player') {
        stopStream();
        currentEpisode = null;
        currentJob = null;
        renderPlayerDetails();
        updateStreamBadgeAndHud(null);
        playerError(t('episodeListError'));
      } else {
        toast(t('episodeListError'));
        if (activeView === 'catalog' && !items.length) loadCatalog();
      }
      return;
    }
    episodes = normalizeEpisodes(bundle.episodes);
  }

  const target = playbackTarget(history().find((x) => x.id === seriesId), episodes);
  const chosenEpisodeId = String(targetEpisodeId || target?.id || '');
  const chosenEp = episodes.find(ep => ep.id === chosenEpisodeId && ep.playable !== false) ||
    episodes.find(ep => ep.playable !== false);

  currentQuality = defaultQuality || 'auto';
  currentSpeed = defaultSpeed || '1';
  setCustomSelectValue('quality-dropdown', currentQuality);
  setCustomSelectValue('speed-dropdown', currentSpeed);

  showView('player');
  applyNeuralState();

  if (!chosenEp) {
    stopStream();
    currentEpisode = null;
    currentJob = null;
    episodeQualities = [];
    renderPlayerDetails();
    renderQualitySelectOptions();
    updateStreamBadgeAndHud(null);
    playerError(t('noEpisodes'));
    return;
  }

  location.hash = `watch/${encodeURIComponent(seriesId)}/${encodeURIComponent(chosenEp.id)}`;
  await playEpisode(chosenEp.id, currentQuality);
}

function playerError(message) {
  $('#player-state').hidden = false;
  $('#player-state').classList.remove('mid-buffer');
  $('#player-state').classList.add('error');
  $('#player-state-title').textContent = t('playError');
  $('#player-state-description').textContent = message || t('playErrorDesc');
  $('#retry-play').hidden = false;
}

let activeStreamEvents;
let activePlaybackRequest;
function stopStream() {
  hideNextUp();
  pendingPlaybackIntent = undefined;
  activePlaybackRequest?.abort();
  activeStreamEvents?.abort();
  activePlaybackRequest = undefined;
  activeStreamEvents = undefined;
  if (hls) {
    hls.destroy();
    hls = null;
  }
  const v = $('#video');
  videoResampler?.reset();
  v.pause();
  v.removeAttribute('src');
  v.load();
}

function recordProgress(force = false, completed = false) {
  const v = $('#video');
  if (activeView !== 'player' || !activeStreamEvents || !currentSeries || !currentEpisode ||
      !Number.isFinite(v.duration) || !v.currentTime) return;
  if (!force && Date.now() - lastSave < 2500) return;
  lastSave = Date.now();
  const entries = history().filter((x) => x.id !== currentSeries.id);
  const next = adjacentPlayableEpisode(episodes, currentEpisode.id);
  entries.unshift({
    ...currentSeries,
    episodeId: currentEpisode.id,
    episodeNumber: currentEpisode.number,
    time: v.currentTime,
    duration: v.duration,
    completed: completed || v.ended,
    nextEpisodeId: next?.id ?? null,
    nextEpisodeNumber: next?.number ?? null,
    watchedAt: Date.now(),
  });
  store('duanju.history', entries.slice(0, 150));
}

function updateStreamBadgeAndHud(job) {
  const qLabel = job?.quality || 'auto';
  const baseLabel = qLabel === 'auto' ? '—' : qLabel;
  $('#active-stream-badge').textContent = baseLabel;
  const v = $('#video');
  const resText =
    v.videoWidth && v.videoHeight
      ? `${v.videoWidth}×${v.videoHeight}`
      : job?.resolution || baseLabel;
  $('#hud-res').textContent = resText;
  $('#hud-codec').textContent = job?.codec || 'H.264 / AAC';
  $('#hud-bitrate').textContent = job?.bitrate ? `${(job.bitrate / 1000).toFixed(0)} kbps` : '—';
  let bufSec = 0;
  try {
    if (v.buffered && v.buffered.length) {
      const end = v.buffered.end(v.buffered.length - 1);
      bufSec = Math.max(0, end - v.currentTime);
    }
  } catch {}
  $('#hud-buffer').textContent = `${bufSec.toFixed(1)}s`;
}

function hlsBufferConfig() {
  if (bufferMode === 'fast') {
    return { maxBufferLength: 16, backBufferLength: 20, liveSyncDurationCount: 1 };
  }
  if (bufferMode === 'stable') {
    return { maxBufferLength: 60, backBufferLength: 60, liveSyncDurationCount: 2 };
  }
  return { maxBufferLength: 32, backBufferLength: 35, liveSyncDurationCount: 1 };
}

async function attachStream(url, nonce, seek, shouldPlay = true) {
  if (!window.Hls) {
    await loadPlayerScript('/vendor/hls.min.js').catch(() => {});
    if (nonce !== playerNonce) return;
  }
  const Hls = window.Hls;
  const video = $('#video');
  const target = endpoint(url);
  $('#video-placeholder').hidden = true;

  const streamEvents = new AbortController();
  activeStreamEvents = streamEvents;
  let hasSeeked = false;
  const applyInitialSeekAndPlay = () => {
    if (nonce !== playerNonce) return;
    if (!hasSeeked && seek > 0) {
      hasSeeked = true;
      try {
        video.currentTime = seek;
      } catch {}
    }
    video.defaultPlaybackRate = video.playbackRate = Number(currentSpeed) || 1;
    video.loop = $('#loop-episode').checked;
    pendingPlaybackIntent = undefined;
    if (shouldPlay) video.play().catch(() => {
      if (nonce === playerNonce) $('#player-state').hidden = true;
    });
    else { video.pause(); $('#player-state').hidden = true; }
    updateStreamBadgeAndHud(currentJob);
  };

  if (Hls?.isSupported()) {
    const bufCfg = hlsBufferConfig();
    hls = new Hls({
      ...bufCfg,
      startPosition: seek > 0 ? seek : 0,
      manifestLoadingMaxRetry: 8,
      manifestLoadingRetryDelay: 350,
      levelLoadingMaxRetry: 8,
      levelLoadingRetryDelay: 350,
      fragLoadingMaxRetry: 8,
      fragLoadingRetryDelay: 350,
    });
    let manifestParsed = false;
    let recoveries = 0;

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      if (nonce !== playerNonce) return;
      manifestParsed = true;
      if (video.readyState >= 1) applyInitialSeekAndPlay();
      else video.addEventListener('loadedmetadata', applyInitialSeekAndPlay, { once: true, signal: streamEvents.signal });
    });

    hls.on(Hls.Events.ERROR, (_, data) => {
      if (nonce !== playerNonce || !data.fatal) return;
      recoveries++;
      if (recoveries <= 6) {
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          setTimeout(() => {
            if (nonce !== playerNonce || !hls) return;
            if (!manifestParsed) hls.loadSource(target);
            else hls.startLoad();
          }, 350);
          return;
        }
        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
          return;
        }
      }
      playerError(t('playErrorDesc'));
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });

    hls.loadSource(target);
    hls.attachMedia(video);
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = target;
    video.addEventListener('loadedmetadata', applyInitialSeekAndPlay, { once: true, signal: streamEvents.signal });
    video.load();
  } else {
    playerError(t('playErrorDesc'));
  }
}

async function playEpisode(id, quality = currentQuality, seekOverride, shouldPlay = true) {
  const ep = episodes.find((x) => x.id === id);
  if (!ep || ep.playable === false) return;
  recordProgress(true);
  const knownQualities = currentEpisode?.id === id ? episodeQualities : [];
  finishWatchMeasurement();
  const nonce = ++playerNonce;
  stopStream();
  episodeQualities = knownQualities;
  const playbackRequest = new AbortController();
  activePlaybackRequest = playbackRequest;
  const requestSignal = () => AbortSignal.any([playbackRequest.signal, AbortSignal.timeout(60_000)]);
  currentJob = null;
  updateStreamBadgeAndHud(null);
  currentEpisode = ep;
  trackCurrentPage();
  lastSave = 0;
  currentQuality = quality || defaultQuality || 'auto';

  if (episodes.length > EPISODE_PAGE_SIZE) {
    const idx = episodes.findIndex((x) => x.id === ep.id);
    if (idx >= 0) episodeRangeIndex = Math.floor(idx / EPISODE_PAGE_SIZE);
  }

  renderPlayerDetails();
  $('#player-state').hidden = false;
  $('#player-state').classList.remove('error', 'mid-buffer');
  $('#player-state-title').textContent = t('preparing');
  $('#player-state-description').textContent = t('preparingDesc');
  $('#retry-play').hidden = true;
  $('#video-placeholder').hidden = true;

  const past = history().find((x) => x.id === currentSeries?.id && x.episodeId === ep.id);
  const resumeTime = past && !progressComplete(past) ? past.time : 0;
  const seek = seekOverride ?? (resumeTime > 0 ? resumeTime : skipIntro ? 5 : 0);
  pendingPlaybackIntent = { episodeId: id, seek, shouldPlay };
  $('#quality-dropdown').setAttribute('aria-busy', 'true');
  renderQualitySelectOptions();
  if (!window.Hls) loadPlayerScript('/vendor/hls.min.js').catch(() => {});

  try {
    let job = await api('/api/playback', {
      method: 'POST',
      signal: requestSignal(),
      body: JSON.stringify({
        seriesId: currentSeries.id,
        episodeId: ep.id,
        quality: currentQuality,
      }),
    });
    if (nonce !== playerNonce) return;
    currentJob = job;
    renderQualitySelectOptions(job.qualities || []);
    setCustomSelectValue('quality-dropdown', currentQuality);
    updateStreamBadgeAndHud(job);

    for (let n = 0; n < 240; n++) {
      if (nonce !== playerNonce) return;
      if (['error', 'failed'].includes(job.status)) {
        throw new Error(job.errorCode === 'ANONYMOUS_LIMITED' ? t('sourceUnavailable') : job.error || t('playErrorDesc'));
      }
      if (playbackReadyAt(job, seek)) {
        if (currentQuality !== 'auto' && job.quality) currentQuality = job.quality;
        renderQualitySelectOptions(job.qualities || []);
        await attachStream(job.manifestUrl, nonce, seek, shouldPlay);
        return;
      }
      await new Promise((r) => setTimeout(r, 450));
      if (nonce !== playerNonce) return;
      job = await api('/api/playback/' + encodeURIComponent(job.id || job.jobId), { signal: requestSignal() });
      if (nonce !== playerNonce) return;
      currentJob = job;
      if (job.qualities?.length) {
        renderQualitySelectOptions(job.qualities);
        setCustomSelectValue('quality-dropdown', currentQuality);
      }
      updateStreamBadgeAndHud(job);
    }
    throw new Error(t('playErrorDesc'));
  } catch (error) {
    if (nonce === playerNonce && !playbackRequest.signal.aborted) playerError(error.message);
  } finally {
    if (nonce === playerNonce) $('#quality-dropdown').setAttribute('aria-busy', 'false');
  }
}

function progressComplete({ completed, duration, time }) {
  if (typeof completed === 'boolean') return completed;
  return duration > 0 && time >= duration - Math.min(3, duration * 0.08);
}

function adjacentPlayableEpisode(list, episodeId, delta = 1) {
  const index = list.findIndex(episode => episode.id === episodeId);
  if (index < 0) return undefined;
  return delta > 0
    ? list.slice(index + 1).find(episode => episode.playable !== false)
    : list.slice(0, index).findLast(episode => episode.playable !== false);
}

function playbackTarget(progress, list = []) {
  if (!progress?.episodeId) return null;
  if (!progressComplete(progress)) {
    return progress.time > 0 ? { id: progress.episodeId, number: progress.episodeNumber, next: false } : null;
  }
  if (list.length) {
    const next = adjacentPlayableEpisode(list, progress.episodeId);
    return next ? { id: next.id, number: next.number, next: true } : null;
  }
  if (progress.nextEpisodeId) return { id: progress.nextEpisodeId, number: progress.nextEpisodeNumber, next: true };
  if (progress.nextEpisodeId === undefined && progress.episodeNumber < Number(progress.episode_count)) {
    // Older history entries resolve the actual next playable episode when opened.
    return { next: true };
  }
  return null;
}

function playbackActionLabel(target) {
  if (!target) return t('playS1E1');
  if (!target.number) return t(target.next ? 'playNextEpisode' : 'resumeEpisode');
  return t(target.next ? 'playNamedEpisode' : 'resumeNamedEpisode').replace('{number}', target.number);
}

function playSelectedEpisode(episode) {
  if (!episode || !currentSeries) return;
  location.hash = `watch/${encodeURIComponent(currentSeries.id)}/${encodeURIComponent(episode.id)}`;
  playEpisode(episode.id, currentQuality, 0);
}

function nextEpisode(delta = 1) {
  playSelectedEpisode(adjacentPlayableEpisode(episodes, currentEpisode?.id, delta));
}

function stopNextUpCountdown() {
  clearTimeout(nextUpTimer);
  $('#next-up-progress').hidden = true;
}

function hideNextUp() {
  stopNextUpCountdown();
  $('#next-up-panel').hidden = true;
  nextUpEpisode = null;
}

function playNextUp() {
  const next = nextUpEpisode;
  const hadFocus = $('#next-up-panel').contains(document.activeElement);
  hideNextUp();
  if (hadFocus) $('#play-toggle').focus({ preventScroll: true });
  playSelectedEpisode(next);
}

function cancelNextUp() {
  hideNextUp();
  $('#next-episode').focus({ preventScroll: true });
}

function showNextUp() {
  hideNextUp();
  nextUpEpisode = adjacentPlayableEpisode(episodes, currentEpisode?.id);
  if (!nextUpEpisode) return;
  $('#next-up-heading').textContent = episodeLabel(nextUpEpisode);
  $('#next-up-panel').hidden = false;
  if (autoplayNext && !document.hidden) {
    $('#next-up-progress').hidden = false;
    nextUpTimer = setTimeout(() => {
      if (document.hidden) stopNextUpCountdown();
      else playNextUp();
    }, 6000);
  }
}

function seekBy(deltaSeconds) {
  const v = $('#video');
  if (!Number.isFinite(v.duration) && !v.currentTime) return;
  const maxT = Number.isFinite(v.duration) ? v.duration : v.currentTime + 300;
  v.currentTime = Math.max(0, Math.min(maxT, v.currentTime + deltaSeconds));
}

/* ==========================================================================
   Full-Page Settings View (#settings-view)
   ========================================================================== */
function updateSettingsCounts() {
  $('#settings-history-count').textContent = `${history().length} ${t('itemsCount')}`;
  $('#settings-saved-count').textContent = `${favorites().length} ${t('itemsCount')}`;
}

function openSettingsPage() {
  updateSettingsCounts();
  applyTheme();
  applyAppearance();
  applyGridDensity();
  applyPlayerPrefs();
  showView('settings');
  location.hash = 'settings';
}

const settingsSectionIcons = {
  playbackSection: 'play',
  appearanceSection: 'palette',
  homeLayout: 'grid',
  neuralSection: 'sparkles',
  ambientSection: 'link',
};
let activeSettingsSectionIndex = 0;

function renderSettingsSections() {
  const titles = Array.from(document.querySelectorAll('.settings-card-title'));
  $('#settings-sections').replaceChildren(
    ...titles.map((heading, idx) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.classList.toggle('active', idx === activeSettingsSectionIndex);
      const iconName =
        heading.dataset.sectionIcon ||
        settingsSectionIcons[heading.dataset.i18n] ||
        'sliders';
      button.innerHTML = `${icon(iconName)}<span>${esc(t(heading.dataset.i18n))}</span>`;
      if (idx === activeSettingsSectionIndex) button.setAttribute('aria-current', 'true');
      button.onclick = () => {
        activeSettingsSectionIndex = idx;
        $$('#settings-sections button').forEach((b, i) => {
          b.classList.toggle('active', i === idx);
          if (i === idx) b.setAttribute('aria-current', 'true');
          else b.removeAttribute('aria-current');
        });
        heading.closest('.settings-card')?.scrollIntoView({
          block: 'start',
          behavior: reduceMotion || matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        });
      };
      return button;
    })
  );

  $('#accent-options').innerHTML =
    Object.entries(accentColors)
      .map(
        ([key, color]) =>
          `<button type="button" data-accent="${key}" style="--swatch:${color[0]}" aria-label="${
            color[lang === 'zh' ? 3 : 2]
          }" aria-pressed="${accentChoice === key}"></button>`
      )
      .join('') +
    `<button type="button" data-accent="custom" style="--swatch:${esc(
      customAccentHex
    )}" aria-label="${esc(t('customColor'))}" aria-pressed="${accentChoice === 'custom'}"></button>
    <input type="color" id="custom-accent-picker" class="accent-custom-input" value="${esc(customAccentHex)}" aria-label="${esc(t('customColor'))}">`;
  renderHomeLayoutOptions();
}

function readHomeLayout() {
  const preferences = read('duanju.homeLayout', []);
  const byKey = new Map(genreShelves.map((shelf) => [shelf.key, { ...shelf, visible: true }]));
  const ordered = [];
  const releasePreferences = preferences.filter(item => item.key === 'airing' || item.key === 'new');
  for (const preference of preferences) {
    const key = preference.key === 'new' ? 'airing' : preference.key;
    if (!byKey.has(key)) continue;
    const visible = key === 'airing' ? releasePreferences.some(item => item.visible) : Boolean(preference.visible);
    ordered.push({ ...byKey.get(key), visible });
    byKey.delete(key);
  }
  const shelves = [...ordered, ...byKey.values()];
  return [shelves.find(shelf => shelf.key === 'continue'), ...shelves.filter(shelf => shelf.key !== 'continue')];
}

function renderHomeLayoutOptions() {
  const layout = readHomeLayout();
  $('#home-layout-options').innerHTML = layout.map(({ key, copyKey, visible }, index) => `
    <div class="settings-row" data-layout-key="${key}">
      <div class="settings-label"><strong>${esc(t(copyKey))}</strong></div>
      <button class="icon-btn" type="button" data-move-section="-1" aria-label="${esc(t('moveUp'))}" ${index <= 1 ? 'disabled' : ''}>${icon('chevronDown')}</button>
      <button class="icon-btn" type="button" data-move-section="1" aria-label="${esc(t('moveDown'))}" ${index === 0 || index === layout.length - 1 ? 'disabled' : ''}>${icon('chevronDown')}</button>
      <input type="checkbox" role="switch" data-layout-visible aria-label="${esc(t(copyKey))}" ${visible ? 'checked' : ''}>
    </div>`).join('');
  // Rotate first button's chevron upward via inline transform
  $$('#home-layout-options [data-move-section="-1"] svg').forEach((svg) => {
    svg.style.transform = 'rotate(180deg)';
  });
}

const homeLayoutControl = $('#home-layout-options');
function saveHomeLayout(event) {
  const action = event.target.closest('[data-move-section], [data-layout-visible]');
  if (!action || (event.type === 'click' && action.matches('input'))) return;
  const layout = readHomeLayout();
  const index = layout.findIndex((shelf) => shelf.key === action.closest('[data-layout-key]').dataset.layoutKey);
  if (action.matches('input')) {
    layout[index].visible = action.checked;
  } else {
    const nextIndex = index + Number(action.dataset.moveSection);
    [layout[index], layout[nextIndex]] = [layout[nextIndex], layout[index]];
  }
  store('duanju.homeLayout', layout.map(({ key, visible }) => ({ key, visible })));
  if (action.matches('button')) {
    const key = action.closest('[data-layout-key]').dataset.layoutKey;
    renderHomeLayoutOptions();
    homeLayoutControl.querySelector(`[data-layout-key="${key}"] input`)?.focus();
  }
}
homeLayoutControl.addEventListener('click', saveHomeLayout);
homeLayoutControl.addEventListener('change', saveHomeLayout);

$('#accent-options').addEventListener('click', (event) => {
  const button = event.target.closest('[data-accent]');
  if (!button) return;
  accentChoice = button.dataset.accent;
  if (accentChoice === 'custom' && $('#custom-accent-picker')) {
    $('#custom-accent-picker').click();
  }
  store('duanju.accent', accentChoice);
  $('#accent-options').querySelectorAll('button').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
  applyAppearance();
});

$('#accent-options').addEventListener('input', (event) => {
    if (event.target.id !== 'custom-accent-picker') return;
    customAccentHex = event.target.value || '#a78bfa';
    accentChoice = 'custom';
    store('duanju.customAccent', customAccentHex);
    store('duanju.accent', 'custom');
    $('#accent-options').querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.accent === 'custom')));
    $('#accent-options [data-accent="custom"]').style.setProperty('--swatch', customAccentHex);
    applyAppearance();
  });

const advertising = $('#ad-slot');
const adSlides = [
  { id: 'advertise', title: 'adTitleAdvertise', description: 'adTextAdvertise' },
  { id: 'local', title: 'adTitleLocal', description: 'adTextLocal' },
  { id: 'sponsor', title: 'adTitleSponsor', description: 'adTextSponsor' },
];
let adIndex = 0;
let adRotation;
let adImpressionTimer;
let adInView = false;
let adHovered = false;
let adPaused = false;
let adCounted = false;
let lastTrackedPage = '';
let lastPlayedEpisode = '';
let watchMeasurement;

function trackSiteEvent(type, fields = {}, immediate = false) {
  const page = activeView !== 'catalog' ? activeView : activeNav.startsWith('channel:') ? 'discover' : activeNav;
  window.coconutAnalytics?.track(type, { page, ...fields }, immediate);
}

function mediaEventFields(includeEpisode = true) {
  return {
    series: currentSeries?.id,
    episode: includeEpisode ? currentEpisode?.id : undefined,
    title: currentSeries?.title === t('loading') ? undefined : currentSeries?.title,
  };
}

function trackCurrentPage() {
  const media = ['detail', 'player'].includes(activeView) ? mediaEventFields(activeView === 'player') : {};
  const key = [activeView, activeView === 'catalog' ? activeNav : '', media.series, media.episode].join(':');
  if (key === lastTrackedPage) return;
  lastTrackedPage = key;
  trackSiteEvent('page_view', media);
  if (activeView === 'detail' && media.series) trackSiteEvent('series_view', media);
}

function beginWatchMeasurement() {
  if (!window.coconutAnalytics || activeView !== 'player' || !activeStreamEvents || !currentEpisode) return;
  const media = mediaEventFields();
  const key = media.series + ':' + media.episode;
  if (lastPlayedEpisode !== key) {
    trackSiteEvent('play_start', media);
    lastPlayedEpisode = key;
  }
  if (!watchMeasurement) watchMeasurement = { media, time: $('#video').currentTime, timestamp: performance.now(), seconds: 0 };
}

function flushWatchTime(immediate = false) {
  if (!watchMeasurement) return;
  const seconds = Math.min(60, Math.floor(watchMeasurement.seconds));
  if (seconds > 0) {
    trackSiteEvent('watch_time', { ...watchMeasurement.media, seconds }, immediate);
    watchMeasurement.seconds -= seconds;
  }
}

function sampleWatchTime() {
  if (!watchMeasurement) return;
  const video = $('#video');
  const timestamp = performance.now();
  const elapsed = (timestamp - watchMeasurement.timestamp) / 1000;
  const advanced = (video.currentTime - watchMeasurement.time) / Math.max(0.25, video.playbackRate);
  watchMeasurement.time = video.currentTime;
  watchMeasurement.timestamp = timestamp;
  if (!video.paused && !video.seeking && advanced > 0 && advanced <= elapsed + 1) {
    watchMeasurement.seconds += Math.min(elapsed, advanced);
    if (watchMeasurement.seconds >= 30) flushWatchTime();
  }
}

function finishWatchMeasurement() {
  flushWatchTime(true);
  watchMeasurement = undefined;
}

function scheduleAdvertising() {
  clearTimeout(adRotation);
  clearTimeout(adImpressionTimer);
  if (advertising.hidden || !adInView || document.hidden || activeView !== 'catalog') return;
  if (!adCounted) {
    adImpressionTimer = setTimeout(() => {
      adCounted = true;
      trackSiteEvent('ad_impression', { ad: adSlides[adIndex].id });
    }, 1000);
  }
  if (!adHovered && !advertising.contains(document.activeElement) && !adPaused &&
    !reduceMotion && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    adRotation = setTimeout(() => advanceAd(1), 6500);
  }
}

function updateAdvertising(visible) {
  advertising.hidden = !visible;
  const slide = adSlides[adIndex];
  $('#ad-title').textContent = t(slide.title);
  $('#ad-description').textContent = t(slide.description);
  $('#ad-previous').setAttribute('aria-label', t('previousSlide'));
  $('#ad-next').setAttribute('aria-label', t('nextSlide'));
  const pause = $('#ad-pause');
  pause.setAttribute('aria-pressed', String(adPaused));
  pause.setAttribute('aria-label', t(adPaused ? 'resumeSlides' : 'pauseSlides'));
  pause.innerHTML = adPaused ? icon('play') : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14"/></svg>';
  scheduleAdvertising();
}

function advanceAd(delta) {
  adIndex = (adIndex + delta + adSlides.length) % adSlides.length;
  adCounted = false;
  updateAdvertising(true);
  const copy = $('.ad-slot-copy');
  if (!reduceMotion && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    copy.animate?.([{ opacity: 0.25, transform: 'translateY(4px)' }, { opacity: 1, transform: 'translateY(0)' }], 220);
  }
}

$('#ad-previous').onclick = () => advanceAd(-1);
$('#ad-next').onclick = () => advanceAd(1);
$('#ad-pause').onclick = () => {
  adPaused = !adPaused;
  updateAdvertising(true);
};
$('#ad-contact').onclick = () => trackSiteEvent('ad_click', { ad: adSlides[adIndex].id }, true);
advertising.addEventListener('pointerenter', () => { adHovered = true; scheduleAdvertising(); });
advertising.addEventListener('pointerleave', () => { adHovered = false; scheduleAdvertising(); });
advertising.addEventListener('focusin', scheduleAdvertising);
advertising.addEventListener('focusout', event => {
  if (!advertising.contains(event.relatedTarget)) queueMicrotask(scheduleAdvertising);
});
document.addEventListener('visibilitychange', scheduleAdvertising);
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    adInView = entry.isIntersecting && entry.intersectionRatio >= 0.5;
    scheduleAdvertising();
  }, { threshold: 0.5 }).observe(advertising);
} else {
  function checkAdVisibility() {
    const bounds = advertising.getBoundingClientRect();
    const visibleHeight = Math.min(innerHeight, bounds.bottom) - Math.max(0, bounds.top);
    adInView = bounds.height > 0 && visibleHeight >= bounds.height / 2;
    scheduleAdvertising();
  }
  window.addEventListener('scroll', checkAdVisibility, { passive: true });
  window.addEventListener('resize', checkAdVisibility);
}

const installGuide = $('#install-guide');
const installTip = $('#install-tip');
const standaloneMode = matchMedia('(display-mode: standalone)');
const windowControlsMode = matchMedia('(display-mode: window-controls-overlay)');
let installTipSeen = read('duanju.installTipSeen', false);
let installedInSession = false;
let pendingInstallPrompt;
let installGuideInvoker;

function installPlatform() {
  if (/iPad|iPhone|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'apple';
  return /Android/i.test(navigator.userAgent) ? 'android' : 'desktop';
}

function canShowInstallGuide() {
  return window.isSecureContext !== false && !installedInSession && navigator.standalone !== true &&
    !standaloneMode.matches && !windowControlsMode.matches;
}

function markInstallTipSeen() {
  installTipSeen = true;
  store('duanju.installTipSeen', true);
}

function updateInstallOffer(onHome = shouldShowHomeShelves()) {
  const available = canShowInstallGuide();
  $('#mobile-install').hidden = !available;
  $('#install-settings-row').hidden = !available;
  if (!available || !onHome || installPlatform() === 'desktop') {
    installTip.hidden = true;
  } else if (!installTipSeen) {
    markInstallTipSeen();
    installTip.hidden = false;
  }
}

function openInstallGuide(event) {
  if (!canShowInstallGuide() || installGuide.open) return;
  markInstallTipSeen();
  installTip.hidden = true;
  installGuideInvoker = mobileUtilities.contains(event.currentTarget) ? $('#mobile-more') : event.currentTarget;
  if (installGuideInvoker === $('#mobile-more')) mobileUtilities.hidePopover();
  const platform = installPlatform();
  $$('[data-install-platform]').forEach(step => {
    step.hidden = step.dataset.installPlatform !== platform;
  });
  $('#install-now').hidden = !pendingInstallPrompt;
  installGuide.hidden = false;
  installGuide.showModal();
}

$$('[data-install-guide]').forEach(button => { button.onclick = openInstallGuide; });
$('#dismiss-install-tip').onclick = () => { installTip.hidden = true; };
$('#install-guide-done').onclick = () => closeTopLayer(installGuide);
installGuide.addEventListener('close', () => {
  if (installGuide.open) return;
  installGuide.hidden = true;
  const returnFocus = installGuideInvoker?.closest('[hidden]')
    ? $('#hero-slideshow .hero-watch-btn') : installGuideInvoker;
  returnFocus?.focus({ preventScroll: true });
  installGuideInvoker = undefined;
});
bindDialogLightDismiss(installGuide);

window.addEventListener('beforeinstallprompt', event => {
  if (!canShowInstallGuide()) return;
  event.preventDefault();
  pendingInstallPrompt = event;
  if (installGuide.open) $('#install-now').hidden = false;
});
window.addEventListener('appinstalled', () => {
  installedInSession = true;
  pendingInstallPrompt = undefined;
  markInstallTipSeen();
  updateInstallOffer();
  if (installGuide.open) closeTopLayer(installGuide);
});
for (const mode of [standaloneMode, windowControlsMode]) {
  mode.addEventListener('change', () => {
    updateInstallOffer();
    if (!canShowInstallGuide() && installGuide.open) closeTopLayer(installGuide);
  });
}
$('#install-now').onclick = async () => {
  const prompt = pendingInstallPrompt;
  if (!prompt) return;
  pendingInstallPrompt = undefined;
  $('#install-now').hidden = true;
  try {
    await prompt.prompt();
    if ((await prompt.userChoice).outcome === 'accepted') closeTopLayer(installGuide);
  } catch {
    // The manual instructions remain available if the browser drops the prompt.
  }
};

function refreshApp() {
  recordProgress(true);
  window.location.reload();
}
$$('[data-app-refresh]').forEach(button => { button.onclick = refreshApp; });

const mobileUtilities = $('#mobile-utilities');
const releasePanel = $('#release-alerts');
$('#mobile-episode-alerts').onclick = () => {
  mobileUtilities.hidePopover();
  releasePanel.showPopover();
  $('#release-alerts-heading').focus({ preventScroll: true });
};
releasePanel.addEventListener('toggle', async (event) => {
  if (event.newState !== 'open') return;
  const list = $('#release-alerts-list');
  const saved = favorites().filter((item) => item.episode_count > 0).slice(0, 12);
  list.textContent = t(saved.length ? 'loading' : 'noNewEpisodes');
  if (!saved.length) { releaseUpdateCount = 0; renderNav(); return; }
  const updates = await Promise.allSettled(saved.map(async (item) => {
    const latest = await getSeriesMetadata(item.id);
    const fresh = Number(latest.episode_count) - Number(item.episode_count);
    return fresh > 0 ? { ...item, fresh } : null;
  }));
  const found = updates.filter(result => result.status === 'fulfilled' && result.value).map(result => result.value);
  releaseUpdateCount = found.length;
  renderNav();
  list.innerHTML = found.map((item) =>
    `<button type="button" data-open="${esc(item.id)}"><strong>${esc(titleOf(item))}</strong><small>+${item.fresh} ${esc(t('eps'))}</small></button>`).join('') ||
    esc(t(updates.every((result) => result.status === 'rejected') ? 'connectionErrorDesc' : 'noNewEpisodes'));
});

// Initialize Static Icons
$('#search-icon').innerHTML = icon('search');
if ($('#search-clear-btn')) $('#search-clear-btn').innerHTML = icon('close');
if ($('#settings-header-icon')) $('#settings-header-icon').innerHTML = icon('settings');
if ($('#new-folder-icon')) $('#new-folder-icon').innerHTML = icon('folderPlus');
if ($('#library-sort-icon')) $('#library-sort-icon').innerHTML = icon('sort');
$('#detail-back-icon').innerHTML = icon('close');
$('#detail-play-icon').innerHTML = icon('play');
$('#detail-save-icon').innerHTML = icon('plus');
if ($('#detail-ep-sort-btn')) $('#detail-ep-sort-btn').innerHTML = icon('sort');
if ($('#detail-ep-search-toggle')) $('#detail-ep-search-toggle').innerHTML = icon('search');
if ($('#detail-ep-search-icon')) $('#detail-ep-search-icon').innerHTML = icon('search');
if ($('#detail-ep-view-toggle')) $('#detail-ep-view-toggle').innerHTML = icon('grid');
if ($('#detail-mark-watched-icon')) $('#detail-mark-watched-icon').innerHTML = icon('eye');
$$('[data-icon]').forEach((el) => {
  const key = el.dataset.icon;
  if (paths[key]) el.innerHTML = icon(key);
});
$('#player-back-icon').innerHTML = icon('back');
$('#player-favorite').innerHTML = icon('favorite');
$('#start-play').innerHTML = icon('play');
$('#previous-episode').innerHTML = icon('previous');
$('#seek-back').innerHTML = icon('seekBack');
$('#seek-forward').innerHTML = icon('seekForward');
$('#next-episode').innerHTML = icon('next');
$('#stream-settings-toggle').innerHTML = icon('sliders');
$('#pip-toggle').innerHTML = icon('pip');
$('#fullscreen-toggle').innerHTML = icon('fullscreen');
$('#player-episodes-toggle').innerHTML = icon('list');
$('#player-episodes-close').innerHTML = icon('close');
$('#cast-toggle').innerHTML = icon('cast');
$$('.custom-select-chevron').forEach((el) => {
  el.innerHTML = icon('chevronDown');
});

const catalogView = $('#catalog-view');
let synopsisPrefetchTimer;
let lastSynopsisPrefetch = 0;

function scheduleSynopsisPrefetch(event) {
  const trigger = event.target.closest('[data-open], [data-watch-hero]');
  if (!trigger || trigger.contains(event.relatedTarget)) return;
  clearTimeout(synopsisPrefetchTimer);
  synopsisPrefetchTimer = setTimeout(() => {
    if (activeView !== 'catalog' || !trigger.isConnected || Date.now() - lastSynopsisPrefetch < 500) return;
    const id = trigger.dataset.open || trigger.dataset.watchHero;
    if (seriesBundles.get(id)?.expires > Date.now()) return;
    lastSynopsisPrefetch = Date.now();
    getSeriesBundle(id).catch(() => {});
  }, event.type === 'focusin' ? 120 : 180);
}

catalogView.addEventListener('pointerover', scheduleSynopsisPrefetch);
catalogView.addEventListener('focusin', scheduleSynopsisPrefetch);
catalogView.addEventListener('pointerdown', event => {
  const id = event.target.closest('[data-open]')?.dataset.open;
  if (id) getSeriesBundle(id).catch(() => {});
}, { passive: true });
catalogView.addEventListener('pointerout', (event) => {
  const trigger = event.target.closest('[data-open], [data-watch-hero]');
  if (trigger && !trigger.contains(event.relatedTarget)) clearTimeout(synopsisPrefetchTimer);
});
window.addEventListener('resize', () => {
  if (!$('#genre-shelves').hidden) $$('.genre-shelf').forEach(updateShelfArrows);
});

const heroSurface = $('#hero-slideshow');
let heroTouch;
heroSurface.addEventListener('touchstart', event => {
  if (event.touches.length !== 1 || event.target.closest('button, a')) {
    heroTouch = undefined;
    return;
  }
  const { clientX, clientY } = event.touches[0];
  heroTouch = { x: clientX, y: clientY };
}, { passive: true });
heroSurface.addEventListener('touchend', event => {
  if (!heroTouch) return;
  const touch = event.changedTouches[0];
  const x = touch.clientX - heroTouch.x;
  const y = touch.clientY - heroTouch.y;
  heroTouch = undefined;
  if (Math.abs(x) >= 50 && Math.abs(x) > Math.abs(y) * 1.4) {
    setHeroSlide(heroIndex + (x < 0 ? 1 : -1));
  }
}, { passive: true });
heroSurface.addEventListener('touchcancel', () => { heroTouch = undefined; });
heroSurface.addEventListener('pointerenter', () => { heroReading = true; scheduleHeroRotation(); });
heroSurface.addEventListener('pointerleave', () => { heroReading = heroSurface.contains(document.activeElement); scheduleHeroRotation(); });
heroSurface.addEventListener('focusin', () => { heroReading = true; scheduleHeroRotation(); });
heroSurface.addEventListener('focusout', (event) => {
  if (!heroSurface.contains(event.relatedTarget) && !heroSurface.matches(':hover')) {
    heroReading = false;
    scheduleHeroRotation();
  }
});
document.addEventListener('visibilitychange', () => {
  scheduleHeroRotation();
});

// Delegated Document Click Handler
document.addEventListener('click', (event) => {
  if (!$('#filters').hidden && !event.target.closest('#filters, #catalog-filters-toggle')) {
    setCatalogFiltersOpen(false);
  }
  // Uniform Custom Liquid Glass Dropdowns
  const selectTrigger = event.target.closest('.custom-select-trigger');
  if (selectTrigger) {
    event.stopPropagation();
    if (!$('#stream-settings-popover').hidden && !selectTrigger.closest('#stream-settings-popover')) setStreamSettingsOpen(false);
    const wrap = selectTrigger.closest('.custom-select');
    const menu = wrap?.querySelector('.custom-select-menu');
    if (!wrap || !menu) return;
    const willOpen = !wrap.classList.contains('is-open');
    closeAllCustomSelects(wrap);
    wrap.classList.toggle('is-open', willOpen);
    menu.hidden = !willOpen;
    selectTrigger.setAttribute('aria-expanded', String(willOpen));
    if (willOpen) {
      if (wrap.closest('.player-select-row')) $('#stream-settings-popover').scrollTop = 0;
      if (wrap.closest('.catalog-filter-row, #episode-ranges')) {
        const bounds = selectTrigger.getBoundingClientRect();
        const frame = wrap.closest('#player-episodes')?.getBoundingClientRect();
        const below = Math.min(window.innerHeight, frame?.bottom ?? window.innerHeight) - bounds.bottom - 12;
        const above = bounds.top - Math.max(0, frame?.top ?? 0) - 12;
        const desired = Math.min(menu.scrollHeight, 192, window.innerHeight * 0.3);
        const openUp = below < desired && above > below;
        wrap.classList.toggle('drop-up', openUp);
        menu.style.maxHeight = Math.max(44, Math.min(desired, openUp ? above : below)) + 'px';
      }
      const parentCard = wrap.closest(
        '.settings-card, .unified-control-bar, .browse-header, .playback-tools'
      );
      if (parentCard) parentCard.classList.add('has-open-select');
      const parentRow = wrap.closest('.settings-row');
      if (parentRow) parentRow.classList.add('has-open-select');
      const selected = menu.querySelector('.is-selected');
      if (wrap.id === 'catalog-page-dropdown' && selected) {
        menu.scrollTop = selected.offsetTop - (menu.clientHeight - selected.offsetHeight) / 2;
      }
      if (event.detail === 0) selected?.focus({ preventScroll: true });
    }
    return;
  }

  const selectOption = event.target.closest('.custom-select-option');
  if (selectOption) {
    event.stopPropagation();
    const dropdownId = selectOption.dataset.selectId;
    const val = selectOption.dataset.optValue;
    setCustomSelectValue(dropdownId, val);
    closeAllCustomSelects();
    selectOption.closest('.custom-select')?.querySelector('.custom-select-trigger')?.focus();
    handleCustomSelectChange(dropdownId, val);
    return;
  }

  if (!event.target.closest('.custom-select')) {
    closeAllCustomSelects();
  }

  const popover = $('#stream-settings-popover');
  const toggleBtn = $('#stream-settings-toggle');
  if (!popover.hidden && !popover.contains(event.target) && !toggleBtn.contains(event.target)) setStreamSettingsOpen(false);

  // Search Mode Tabs & Quick Tag Chips
  const searchModeBtn = event.target.closest('[data-search-mode]');
  if (searchModeBtn) {
    searchMode = searchModeBtn.dataset.searchMode || 'titles';
    renderHeading();
    return;
  }

  const quickTag = event.target.closest('[data-quick-tag]');
  if (quickTag) {
    navigate('channel:' + quickTag.dataset.quickTag);
    return;
  }

  // Library Type Sub-Filters & Sort
  const libTypeBtn = event.target.closest('[data-lib-type]');
  if (libTypeBtn) {
    libraryTypeFilter = libTypeBtn.dataset.libType || 'all';
    renderHeading();
    loadCatalog();
    return;
  }

  // Toggle Episode Watched Eye Button in Detail Drawer
  const epWatchedBtn = event.target.closest('[data-toggle-ep-watched]');
  if (epWatchedBtn && currentSeries) {
    event.stopPropagation();
    toggleEpisodeWatched(currentSeries.id, epWatchedBtn.dataset.toggleEpWatched);
    renderDetailEpisodesGrid();
    return;
  }

  // Hero Spotlight Slideshow Controls
  if (event.target.closest('[data-hero-pause]')) {
    heroPaused = !heroPaused;
    renderHeroSlideshow();
    return;
  }
  const heroDot = event.target.closest('[data-hero-dot]');
  if (heroDot) {
    setHeroSlide(Number(heroDot.dataset.heroDot) || 0);
    return;
  }

  const heroDir = event.target.closest('[data-hero-dir]');
  if (heroDir) {
    const delta = heroDir.dataset.heroDir === 'prev' ? -1 : 1;
    setHeroSlide(heroIndex + delta);
    return;
  }

  const watchHero = event.target.closest('[data-watch-hero]');
  if (watchHero) {
    openPlayerPage(watchHero.dataset.watchHero);
    return;
  }

  const shelfControl = event.target.closest('[data-shelf-dir], [data-shelf-retry], [data-shelf-view]');
  if (shelfControl) {
    const shelf = shelfControl.closest('.genre-shelf');
    if (shelfControl.hasAttribute('data-shelf-dir')) {
      const track = shelf.querySelector('.shelf-track');
      track.scrollBy({ left: Number(shelfControl.dataset.shelfDir) * track.clientWidth, behavior: reduceMotion || matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    } else if (shelfControl.hasAttribute('data-shelf-view')) {
      const source = genreShelves.find((entry) => entry.key === shelf.dataset.shelf);
      navigate(source.nav, { type: source.type, sort: shelf.dataset.sort });
    } else {
      loadGenreShelf(shelf, shelf.dataset.sort);
    }
    return;
  }

  // Pagination Controls
  const pageAction = event.target.closest('[data-page-action]');
  if (pageAction && !pageAction.disabled) {
    const dir = pageAction.dataset.pageAction;
    if (dir === 'prev' && currentPage > 1) {
      goToPage(currentPage - 1);
    } else if (dir === 'next') {
      goToPage(currentPage + 1);
    }
    return;
  }

  const catalogType = event.target.closest('[data-catalog-type]');
  if (catalogType) {
    if (type !== catalogType.dataset.catalogType) {
      setCustomSelectValue('type-dropdown', catalogType.dataset.catalogType);
      handleCustomSelectChange('type-dropdown', catalogType.dataset.catalogType);
    }
    return;
  }

  const nav = event.target.closest('[data-nav]');
  if (nav) {
    event.preventDefault();
    navigate(nav.dataset.nav);
    return;
  }

  const save = event.target.closest('[data-save]');
  if (save) {
    event.stopPropagation();
    toggleSave(save.dataset.save);
    return;
  }

  // Clicking a card in Browse opens the Full Series Detail Page
  const card = event.target.closest('[data-open]');
  if (card) {
    openSeriesDetail(card.dataset.open);
    return;
  }

  // Clicking an episode on the Series Detail Page opens the Full-Page Player
  const watchEp = event.target.closest('[data-watch-episode]');
  if (watchEp && currentSeries) {
    openPlayerPage(currentSeries.id, watchEp.dataset.watchEpisode);
    return;
  }

  const detailRange = event.target.closest('[data-detail-ep-range]');
  if (detailRange) {
    detailEpisodeRangeIndex = Number(detailRange.dataset.detailEpRange) || 0;
    renderDetailEpisodesGrid();
    $('#detail-episode-ranges .range-btn.active')?.focus();
    return;
  }

  const epRange = event.target.closest('[data-ep-range]');
  if (epRange) {
    episodeRangeIndex = Number(epRange.dataset.epRange) || 0;
    renderEpisodeList();
    $('#episode-ranges .range-btn.active')?.focus();
    return;
  }

  const ep = event.target.closest('[data-episode]');
  if (ep && currentSeries) {
    setEpisodeDrawerOpen(false);
    $('#player-episodes-toggle').focus({ preventScroll: true });
    playSelectedEpisode(episodes.find(episode => episode.id === ep.dataset.episode));
    return;
  }

  const neuralBtn = event.target.closest('[data-neural-opt]');
  if (neuralBtn) {
    setNeuralMode(neuralBtn.dataset.neuralOpt, true);
    return;
  }

  const themeBtn = event.target.closest('[data-theme-opt]');
  if (themeBtn) {
    store('duanju.theme', themeBtn.dataset.themeOpt);
    applyTheme();
    return;
  }

  const langBtn = event.target.closest('[data-lang-opt]');
  if (langBtn) {
    setLanguagePreference(langBtn.dataset.langOpt);
    return;
  }

  const colsBtn = event.target.closest('[data-cols-opt]');
  if (colsBtn) {
    gridCols = Number(colsBtn.dataset.colsOpt) || 6;
    store('duanju.gridCols', gridCols);
    applyGridDensity();
    // Re-slice current page to exact multiple of new column count (0 empty slots)
    ensureBufferForPage(currentPage, loadNonce).then(() => {
      items = getPageItems(currentPage);
      renderCards();
      renderPaginationControls();
    });
    return;
  }

  const fitBtn = event.target.closest('[data-fit-opt]');
  if (fitBtn) {
    videoFit = fitBtn.dataset.fitOpt;
    store('duanju.videoFit', videoFit);
    applyPlayerPrefs();
    return;
  }

  const seekBtn = event.target.closest('[data-seek-opt]');
  if (seekBtn) {
    seekStep = Number(seekBtn.dataset.seekOpt) || 10;
    store('duanju.seekStep', seekStep);
    applyPlayerPrefs();
    return;
  }

  const action = event.target.closest('[data-empty-action]');
  if (action) {
    if (action.dataset.emptyAction === 'browse') navigate('series');
    else if (failedPage) goToPage(failedPage);
    else loadCatalog();
  }
});

const searchInput = $('#search-input');
let searchTimer;
$('#search-form').addEventListener('submit', (event) => {
  event.preventDefault();
  clearTimeout(searchTimer);
  renderHeading();
  loadCatalog();
});
searchInput.addEventListener('input', () => {
  if ($('#search-clear-btn')) $('#search-clear-btn').hidden = !searchInput.value.trim();
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    if (activeNav === 'search' && activeView === 'catalog') {
      renderHeading();
      loadCatalog();
    }
  }, 320);
});
if ($('#search-clear-btn')) {
  $('#search-clear-btn').onclick = () => {
    searchInput.value = '';
    $('#search-clear-btn').hidden = true;
    renderHeading();
    loadCatalog();
    searchInput.focus({ preventScroll: true });
  };
}

if ($('#library-sort-toggle')) {
  $('#library-sort-toggle').onclick = () => {
    librarySortNewest = !librarySortNewest;
    renderHeading();
    loadCatalog();
  };
}
if ($('#new-folder-quick-btn')) {
  $('#new-folder-quick-btn').onclick = () => {
    navigate('folders', { createFolder: true });
    $('#folder-name-input')?.focus();
  };
}

$('#catalog-filters-toggle').onclick = (event) => {
  const opening = $('#filters').hidden;
  closeAllCustomSelects();
  setCatalogFiltersOpen(opening);
  if (opening && event.detail === 0) {
    $('#type-dropdown .custom-select-trigger').focus({ preventScroll: true });
  }
};

$('#catalog-filter-reset').onclick = () => {
  type = activeNav === 'live' ? 'live' : 'all';
  genre = '';
  if (activeNav.startsWith('channel:')) {
    activeNav = 'discover';
    window.history.replaceState(null, '', '#discover');
    renderNav();
  }
  renderFilterDropdowns();
  $('#type-dropdown .custom-select-trigger').focus();
  loadCatalog();
};

$('#surprise-button').onclick = () => {
  const pool = streamBuffer.length ? streamBuffer : heroSlides;
  if (!pool.length) return;
  const choice = pool[Math.floor(Math.random() * pool.length)];
  openSeriesDetail(choice.id);
};

function closeDetails() {
  if (activeView !== 'detail') return;
  showView('catalog');
  window.history.replaceState(null, '', '#' + activeNav);
  if (route === 'folders' || !items.length) loadCatalog();
  else renderHeroSlideshow();
  window.scrollTo({ top: detailScroll, behavior: 'instant' });
}
$('#detail-back-btn').onclick = closeDetails;
$('#detail-view').addEventListener('cancel', (event) => {
  event.preventDefault();
  closeDetails();
});
$('#detail-view').addEventListener('close', (event) => {
  if (activeView === 'detail' && !event.currentTarget.open) closeDetails();
});
bindDialogLightDismiss($('#detail-view'), closeDetails);

$('#detail-watch-btn').onclick = () => {
  if (!currentSeries) return;
  openPlayerPage(currentSeries.id);
};
if ($('#detail-ep-sort-btn')) {
  $('#detail-ep-sort-btn').onclick = () => {
    detailEpSortDesc = !detailEpSortDesc;
    detailEpisodeRangeIndex = 0;
    renderDetailEpisodesGrid();
  };
}
if ($('#detail-ep-search-toggle')) {
  $('#detail-ep-search-toggle').onclick = () => {
    const bar = $('#detail-ep-search-wrap');
    if (!bar) return;
    bar.hidden = !bar.hidden;
    $('#detail-ep-search-toggle').classList.toggle('active', !bar.hidden);
    if (!bar.hidden) {
      $('#detail-ep-search-input')?.focus();
    } else if (detailEpSearchQuery) {
      detailEpSearchQuery = '';
      if ($('#detail-ep-search-input')) $('#detail-ep-search-input').value = '';
      renderDetailEpisodesGrid();
    }
  };
}
if ($('#detail-ep-search-input')) {
  $('#detail-ep-search-input').addEventListener('input', (event) => {
    detailEpSearchQuery = event.target.value.trim();
    detailEpisodeRangeIndex = 0;
    renderDetailEpisodesGrid();
  });
}
if ($('#detail-ep-view-toggle')) {
  $('#detail-ep-view-toggle').onclick = () => {
    detailEpViewMode = detailEpViewMode === 'list' ? 'grid' : 'list';
    store('duanju.epViewMode', detailEpViewMode);
    renderDetailEpisodesGrid();
  };
}
if ($('#detail-mark-all-watched')) {
  $('#detail-mark-all-watched').onclick = () => {
    if (!currentSeries || !episodes.length) return;
    markAllSeriesEpisodesWatched(currentSeries.id, episodes);
    renderDetailEpisodesGrid();
  };
}

$('#detail-episodes-retry').onclick = () => {
  if (currentSeries) openSeriesDetail(currentSeries.id);
};

$('#detail-save-btn').onclick = () => {
  if (currentSeries) toggleSave(currentSeries.id);
};

$('#player-to-detail').onclick = () => {
  if (currentSeries) {
    openSeriesDetail(currentSeries.id);
  } else {
    showView('catalog');
    location.hash = activeNav;
  }
};

$('#settings-liquid-glass').onchange = (event) => {
  liquidGlass = event.target.checked;
  store('duanju.liquidGlass', liquidGlass);
  applyAppearance();
};
$('#settings-reduce-motion').onchange = (event) => {
  reduceMotion = event.target.checked;
  store('duanju.reduceMotion', reduceMotion);
  applyAppearance();
};
$('#settings-spoilers').onchange = (event) => {
  hideSpoilers = event.target.checked;
  store('duanju.hideSpoilers', hideSpoilers);
  applyAppearance();
};
if ($('#settings-hide-watched')) {
  $('#settings-hide-watched').onchange = (event) => {
    hideWatched = event.target.checked;
    store('duanju.hideWatched', hideWatched);
    applyAppearance();
    if (activeView === 'catalog') renderCards();
  };
}
if ($('#settings-skip-intro')) {
  $('#settings-skip-intro').onchange = (event) => {
    skipIntro = event.target.checked;
    store('duanju.skipIntro', skipIntro);
    applyPlayerPrefs();
  };
}
if ($('#device-alerts-toggle')) {
  $('#device-alerts-toggle').onchange = (event) => {
    deviceAlerts = event.target.checked;
    store('duanju.deviceAlerts', deviceAlerts);
    renderNav();
  };
}

$('#settings-autoplay').onchange = () => {
  autoplayNext = $('#settings-autoplay').checked;
  store('duanju.autoplay', autoplayNext);
  applyPlayerPrefs();
};

$('#settings-preload-pages').onchange = () => {
  preloadPagesEnabled = $('#settings-preload-pages').checked;
  store('duanju.preloadPages', preloadPagesEnabled);
  if (preloadPagesEnabled) {
    ensureNextPagesPreloaded(currentPage, loadNonce);
  }
};

$('#clear-history-btn').onclick = () => {
  store('duanju.history', []);
  store('duanju.watchedEpisodes', {});
  updateSettingsCounts();
  renderNav();
  if (route === 'history') {
    items = [];
    streamBuffer = [];
    renderCards();
    renderPaginationControls();
  }
  toast(t('historyCleared'));
};

$('#clear-saved-btn').onclick = () => {
  store('duanju.favorites', []);
  updateSettingsCounts();
  renderNav();
  if (route === 'favorite') {
    items = [];
    streamBuffer = [];
    renderCards();
    renderPaginationControls();
  }
  toast(t('savedCleared'));
};

$('#reset-defaults-btn').onclick = () => {
  store('duanju.theme', 'dark');
  store('duanju.videoFit', 'contain');
  store('duanju.seekStep', 10);
  videoFit = 'contain';
  seekStep = 10;
  store('duanju.gridCols', 6);
  store('duanju.liquidGlass', true);
  store('duanju.reduceMotion', false);
  store('duanju.hideSpoilers', false);
  store('duanju.hideWatched', false);
  store('duanju.skipIntro', false);
  store('duanju.accent', 'teal');
  store('duanju.homeLayout', []);
  store('duanju.videoUpscale', 'off');
  store('duanju.defaultQuality', 'auto');
  store('duanju.defaultSpeed', '1');
  store('duanju.bufferMode', 'balanced');
  store('duanju.autoplay', true);
  store('duanju.hud', false);
  store('duanju.preloadPages', false);

  liquidGlass = true;
  reduceMotion = false;
  hideSpoilers = false;
  hideWatched = false;
  skipIntro = false;
  accentChoice = 'teal';
  gridCols = 6;
  neuralMode = 'off';
  defaultQuality = 'auto';
  defaultSpeed = '1';
  currentQuality = 'auto';
  currentSpeed = '1';
  bufferMode = 'balanced';
  autoplayNext = true;
  showHud = false;
  preloadPagesEnabled = false;

  applyTheme();
  applyAppearance();
  applyGridDensity();
  applyPlayerPrefs();
  renderSettingsSections();
  toast(t('defaultsReset'));
};

$('#player-favorite').onclick = () => currentSeries && toggleSave(currentSeries.id);
$('#start-play').onclick = () => {
  if (currentEpisode) playEpisode(currentEpisode.id, currentQuality);
  else if (currentSeries) openPlayerPage(currentSeries.id);
};
$('#previous-episode').onclick = () => nextEpisode(-1);
$('#next-episode').onclick = () => nextEpisode(1);
$('#next-up-play').onclick = playNextUp;
$('#next-up-cancel').onclick = cancelNextUp;
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopNextUpCountdown();
});
$('#video').addEventListener('seeking', () => {
  if (!$('#video').ended) hideNextUp();
});
$('#video').addEventListener('play', hideNextUp);
$('#seek-back').onclick = () => seekBy(-seekStep);
$('#seek-forward').onclick = () => seekBy(seekStep);

$('#retry-play').onclick = () => {
  if (!currentEpisode) {
    if (currentSeries) openPlayerPage(currentSeries.id);
    return;
  }
  const video = $('#video');
  const intent = pendingPlaybackIntent?.episodeId === currentEpisode.id ? pendingPlaybackIntent : null;
  const seek = intent?.seek ?? (video.readyState >= 1 ? video.currentTime : undefined);
  playEpisode(currentEpisode.id, currentQuality, seek, intent?.shouldPlay ?? true);
};

function setStreamSettingsOpen(open) {
  if (open && nextUpEpisode) stopNextUpCountdown();
  const panel = $('#stream-settings-popover');
  if (!open && panel.querySelector('.custom-select.is-open')) closeAllCustomSelects();
  panel.hidden = !open;
  if (open) panel.scrollTop = 0;
  $('#stream-settings-toggle').setAttribute('aria-expanded', String(open));
  if (activeView === 'player') revealControls();
}

function setEpisodeDrawerOpen(open) {
  if (!open) closeAllCustomSelects();
  $('#player-episodes').hidden = !open;
  $('#player-episodes-toggle').setAttribute('aria-expanded', String(open));
  if (open) {
    if (nextUpEpisode) stopNextUpCountdown();
    const index = episodes.indexOf(currentEpisode);
    episodeRangeIndex = Math.max(0, Math.floor(index / EPISODE_PAGE_SIZE));
    renderEpisodeList();
    $('#episode-jump').hidden = episodes.length <= EPISODE_PAGE_SIZE;
    $('#episode-jump-input').value = '';
    $('#episode-jump-input').removeAttribute('aria-invalid');
    $('#episode-jump-error').hidden = true;
    $('#episode-list').scrollTop = 0;
    $('#episode-list [aria-current="true"]')?.scrollIntoView({ block: 'nearest' });
  }
  if (activeView === 'player') revealControls();
}

$('#episode-jump').addEventListener('submit', event => {
  event.preventDefault();
  const input = $('#episode-jump-input');
  const index = episodes.findIndex(episode => episode.number === Number(input.value.trim()) && episode.playable !== false);
  const error = $('#episode-jump-error');
  error.hidden = index >= 0;
  if (index < 0) {
    error.textContent = t('episodeNotFound');
    input.setAttribute('aria-invalid', 'true');
    input.focus();
    return;
  }
  input.removeAttribute('aria-invalid');
  episodeRangeIndex = Math.floor(index / EPISODE_PAGE_SIZE);
  renderEpisodeList();
  const row = $$('#episode-list [data-episode]')[index % EPISODE_PAGE_SIZE];
  row?.focus({ preventScroll: true });
  row?.scrollIntoView({ block: 'nearest' });
});
$('#episode-jump-input').addEventListener('input', event => {
  event.target.removeAttribute('aria-invalid');
  $('#episode-jump-error').hidden = true;
});

$('#player-episodes-toggle').onclick = (event) => {
  event.stopPropagation();
  closeAllCustomSelects();
  setStreamSettingsOpen(false);
  setEpisodeDrawerOpen($('#player-episodes').hidden);
  if (!$('#player-episodes').hidden) $('#player-episodes-close').focus({ preventScroll: true });
};
$('#player-episodes-close').onclick = () => {
  setEpisodeDrawerOpen(false);
  $('#player-episodes-toggle').focus({ preventScroll: true });
};

$('#stream-settings-toggle').onclick = (event) => {
  event.stopPropagation();
  closeAllCustomSelects();
  setEpisodeDrawerOpen(false);
  const opening = $('#stream-settings-popover').hidden;
  setStreamSettingsOpen(opening);
  if (opening && event.detail === 0) $('#quality-dropdown .custom-select-trigger')?.focus();
};

$('#loop-episode').onchange = () => {
  $('#video').loop = $('#loop-episode').checked;
};

$('#hud-toggle').onchange = () => {
  showHud = $('#hud-toggle').checked;
  store('duanju.hud', showHud);
  applyPlayerPrefs();
  updateStreamBadgeAndHud(currentJob);
};

$('#pip-toggle').onclick = async () => {
  try {
    if (document.pictureInPictureElement) await document.exitPictureInPicture();
    else await $('#video').requestPictureInPicture();
  } catch {
    toast(t('pipUnavailable'));
  }
};

$('#fullscreen-toggle').onclick = async () => {
  const stage = $('#video-stage');
  if (stage.classList.contains('screen-fill')) {
    stage.classList.remove('screen-fill');
    document.body.classList.remove('player-filling-screen');
    return;
  }
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    if (stage.requestFullscreen) {
      await stage.requestFullscreen();
      return;
    }
  } catch {}
  stage.classList.add('screen-fill');
  document.body.classList.add('player-filling-screen');
};

$('#video').addEventListener('timeupdate', () => {
  sampleWatchTime();
  recordProgress();
  if (showHud) updateStreamBadgeAndHud(currentJob);
});
$('#video').addEventListener('loadedmetadata', () => {
  updateStreamBadgeAndHud(currentJob);
  const video = $('#video');
  $('#video-stage').dataset.orientation = video.videoHeight > video.videoWidth ? 'portrait' : 'landscape';
});
$('#video').addEventListener('waiting', () => {
  const v = $('#video');
  if (!v.getAttribute('src') && !hls) return;
  if ($('#player-state').classList.contains('error')) return;
  $('#player-state').hidden = false;
  $('#player-state').classList.add('mid-buffer');
  $('#player-state-title').textContent = t('preparing');
  $('#player-state-description').textContent = t('preparingDesc');
  $('#retry-play').hidden = true;
});
$('#video').addEventListener('canplay', () => {
  if (!$('#player-state').classList.contains('error')) {
    $('#player-state').hidden = true;
    $('#player-state').classList.remove('mid-buffer');
  }
});
$('#video').addEventListener('pause', () => {
  recordProgress(true);
});
$('#video').addEventListener('ended', () => {
  if (activeView !== 'player' || !activeStreamEvents) return;
  finishWatchMeasurement();
  trackSiteEvent('play_complete', mediaEventFields());
  recordProgress(true, true);
  if (currentSeries && currentEpisode && !isEpisodeWatched(currentSeries.id, currentEpisode.id)) {
    toggleEpisodeWatched(currentSeries.id, currentEpisode.id);
  }
  if (!$('#loop-episode').checked) showNextUp();
});
$('#video').addEventListener('playing', () => {
  beginWatchMeasurement();
  $('#player-state').hidden = true;
  $('#player-state').classList.remove('mid-buffer');
  updateStreamBadgeAndHud(currentJob);
});
$('#video').addEventListener('error', () => {
  if ($('#video').getAttribute('src') && !hls) playerError(t('playErrorDesc'));
});

const playbackVideo = $('#video');
const playbackStage = $('#video-stage');
const captionsControl = $('#player-captions');
const captionTracks = () => Array.from(playbackVideo.textTracks || []).filter((track) =>
  track.kind === 'subtitles' || track.kind === 'captions');
function updateCaptions() {
  const tracks = captionTracks();
  captionsControl.hidden = !tracks.length;
  if (!tracks.length) return;
  const selected = tracks.findIndex((track) => track.mode === 'showing');
  setCustomSelectOptions('player-captions', [{ label: t('captionsOff'), value: 'off' },
    ...tracks.map((track, index) => ({ label: track.label || track.language, value: String(index) }))],
    selected < 0 ? 'off' : String(selected));
}
for (const event of ['addtrack', 'removetrack', 'change']) {
  playbackVideo.textTracks?.addEventListener?.(event, updateCaptions);
}
const castControl = $('#cast-toggle');
if (playbackVideo.remote?.watchAvailability) {
  playbackVideo.remote.watchAvailability((available) => { castControl.hidden = !available; }).catch(() => {});
  castControl.onclick = () => playbackVideo.remote.prompt().catch(() => {});
}
const scrubber = $('#playback-seek');
let controlsTimer;

function controlLabel(en, zh) {
  return lang === 'zh' ? zh : en;
}

function formatTime(seconds) {
  const total = Math.max(0, Math.floor(seconds || 0));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

function updatePlaybackControls() {
  const play = $('#play-toggle');
  const mute = $('#mute-toggle');
  const paused = playbackVideo.paused;
  const muted = playbackVideo.muted || playbackVideo.volume === 0;
  const length = Number.isFinite(playbackVideo.duration) ? playbackVideo.duration : 0;
  if (play.dataset.paused !== String(paused)) {
    play.dataset.paused = String(paused);
    play.innerHTML = paused ? icon('play') : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14"/></svg>';
  }
  if (mute.dataset.muted !== String(muted)) {
    mute.dataset.muted = String(muted);
    mute.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9H3 ${muted ? 'm13 0 5 6m0-6-5 6' : 'm13-2a7 7 0 0 1 0 10m2-13a11 11 0 0 1 0 16'}"/></svg>`;
  }
  play.setAttribute('aria-label', paused ? controlLabel('Play', '播放') : controlLabel('Pause', '暂停'));
  mute.setAttribute('aria-label', muted ? controlLabel('Unmute', '取消静音') : controlLabel('Mute', '静音'));
  mute.setAttribute('aria-pressed', String(muted));
  scrubber.disabled = !length;
  scrubber.max = String(length || 1);
  scrubber.value = String(playbackVideo.currentTime);
  scrubber.style.setProperty('--seek-progress', `${length ? Math.min(100, 100 * playbackVideo.currentTime / length) : 0}%`);
  scrubber.setAttribute('aria-valuetext', formatTime(playbackVideo.currentTime));
  $('#playback-time').textContent = formatTime(playbackVideo.currentTime);
  $('#playback-duration').textContent = formatTime(currentJob?.duration || length);
  $('#playback-volume').value = String(playbackVideo.muted ? 0 : playbackVideo.volume);
}

function revealControls() {
  clearTimeout(controlsTimer);
  playbackStage.classList.remove('controls-idle');
  if (playbackVideo.paused) return;
  controlsTimer = setTimeout(() => {
    if (!playbackVideo.paused && !playbackStage.querySelector('.custom-select.is-open') &&
      $('#stream-settings-popover').hidden && $('#player-episodes').hidden && $('#player-state').hidden) {
      playbackStage.classList.add('controls-idle');
    }
  }, 2800);
}

function togglePlayback() {
  if (!hls && !playbackVideo.getAttribute('src')) {
    if ($('#player-state').hidden || $('#player-state').classList.contains('error')) $('#start-play').click();
    return;
  }
  if (playbackVideo.paused) {
    playbackVideo.play().catch(() => {});
  } else playbackVideo.pause();
  revealControls();
}

$('#play-toggle').onclick = togglePlayback;
$('#mute-toggle').onclick = () => {
  const wasMuted = playbackVideo.muted || playbackVideo.volume === 0;
  if (wasMuted && playbackVideo.volume === 0) playbackVideo.volume = 1;
  playbackVideo.muted = !wasMuted;
};
$('#playback-volume').oninput = (event) => {
  playbackVideo.volume = Number(event.target.value);
  playbackVideo.muted = false;
};
scrubber.oninput = () => {
  const requested = Number(scrubber.value);
  const ranges = playbackVideo.seekable;
  if (ranges.length) playbackVideo.currentTime = Math.min(requested, ranges.end(ranges.length - 1));
  else if (Number.isFinite(playbackVideo.duration)) playbackVideo.currentTime = requested;
};
for (const event of ['play', 'pause', 'playing', 'ended', 'emptied']) {
  playbackVideo.addEventListener(event, revealControls);
}
for (const event of ['play', 'pause', 'timeupdate', 'volumechange', 'durationchange', 'emptied']) {
  playbackVideo.addEventListener(event, updatePlaybackControls);
}
playbackStage.addEventListener('pointermove', revealControls);
playbackStage.addEventListener('focusin', revealControls);
playbackStage.addEventListener('focusout', revealControls);
playbackStage.addEventListener('click', (event) => {
  if (event.target !== playbackVideo && event.target !== playbackStage) return;
  if (matchMedia('(pointer: coarse)').matches) {
    if (playbackStage.classList.contains('controls-idle')) revealControls();
    else if (!playbackVideo.paused) playbackStage.classList.add('controls-idle');
  } else togglePlayback();
});
function setLanguagePreference(preference) {
  languagePreference = preference;
  store('duanju.lang', preference);
  lang = preference === 'system' ? deviceLanguage() : preference;
  translate();
  updatePlaybackControls();
}
function switchLanguage() {
  setLanguagePreference(lang === 'en' ? 'zh' : 'en');
}
window.addEventListener('languagechange', () => {
  if (languagePreference !== 'system') return;
  const language = deviceLanguage();
  if (language === lang) return;
  lang = language;
  translate();
  updatePlaybackControls();
});
$('#language-switch').onclick = switchLanguage;
$('#mobile-language-switch').onclick = switchLanguage;
updatePlaybackControls();

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const openSelects = $$('.custom-select.is-open');
    if (openSelects.length) {
      event.preventDefault();
      openSelects[0].querySelector('.custom-select-trigger')?.focus();
      closeAllCustomSelects();
      return;
    }
    if (!$('#filters').hidden) {
      event.preventDefault();
      setCatalogFiltersOpen(false);
      $('#catalog-filters-toggle').focus();
      return;
    }
    if (!$('#stream-settings-popover').hidden) {
      setStreamSettingsOpen(false);
      $('#stream-settings-toggle').focus();
      return;
    }
    if (!$('#player-episodes').hidden) {
      $('#player-episodes-close').click();
      return;
    }
    if (nextUpEpisode) {
      event.preventDefault();
      cancelNextUp();
      return;
    }
    if (playbackStage.classList.contains('screen-fill')) {
      $('#fullscreen-toggle').click();
      return;
    }
  }

  const openSelect = $('.custom-select.is-open');
  if (openSelect && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
    event.preventDefault();
    const opts = [...openSelect.querySelectorAll('.custom-select-option')];
    if (!opts.length) return;
    const curIdx = opts.indexOf(document.activeElement);
    const nextIdx =
      event.key === 'Home' ? 0 : event.key === 'End' ? opts.length - 1 : event.key === 'ArrowDown'
        ? (curIdx + 1) % opts.length
        : (curIdx - 1 + opts.length) % opts.length;
    opts[nextIdx]?.focus();
    return;
  }

  if (event.target.closest('.hero-carousel-controls') && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.preventDefault();
    setHeroSlide(heroIndex + (event.key === 'ArrowLeft' ? -1 : 1));
    return;
  }
  if (event.target.closest('input, textarea, select, button, a')) return;
  if (activeView === 'player') {
    const v = $('#video');
    if (event.key === ' ') {
      event.preventDefault();
      togglePlayback();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      seekBy(seekStep);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      seekBy(-seekStep);
    } else if (event.key.toLowerCase() === 'f') {
      event.preventDefault();
      $('#fullscreen-toggle').click();
    }
  }
});

function handleHashRoute() {
  const hash = location.hash.slice(1) || 'home';
  if (hash === 'settings') {
    if (activeView !== 'settings') openSettingsPage();
    return;
  }
  const seriesMatch = hash.match(/^series\/(\d{4,24})$/);
  if (seriesMatch) {
    const sid = decodeURIComponent(seriesMatch[1]);
    if (activeView !== 'detail' || currentSeries?.id !== sid) {
      openSeriesDetail(sid);
    }
    return;
  }
  const watchMatch = hash.match(/^watch\/(\d{4,24})(?:\/(\d{4,24}))?$/);
  if (watchMatch) {
    const sid = decodeURIComponent(watchMatch[1]);
    const eid = watchMatch[2] ? decodeURIComponent(watchMatch[2]) : '';
    if (activeView !== 'player' || currentSeries?.id !== sid || (eid && currentEpisode?.id !== eid)) {
      openPlayerPage(sid, eid);
    }
    return;
  }
  if (hash.startsWith('channel:') || Object.hasOwn(catalogRoutes, hash)) {
    if (activeView !== 'catalog' || activeNav !== hash) navigate(hash);
    return;
  }
  navigate('home');
}

window.addEventListener('pagehide', () => {
  finishWatchMeasurement();
  recordProgress(true);
  window.coconutAnalytics?.flushOnExit();
});
window.addEventListener('hashchange', handleHashRoute);
matchMedia('(prefers-color-scheme: light)').addEventListener('change', applyTheme);
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', scheduleHeroRotation);

applyAppearance();
applyGridDensity();
applyTheme();
applyPlayerPrefs();
translate();

if (location.hash.startsWith('#series/') || location.hash.startsWith('#watch/') || location.hash === '#settings') {
  handleHashRoute();
} else if (location.hash.startsWith('#channel:') || (Object.hasOwn(catalogRoutes, location.hash.slice(1)) && location.hash !== '#home')) {
  handleHashRoute();
} else {
  trackCurrentPage();
  loadCatalog();
}
