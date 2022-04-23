import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl, Connection } from "@solana/web3.js";

const connection = new Connection(
  clusterApiUrl(WalletAdapterNetwork.Devnet),
  "confirmed"
);

export default connection;
