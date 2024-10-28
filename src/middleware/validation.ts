import Elysia from "elysia";
import { PROVIDERS } from "../constants";

export const validationMiddleware = new Elysia().derive(({ query }) => ({
    validateQuery: () => {
        const { targetChain, amount, tokenAddress, userAddress } = query;

        if (!targetChain || !amount || !tokenAddress || !userAddress)
            throw new Error("Missing required parameters!");

        if (!/^0x[a-fA-F0-9]{40}$/.test(tokenAddress))
            throw new Error("Invalid token address!");

        if (!/^0x[a-fA-F0-9]{40}$/.test(userAddress))
            throw new Error("Invalid user address!");

        const num = parseFloat(amount);
        if (isNaN(num) || num <= 0) throw new Error("Invalid amount!");

        const supportedChains = Object.keys(PROVIDERS);
        const chain = parseInt(targetChain);
        if (isNaN(chain)) throw new Error("targetChain must be a number!");
        const chainValid = supportedChains.find(
            (chainId) => parseInt(chainId) === chain,
        );
        if (!chainValid) throw new Error("Invalid target chain!");

        return true;
    },
}));
