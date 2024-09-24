"use client"

import { useState, useEffect } from "react";
import { fetchUser, UserSet } from "../../anchorClient";
import { AnchorWallet } from "@solana/wallet-adapter-react";


export function useUserAccount(wallet: AnchorWallet ) {
  const [userAccount, setUserAccount] = useState<UserSet>();
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