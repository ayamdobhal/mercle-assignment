import { getRoutes } from "../helpers/get-quote";
import { getUserBalances } from "../helpers/user-balance";
import { APIResponse, Route } from "../types";

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
        const bridgeFees = await getRoutes(
            userBalances,
            query.userAddress,
            query.targetChain,
        );
        let requiredAmount = 0;
        const targetChainBalance = userBalances.find(
            ({ chainId }) => chainId === query.targetChain,
        )?.amount;
        if (targetChainBalance) {
            requiredAmount -= targetChainBalance;
        }
        const route: Route = {
            path: [],
            totalFee: 0,
            totalTime: 0,
        };
        bridgeFees
            .sort((a, b) => a.fee - b.fee)
            .forEach((path) => {
                if (requiredAmount <= 0) {
                    return;
                }
                route.path.push(path);
                route.totalFee += path.fee;
                route.totalTime += path.estimatedTime;
                requiredAmount -= path.amount;
            });
        return {
            success: true,
            route: route,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
        };
    }
};
