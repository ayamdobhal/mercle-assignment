import { ethers } from "ethers";
import { ERC20_ABI, PROVIDERS, USDC_ADDRESSES } from "../constants";

export const getUserBalances = async (
    userAddress: string,
    _tokenAddress: string, // not being used as of now due to hardcoded USDC token.
) => {
    const balances = new Map<string, number>();
    const balancePromises = Object.entries(PROVIDERS).map(
        async ([chain, provider]) => {
            const contract = new ethers.Contract(
                USDC_ADDRESSES[chain],
                ERC20_ABI,
                provider,
            );
            const balanceWei = await contract.balanceOf(userAddress);
            const balance = parseFloat(ethers.formatUnits(balanceWei, 18));
            if (balance > 0) {
                balances.set(chain, balance);
            }
        },
    );
    await Promise.all(balancePromises);
    return balances;
};
