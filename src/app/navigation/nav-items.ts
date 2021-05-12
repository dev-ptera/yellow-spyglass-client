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
    title: 'Accounts & Distribution',
    route: 'distribution',
    icon: 'account_balance_wallet',
};

const knownAccountsNavItems: NavItem = {
    title: 'Known Accounts',
    route: 'distribution',
    icon: 'account_balance_wallet',
}

const networkNavItem: NavItem = {
    title: 'Network',
    route: 'page-one',
    icon: 'share',
};

const representativesNavItem: NavItem = {
    title: 'Representatives',
    route: 'ho',
    icon: 'how_to_vote',
};

const nodeNavItem: NavItem = {
    title: 'Node',
    route: 'page-two',
    icon: 'router',
};

export const APP_NAV_ITEMS = {
    search: searchNavItem,
    page1: networkNavItem,
    page2: nodeNavItem,
};


export const EXPLORER_NAV_GROUP = [searchNavItem, distributionNavItem];
export const NETWORK_NAV_GROUP = [networkNavItem, representativesNavItem, nodeNavItem];
