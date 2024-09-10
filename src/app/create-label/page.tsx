"use client"

import LabelCreationForm from "@/components/label-form"
import { useAnchorWallet } from "@solana/wallet-adapter-react";

export default function CreateLabelPage() {
  const wallet = useAnchorWallet();
  return (
    <div className="container mx-auto py-10">
      <LabelCreationForm wallet={wallet || null} />
    </div>
  )
}
