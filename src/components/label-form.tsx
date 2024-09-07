"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BarChart, PlusCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LabelCreationForm() {
  const [selectedCapacity, setSelectedCapacity] = useState("Standard")
  const [members, setMembers] = useState([""])

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
    setMembers([...members, ""])
  }

  const removeMember = (index: number) => {
    const newMembers = members.filter((_, i) => i !== index)
    setMembers(newMembers)
  }

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...members]
    newMembers[index] = value
    setMembers(newMembers)
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
              <div
                key={`member-${index}`}
                className="flex items-center space-x-2"
              >
                <Input
                  value={member}
                  onChange={(e) => handleMemberChange(index, e.target.value)}
                  placeholder="Member name"
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