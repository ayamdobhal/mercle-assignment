import { findOptimalPath } from "../helpers/find-routes";
import { getQuote } from "../helpers/get-quote";
import { getUserBalances } from "../helpers/user-balance";
import { APIResponse, ChainQuote, Path } from "../types";
import { getChainName, usdcForChain } from "../utils";

export const optimalRouteHandler = async ({
    query,
}: {
    query: any;
}): Promise<APIResponse> => {
    try {
        const userBalances = await getUserBalances(
            query.userAddress,
            query.tokenAddress,
        );
        let requiredAmount = query.amount;
        const targetChainBalance =
            userBalances.find(({ chainId }) => chainId === query.targetChain)
                ?.amount || 0;
        requiredAmount = Math.max(0, requiredAmount - targetChainBalance);
        let optimalRoute: Path = {
            routes: [],
            totalGas: 0,
            totalTime: 0,
        };
        if (requiredAmount === 0) {
            return {
                success: true,
                route: optimalRoute,
            };
        }
        const sourceChains = userBalances.filter(
            ({ chainId }) => chainId !== query.targetChain,
        );
        if (sourceChains.length === 1) {
            const balance = sourceChains[0];
            const quote = await getQuote(
                balance.chainId,
                usdcForChain(balance.chainId),
                query.targetChain,
                usdcForChain(query.targetChain),
                requiredAmount,
                query.userAddress,
            );
            if (quote.success && quote.result.routes.length > 0) {
                const route = quote.result.routes[0];
                return {
                    success: true,
                    route: {
                        routes: [
                            {
                                path: `${getChainName(balance.chainId)} -> ${getChainName(query.targetChain)}`,
                                amount: requiredAmount,
                                gasFee: route.totalGasFeesInUsd,
                                estimatedTime: route.serviceTime,
                            },
                        ],
                        totalGas: route.totalGasFeesInUsd,
                        totalTime: route.serviceTime,
                    },
                };
            }
        }

        const chainQuotes: ChainQuote[] = await Promise.all(
            sourceChains.map(async (balance) => {
                try {
                    const amount = Math.min(balance.amount, requiredAmount);
                    const quote = await getQuote(
                        balance.chainId,
                        usdcForChain(balance.chainId),
                        query.targetChain,
                        usdcForChain(query.targetChain),
                        amount,
                        query.userAddress,
                    );
                    if (!quote.success && quote.result.routes.length === 0)
                        return null;
                    const route = quote.result.routes[0];
                    return {
                        chainId: balance.chainId,
                        availableAmount: balance.amount,
                        gasFee: route.totalGasFeesInUsd,
                        estimatedTime: route.serviceTime,
                        efficiency:
                            Number(route.amount) / route.totalGasFeesInUsd,
                    };
                } catch {
                    return null;
                }
            }),
        ).then((quotes) => quotes.filter((q): q is ChainQuote => q !== null));

        chainQuotes.sort((a, b) => b.efficiency - a.efficiency);
        optimalRoute = await findOptimalPath(
            chainQuotes,
            query.targetChain,
            query.userAddress,
            requiredAmount,
        );

        return {
            success: true,
            route: optimalRoute,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
        };
    }
};
