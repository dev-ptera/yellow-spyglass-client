export type Block = {
    block_account: string;
    amount: string;
    amount_decimal: string;
    balance?: string;
    height: string;
    local_timestamp: string;
    balance_decimal: string;
    confirmed: boolean;
    successor?: string;
    contents: {
        type: string;
        account: string;
        previous: string;
        representative: string;
        balance: string;
        balance_decimal: string;
        link: string;
        link_as_account: string;
        signature: string;
        work: string;
    };
    subtype: string;
    pending?: string;
    source_account?: string;
};

export type BlockDtoV2 = {
    blocks: {
        [hash: string]: Block;
    };
};
