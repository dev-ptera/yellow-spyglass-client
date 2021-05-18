export type ConfirmedTransaction = {
    balance?: string;
    hash: string;
    type: 'receive' | 'send' | 'change';
    height: string;
    address: string;
    date: string;
    time: string;
};
