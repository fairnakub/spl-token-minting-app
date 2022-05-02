export interface TokenDetail {
  tokenAddress: string;
  tokenSupply: bigint;
  freezeAuthority: string | null;
  mintAuthority: string | null;
  isInitialized: boolean;
  decimals: number;
}
