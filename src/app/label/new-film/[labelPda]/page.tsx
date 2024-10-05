"use client"

import ActorsForm from "@/components/actors-form"
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { fetchLabel } from "../../../../../anchorClient";
import { PublicKey } from "@solana/web3.js";

export default function CreateFilmPage({ params }: { params: { labelPda: string } }) {
  //Vault抽出のため
  const [msPda, setMsPda] = useState<string>(); 
  const wallet = useAnchorWallet();
  const labelPda = params.labelPda;

  useEffect(() => {
    const fetchData = async () => {
      if (wallet) {
        const labelAccount = await fetchLabel(wallet, new PublicKey(labelPda) );
        const msPda = labelAccount.squadKey.toString();
        setMsPda(msPda);
      }
    };

    if (wallet && labelPda) {
      fetchData();
    }
  }, [wallet, labelPda]);

  return (
    <div className="">
      <ActorsForm labelPda={labelPda} msPda={msPda || null} />
    </div>
  )
}
