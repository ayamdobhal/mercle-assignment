export interface Balances {
    chainId: number;
    amount: number;
}

export interface BridgeFee {
    sourceChainId: number;
    fee: number;
    estimatedTime: number;
}
