export type NavItem = {
    title: string;
    subtitle?: string;
    route: string;
    icon: string;
};

const searchNavItem: NavItem = {
    title: 'Explore',
    route: 'search',
    icon: 'search',
};

const walletsNavItem: NavItem = {
    title: 'Wallets',
    route: 'wallets',
    icon: 'account_balance_wallet',
};

const knownAccountsNavItem: NavItem = {
    title: 'Known Accounts',
    route: 'known-accounts',
    icon: 'fingerprint',
};

const networkNavItem: NavItem = {
    title: 'Network',
    route: 'coming-soon',
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

export const APP_NAV_ITEMS = {
    knownAccounts: knownAccountsNavItem,
    bookmarks: bookmarksNavItem,
    search: searchNavItem,
    representatives: representativesNavItem,
    wallets: walletsNavItem,
    network: networkNavItem,
    node: nodeNavItem,
};

export const EXPLORER_NAV_GROUP = [searchNavItem, walletsNavItem, knownAccountsNavItem];
export const NETWORK_NAV_GROUP = [networkNavItem, representativesNavItem, nodeNavItem];
