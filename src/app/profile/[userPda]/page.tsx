"use client";

import { AppLayoutComponent } from "@/components/app-layout";
import UserPage from "@/components/user-page";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

export default function Page({ params }: { params: { userPda: string } }) {
  const userPda = new PublicKey(params.userPda);
  const wallet = useAnchorWallet();

  return (
    <>
      {wallet && (
        <AppLayoutComponent wallet={wallet}>
          {wallet && <UserPage userPda={userPda} />}
        </AppLayoutComponent>
      )}
    </>
  );
}
