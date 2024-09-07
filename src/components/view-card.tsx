"use client"

import { useState } from 'react'
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Clock, Eye } from "lucide-react"
import Image from "next/image"
import { ViewModal } from './view-modal'

export function ViewCard() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16 border-2 border-primary rounded-lg">
            <AvatarImage src="/radar.jpg" alt="Chapl1n" />
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">Chapl1n</h2>
            <p className="text-sm text-muted-foreground">Content Creator</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 mt-4">
        <div className="relative aspect-square">
          <Image
            src="/radar.jpg"
            alt="Radar image"
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center mt-4">
        <div className="flex items-center text-muted-foreground">
          <Clock className="w-4 h-4 mr-2" />
          <span>20 min</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center"
          onClick={() => setIsModalOpen(true)}
        >
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
      </CardFooter>
      <ViewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Card>
  )
}