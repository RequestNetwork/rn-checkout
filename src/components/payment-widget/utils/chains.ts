import {
  mainnet,
  arbitrum,
  base,
  optimism,
  polygon,
  sepolia,
} from "viem/chains";

export const getChainFromNetwork = (network: string) => {
  switch (network.toLowerCase()) {
    case "mainnet":
      return mainnet;
    case "arbitrum":
      return arbitrum;
    case "base":
      return base;
    case "optimism":
      return optimism;
    case "polygon":
      return polygon;
    case "sepolia":
      return sepolia;
    default:
      throw new Error(`Unsupported network: ${network}`);
  }
};
