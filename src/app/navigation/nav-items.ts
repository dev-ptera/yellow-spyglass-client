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

const distributionNavItem: NavItem = {
    title: 'Distribution',
    route: 'coming-soon',
    icon: 'account_balance_wallet',
};

const knownAccountsNavItems: NavItem = {
    title: 'Known Accounts',
    route: 'coming-soon',
    icon: 'account_balance_wallet',
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
    route: 'coming-soon',
    icon: 'router',
};

export const APP_NAV_ITEMS = {
    search: searchNavItem,
    representatives: representativesNavItem,
    page1: networkNavItem,
    page2: nodeNavItem,
};

export const EXPLORER_NAV_GROUP = [searchNavItem, distributionNavItem];
export const NETWORK_NAV_GROUP = [networkNavItem, representativesNavItem, nodeNavItem];
