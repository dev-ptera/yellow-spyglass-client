export type NavItem = {
    title: string;
    subtitle?: string;
    route: string;
    icon: string;
};

const walletsNavItem: NavItem = {
    title: 'Wallets',
    route: 'wallets',
    icon: 'account_balance_wallet',
};

const homeNavItem: NavItem = {
    title: 'Home',
    route: '',
    icon: 'search',
};

const knownAccountsNavItem: NavItem = {
    title: 'Known Accounts',
    route: 'known-accounts',
    icon: 'fingerprint',
};

const networkNavItem: NavItem = {
    title: 'Network',
    route: 'network',
    icon: 'share',
};

const representativesNavItem: NavItem = {
    title: 'Representatives',
    route: 'representatives',
    icon: 'how_to_vote',
};

const nodeNavItem: NavItem = {
    title: 'Node',
    route: 'monitor',
    icon: 'router',
};

const bookmarksNavItem: NavItem = {
    title: 'Bookmarks',
    route: 'bookmarks',
    icon: 'bookmarks',
};

const vanityNavItem: NavItem = {
    title: 'Vanity MonKeys',
    route: 'vanity',
    icon: undefined,
};

export const hashNavItem = {
    title: 'Block Hash',
    route: 'hash',
};

export const accountNavItem = {
    title: 'Account',
    route: 'account',
};

export const APP_NAV_ITEMS = {
    home: homeNavItem,
    knownAccounts: knownAccountsNavItem,
    bookmarks: bookmarksNavItem,
    representatives: representativesNavItem,
    wallets: walletsNavItem,
    network: networkNavItem,
    node: nodeNavItem,
    vanity: vanityNavItem,
    hash: hashNavItem,
    account: accountNavItem,
};

export const EXPLORER_NAV_GROUP = [homeNavItem, walletsNavItem, knownAccountsNavItem];
export const NETWORK_NAV_GROUP = [networkNavItem, representativesNavItem, nodeNavItem];
