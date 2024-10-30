import { ethers } from "ethers";

export const PROVIDERS = {
    1: new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC),
    56: new ethers.JsonRpcProvider(process.env.BNB_RPC),
    250: new ethers.JsonRpcProvider(process.env.FANTOM_RPC),
    43114: new ethers.JsonRpcProvider(process.env.AVALANCHE_RPC),
    10: new ethers.JsonRpcProvider(process.env.OPTIMISM_RPC),
    42161: new ethers.JsonRpcProvider(process.env.ARBITRUM_RPC),
    100: new ethers.JsonRpcProvider(process.env.GNOSIS_RPC),
    137: new ethers.JsonRpcProvider(process.env.POLYGON_RPC),
    1313161554: new ethers.JsonRpcProvider(process.env.AURORA_RPC),
    324: new ethers.JsonRpcProvider(process.env.ZKSYNC_RPC),
    1101: new ethers.JsonRpcProvider(process.env.POLYGONZK_RPC),
    8453: new ethers.JsonRpcProvider(process.env.BASE_RPC),
    59144: new ethers.JsonRpcProvider(process.env.LINEA_RPC),
    5000: new ethers.JsonRpcProvider(process.env.MANTLE_RPC),
    534352: new ethers.JsonRpcProvider(process.env.SCROLL_RPC),
};

export const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
];

export const CHAIN_NAMES: { [key: number]: string } = {
    1: "Ethereum",
    56: "Binance Smart Chain (BSC)",
    250: "Fantom",
    43114: "Avalanche",
    10: "Optimism",
    42161: "Arbitrum",
    100: "Gnosis Chain",
    137: "Polygon",
    1313161554: "Aurora",
    324: "zkSync Era",
    1101: "Polygon zkEVM",
    8453: "Base Chain",
    59144: "Linea",
    5000: "Mantle",
    534352: "Scroll",
};

// Hard coded USDC Addresses across different chains for now.
export const USDC_ADDRESSES: { [key: number]: string } = {
    1: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    56: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    250: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
    43114: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
    10: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
    42161: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    100: "0x2a22f9c3b484c3629090feed35f17ff8f88f76f0",
    137: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    1313161554: "0xB12BFcA5A55806AaF64E99521918A4bf0fC40802",
    324: "0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4",
    1101: "0xA8CE8aee21bC2A48a5EF670afCc9274C7bbbC035",
    8453: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    59144: "0x176211869ca2b568f2a7d4ee941e073a821ee1ff",
    5000: "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
    534352: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
};
