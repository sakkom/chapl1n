"use client";
import { AppLayoutComponent } from "@/components/app-layout";
import { LabelPage } from "@/components/label-page";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

export default function Page({ params }: { params: { labelPda: string } }) {
  const wallet = useAnchorWallet();
  const labelPda = new PublicKey(params.labelPda);

  return (
    <>
      {wallet && (
        <AppLayoutComponent wallet={wallet}>
          {wallet && <LabelPage wallet={wallet} labelPda={labelPda} />}
        </AppLayoutComponent>
      )}
    </>
  );
}
