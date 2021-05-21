import { Subtype } from '@dev-ptera/nano-node-rpc';

export type Block = {
    blockAccount: string;
    amount: string;
    balance: string;
    height: number;
    timestamp: number;
    confirmed: boolean;
    subtype: Subtype;
    contents: {
        type: 'state';
        account: string;
        previous: string;
        representative: string;
        balance: string;
        link: string;
        linkAsAccount: string;
        signature: string;
        work: string;
    };
};
