import { USDC_ADDRESSES } from "../constants";
import { Balances, BridgeFee } from "../types";

const getQuote = async (
    fromChainId: number,
    fromTokenAddress: string,
    toChainId: number,
    toTokenAddress: string,
    fromAmount: number,
    userAddress: string,
    uniqueRoutesPerBridge: boolean = true,
    sort: string = "gas",
): Promise<BridgeFee> => {
    try {
        const response = await fetch(
            `https://api.socket.tech/v2/quote?fromChainId=${fromChainId}&fromTokenAddress=${fromTokenAddress}&toChainId=${toChainId}&toTokenAddress=${toTokenAddress}&fromAmount=${fromAmount}&userAddress=${userAddress}&uniqueRoutesPerBridge=${uniqueRoutesPerBridge}&sort=${sort}`,
            {
                method: "GET",
                headers: {
                    "API-KEY": process.env.BUNGEE_API_KEY!,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            },
        );
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }
        const route = data.result.routes[0];
        return {
            sourceChainId: fromChainId,
            fee: route.totalGasFeesInUsd,
            amount: fromAmount,
            estimatedTime: route.serviceTime,
        };
    } catch (error: any) {
        throw new Error(`Quote API Failed due to: ${error.message}`);
    }
};

export const getRoutes = async (
    balances: Balances[],
    userAddress: string,
    targetChain: number,
) => {
    const bridgeFees = new Array<BridgeFee>();
    try {
        const quotePromises = balances.map(async ({ chainId, amount }) => {
            if (chainId === targetChain) return;
            const quote = await getQuote(
                chainId,
                USDC_ADDRESSES[chainId],
                targetChain,
                USDC_ADDRESSES[chainId],
                amount,
                userAddress,
            );
            bridgeFees.push(quote);
        });
        await Promise.all(quotePromises);
        return bridgeFees;
    } catch (error: any) {
        throw new Error(
            `Calculating Bridging Fees failed due to: ${error.message}`,
        );
    }
};
