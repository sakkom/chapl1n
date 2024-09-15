"use client"
import { AppLayoutComponent } from "@/components/app-layout";
import  UserPage from "@/components/user-page";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Page () {
  return (
    <>
    <AppLayoutComponent>
      <WalletMultiButton />
    <UserPage />

    </AppLayoutComponent>
    </>
  )
}