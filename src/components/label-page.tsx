"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LayoutGrid, LayoutList, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function LabelPage() {
  const [layout, setLayout] = useState("single");

  const films = [
    { image: "/radar.jpg", name: "Film1" },
    { image: "/radar.jpg", name: "Film2" },
    { image: "/radar.jpg", name: "Film3" },
  ];

  const renderItems = (items: any) => (
    <div
      className={`grid gap-4 ${
        layout === "double" ? "grid-cols-2" : "grid-cols-1"
      }`}
    >
      {items.map((item: any, index: any) => (
        <Card key={index}>
          <CardContent
            className={`p-4 ${
              layout === "single" ? "flex items-center space-x-4" : "space-y-3"
            }`}
          >
            <div
              className={`${
                layout === "single" ? "w-1/3" : "w-full"
              } aspect-square`}
            >
              <Image
                src={item.image}
                alt={`${item.name} image`}
                width={500}
                height={500}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <h3
              className={`text-lg font-semibold ${
                layout === "single" ? "flex-1" : "text-center"
              }`}
            >
              {item.name}
            </h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage
                  src="/placeholder.svg?text=C&width=100&height=100"
                  alt="User avatar"
                  width={100}
                  height={100}
                />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">Chapl1n</h2>
                <div className="mt-2 flex space-x-4">
                  <div>
                    <span className="font-semibold">3</span> Films
                  </div>
                  <div>
                    <span className="font-semibold">150</span> Crew
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" size="icon" aria-label="Discord">
              <Discord className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" aria-label="YouTube">
              <Youtube className="h-4 w-4" />
            </Button>
          </div> */}
        </CardHeader>
      </Card>

      <Tabs defaultValue="label" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="film">Film</TabsTrigger>
          <TabsTrigger value="member">Squad</TabsTrigger>
          <TabsTrigger value="treasury">Treasury</TabsTrigger>
        </TabsList>
        <TabsContent value="film">
          <div className="mb-4 flex justify-between items-center">
            <Link href={`/create-film`}>
              <Button variant="default" size="sm" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                New Creation
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Button
                variant={layout === "single" ? "default" : "ghost"}
                size="icon"
                onClick={() => setLayout("single")}
                aria-label="1列表示"
              >
                <LayoutList className="h-4 w-4" />
              </Button>
              <Button
                variant={layout === "double" ? "default" : "ghost"}
                size="icon"
                onClick={() => setLayout("double")}
                aria-label="2列表示"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {renderItems(films)}
        </TabsContent>
        <TabsContent value="member"></TabsContent>
        <TabsContent value="treasury"></TabsContent>
      </Tabs>
    </div>
  );
}
