export type KnownAccountDto = {
    address: string;
    alias: string;
    owner?: string;
    hasLore: boolean;
    lore?: string;
    balance: number;
    type?: KnownAccountType;
};

export type KnownAccountType =
    | ''
    | 'representative'
    | 'exchange'
    | 'distribution'
    | 'faucet'
    | 'explorer'
    | 'citizen'
    | 'burn';
