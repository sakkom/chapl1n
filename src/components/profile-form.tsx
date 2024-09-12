'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWallet } from "@solana/wallet-adapter-react"
import Avatar from "boring-avatars";
import { postUserProfile } from "@/lib/api"; 

export default function ProfileForm() {
  const { publicKey } = useWallet();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!publicKey) {
      alert("ウォレットが接続されていません");
      return;
    }

    const form = event.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    try {
      const response = await postUserProfile(publicKey.toString(), name);
      console.log("User profile created:", response);
    } catch (error) {
      console.error("Error creating user profile:", error);
    }
  }
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">プロフィール作成</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
        <Avatar name="Helen Keller" colors={["#3fbbb7", "#9945ff", "#14f195", "#5997cd", "#7179e0"]} variant="marble"  size={80}/>
        </div>
        <form className="space-y-2" onSubmit={handleSubmit}>
          <Label htmlFor="name">名前</Label>
          <Input id="name" name="name" placeholder="あなたの名前を入力してください" />
          <Button type="submit" className="w-full">送信</Button>
        </form>
      </CardContent>
    </Card>
  )
}