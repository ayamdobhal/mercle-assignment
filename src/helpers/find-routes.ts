import { ChainQuote, Path, Route, RouteOption } from "../types";
import { getChainName, usdcForChain } from "../utils";
import { getQuote } from "./get-quote";

export const findOptimalPath = async (
    chainQuotes: ChainQuote[],
    targetChain: number,
    userAddress: string,
    remainingRequired: number,
) => {
    let bestPath: Path | null = null;

    async function findCombinations(
        quotes: ChainQuote[],
        currentOption: RouteOption,
        idx: number,
    ) {
        if (bestPath && currentOption.totalGas >= bestPath.totalGas) return;

        if (currentOption.remainingRequired <= 0) {
            if (!bestPath || currentOption.totalGas < bestPath.totalGas) {
                bestPath = {
                    routes: [...currentOption.routes],
                    totalTime: currentOption.totalTime,
                    totalGas: currentOption.totalGas,
                };
            }
            return;
        }

        const remainingBal = quotes
            .slice(idx)
            .reduce((sum, q) => sum + q.availableAmount, 0);

        if (remainingBal < currentOption.remainingRequired) return;

        for (let i = idx; i < quotes.length; i++) {
            const quote = quotes[i];
            const maxAmt = Math.min(
                quote.availableAmount,
                currentOption.remainingRequired,
            );

            if (maxAmt <= 0) return;

            try {
                const bridgeQuote = await getQuote(
                    quote.chainId,
                    usdcForChain(quote.chainId),
                    targetChain,
                    usdcForChain(targetChain),
                    maxAmt,
                    userAddress,
                );

                if (
                    !bridgeQuote.success ||
                    bridgeQuote.result.routes.length === 0
                )
                    continue;

                const route = bridgeQuote.result.routes[0];
                const newRoute: Route = {
                    path: `${getChainName(quote.chainId)} -> ${getChainName(targetChain)}`,
                    amount: maxAmt,
                    gasFee: route.totalGasFeesInUsd,
                    estimatedTime: route.serviceTime,
                };

                await findCombinations(
                    quotes,
                    {
                        routes: [...currentOption.routes, newRoute],
                        totalGas: currentOption.totalGas + newRoute.gasFee,
                        totalTime: Math.max(
                            currentOption.totalTime,
                            newRoute.estimatedTime,
                        ),
                        remainingRequired:
                            currentOption.remainingRequired - maxAmt,
                    },
                    i + 1,
                );

                if (maxAmt > currentOption.remainingRequired / 2) {
                    const partialAmount = currentOption.remainingRequired / 2;
                    const partialQuote = await getQuote(
                        quote.chainId,
                        usdcForChain(quote.chainId),
                        targetChain,
                        usdcForChain(targetChain),
                        partialAmount,
                        userAddress,
                    );
                    if (
                        partialQuote.success &&
                        partialQuote.result.routes.length > 0
                    ) {
                        const partialRoute = partialQuote.result.routes[0];
                        const newPartialRoute: Route = {
                            path: `${getChainName(quote.chainId)}->${getChainName(targetChain)}`,
                            amount: partialAmount,
                            gasFee: partialRoute.totalGasFeesInUsd,
                            estimatedTime: partialRoute.serviceTime,
                        };

                        await findCombinations(
                            quotes,
                            {
                                routes: [
                                    ...currentOption.routes,
                                    newPartialRoute,
                                ],
                                totalGas:
                                    currentOption.totalGas +
                                    partialRoute.totalGasFeesInUsd,
                                totalTime: Math.max(
                                    currentOption.totalTime,
                                    partialRoute.serviceTime,
                                ),
                                remainingRequired:
                                    currentOption.remainingRequired -
                                    partialAmount,
                            },
                            i + 1,
                        );
                    }
                }
            } catch {
                continue;
            }
        }
    }

    await findCombinations(
        chainQuotes,
        {
            routes: [],
            totalGas: 0,
            totalTime: 0,
            remainingRequired,
        },
        0,
    );

    if (!bestPath) throw new Error("No valid route found!");

    return bestPath;
};
