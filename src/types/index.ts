export interface Balances {
    chainId: number;
    amount: number;
}

export interface BridgeFee {
    sourceChainId: number;
    fee: number;
    amount: number;
    estimatedTime: number;
}

export interface Route {
    path: BridgeFee[];
    totalFee: number;
    totalTime: number;
}

export interface APIResponse {
    success: boolean;
    route?: Route;
    error?: string;
}
