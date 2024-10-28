export const getQuote = async (
    fromChainId: number,
    fromTokenAddress: string,
    toChainId: number,
    toTokenAddress: string,
    fromAmount: number,
    userAddress: string,
    uniqueRoutesPerBridge: boolean = true,
    sort: string = "gas",
) => {
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
        return data.result.routes[0].totalGasFeesInUsd;
    } catch (error: any) {
        throw new Error(`Quote API Failed due to: ${error.message}`);
    }
};
