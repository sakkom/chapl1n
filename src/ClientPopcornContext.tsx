"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Account, getAssociatedTokenAddressSync, getAccount, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import { Connection } from '@solana/web3.js';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import * as web3 from "@solana/web3.js";

interface ClientPopcornContextProps {
  clientATAInfo: Account | null;
  refetchClientATAInfo: () => void;
}

const ClientPopcornContext = createContext<ClientPopcornContextProps | undefined>(undefined);

const queryClient = new QueryClient();

export const ClientPopcornProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const wallet = useAnchorWallet();
  const MINT = new web3.PublicKey(process.env.NEXT_PUBLIC_MINT!);

  const { data: clientATAInfo = null, refetch: refetchClientATAInfo } = useQuery({
    queryKey: ['clientATAInfo', wallet],
    queryFn: async () => {
      if (!wallet || !wallet.publicKey) return null;
      const connection = new Connection(
        "https://devnet.helius-rpc.com/?api-key=1210bef3-8110-4b7f-af32-f30426f47781",
        "confirmed"
      );
      const authority = wallet.publicKey;
      const clientATA = getAssociatedTokenAddressSync(
        MINT,
        authority,
        undefined,
        TOKEN_2022_PROGRAM_ID
      );
      return await getAccount(
        connection,
        clientATA,
        { commitment: "confirmed" } as unknown as web3.Commitment,
        TOKEN_2022_PROGRAM_ID
      );
    }
  });

  

  return (
    <QueryClientProvider client={queryClient}>
      <ClientPopcornContext.Provider value={{ clientATAInfo, refetchClientATAInfo }}>
        {children}
      </ClientPopcornContext.Provider>
    </QueryClientProvider>
  );
};

export const useClientPopcorn = () => {
  const context = useContext(ClientPopcornContext);
  if (!context) {
    throw new Error('useClientPopcorn must be used within a ClientPopcornProvider');
  }
  return context;
};