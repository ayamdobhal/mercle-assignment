export interface Balances {
    chainId: number;
    amount: number;
}

export interface BridgeFee {
    sourceChainId: number;
    gasFee: number;
    fromAmount: number;
    toAmount: number;
    estimatedTime: number;
}

export interface Route {
    path: string;
    amount: number;
    gasFee: number;
    estimatedTime: number;
}

export interface Path {
    routes: Route[];
    totalGas: number;
    totalTime: number;
}

export interface RouteOption extends Path {
    remainingRequired: number;
}

export interface APIResponse {
    success: boolean;
    route?: Path;
    error?: string;
}

export interface ChainQuote {
    chainId: number;
    availableAmount: number;
    gasFee: number;
    estimatedTime: number;
    efficiency: number;
}
