"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BarChart, PlusCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { PublicKey } from '@solana/web3.js'; 
import { fetchUser } from "../../anchorClient"
import { AnchorWallet } from "@solana/wallet-adapter-react"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface LabelCreationFormProps {
  wallet: AnchorWallet | null; // walletの型を定義
}

interface Member {
  address: string;
  isValid: boolean;
  name: string;
  pda: string;
  error: string;
}

export default function LabelCreationForm({ wallet }: LabelCreationFormProps) {
  const [selectedCapacity, setSelectedCapacity] = useState("Standard")
  const [members, setMembers] = useState<Member[]>([{ address: "", isValid: true, name: "", pda: "", error: "" }])

  const capacities = [
    {
      name: "Standard",
      capacity: "10,000",
    },
    {
      name: "Enterprise",
      capacity: "1,000,000",
    },
  ]

  const addMember = () => {
    if (members.some(member => member.error)) {
      return;
    }
    setMembers([...members, { address: "", isValid: true, name: "", pda: "", error: "" }])
  }

  const removeMember = (index: number) => {
    const newMembers = members.filter((_, i) => i !== index)
    setMembers(newMembers)
  }

  const handleMemberChange = async (index: number, address: string) => {
    const newMembers = [...members]
    const { isValid, name, pda, error } = await validateMember(address, index)
    newMembers[index] = { address, isValid, name, pda, error }
    setMembers(newMembers)
  }

  const validateMember = async (address: string, index: number) => {
    if (members.some((member, i) => member.address === address && i !== index)) {
      return { isValid: false, name: "", pda: "", error: "おなじmemberは一度しか選択できません" }
    }
    try {
      new PublicKey(address)
    } catch (e) {
      return { isValid: false, name: "", pda: "", error: "有効なaddressを入力してください" }
    }
    try {
      if (wallet) {
        const { userAccount, userPda } = await fetchUser(wallet, new PublicKey(address))
        return { isValid: true, name: userAccount.name, pda: userPda.toString(), error: "" }
      } else {
        return { isValid: false, name: "", pda: "", error: "user アカウントがありません" }
      }
    } catch (e) {
      return { isValid: false, name: "", pda: "", error: "user アカウントがありません" }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log("Selected Capacity:", selectedCapacity)
    console.log("Members:", members)
    // Add your form submission logic here
  }

  return (
    <form onSubmit={handleSubmit} className="container mx-auto py-10 px-4 space-y-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create Your Label</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Select Your Playback Goal</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              {capacities.map((plan, index) => (
                <Card 
                  key={index} 
                  className={cn(
                    "flex-1 cursor-pointer transition-all duration-300",
                    selectedCapacity === plan.name ? "border-primary shadow-lg" : "",
                    index !== 0 ? "opacity-50" : ""
                  )}
                  onClick={() => setSelectedCapacity(plan.name)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-center mb-2 text-primary">
                      <BarChart className="inline-block mr-2 h-6 w-6" />
                      {plan.capacity}
                    </div>
                    <p className="text-center text-sm text-muted-foreground">Total Playback Goal</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Add Members</h2>
            {members.map((member, index) => (
              <div key={`member-${index}`} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Input
                    value={member.address}
                    onChange={(e) => handleMemberChange(index, e.target.value)}
                    placeholder="Member address"
                    className={member.isValid ? "" : "border-red-500"}
                  />
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeMember(index)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove Member</span>
                    </Button>
                  )}
                </div>
                {member.error && <p className="text-red-500">{member.error}</p>}
                {member.isValid && member.name && (
                  <Card>
                    <CardContent className="flex items-center space-x-4 p-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${member.name}`} alt={member.name} />
                        <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-lg font-semibold">{member.name}</h2>
                        <p className="text-sm text-gray-500">{member.pda}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addMember}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
          <Button type="submit" className="w-full">Create Label</Button>
        </CardContent>
      </Card>
    </form>
  )
}