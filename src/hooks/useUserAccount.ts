"use client"

import { useState, useEffect } from "react";
import * as web3 from "@solana/web3.js";
import { fetchUser } from "../../anchorClient";
import { AnchorWallet } from "@solana/wallet-adapter-react";

interface UserAccount {
  userAccount: {
    name: string;
    label: web3.PublicKey[];
  };
  userPda: web3.PublicKey;
}

export function useUserAccount(wallet: AnchorWallet | null) {
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserAccount = async () => {
      if (wallet) {
        setIsLoading(true);
        try {
          const authority = wallet.publicKey;
          const account = await fetchUser(wallet, authority);
          setUserAccount(account);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserAccount();
  }, [wallet]);

  return { userAccount, isLoading };
}