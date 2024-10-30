import { CHAIN_NAMES, USDC_ADDRESSES } from "../constants";

export const usdcForChain = (chainId: number) => {
    return USDC_ADDRESSES[chainId];
};

export const getChainName = (chainId: number) => {
    return CHAIN_NAMES[chainId];
};
