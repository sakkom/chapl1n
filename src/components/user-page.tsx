"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LayoutGrid, LayoutList } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function UserPage() {
  const [layout, setLayout] = useState("single");

  interface Item {
    image: string;
    name: string;
  }

  const labels: Item[] = [
    { image: "/radar.jpg", name: "Label1" },
    { image: "/radar.jpg", name: "Label2" },
    { image: "/radar.jpg", name: "Label3" },
  ];

  const histories: Item[] = [
    { image: "/radar.jpg", name: "Film1" },
    { image: "/radar.jpg", name: "Film2" },
    { image: "/radar.jpg", name: "Film3" },
  ];

  const renderItems = (items: Item[]) => (
    <div
      className={`grid gap-4 ${
        layout === "double" ? "grid-cols-2" : "grid-cols-1"
      }`}
    >
      {items.map((item, index) => (
        <Card key={index}>
          <Link href={`/label`}>
            <CardContent
              className={`p-4 ${
                layout === "single"
                  ? "flex items-center space-x-4"
                  : "space-y-3"
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
          </Link>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center space-x-4 pb-2">
          <Avatar className="w-20 h-20">
            <AvatarImage
              src="/chaplin.png"
              alt="User avatar"
              width={100}
              height={100}
            />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold">Chapl1n</h2>
        </CardHeader>
        <CardContent>
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Deposit</span>
                <span className="text-2xl font-bold">100</span>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Tabs defaultValue="label" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="label">Label</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="label">
          <div className="mb-4 flex justify-end space-x-2">
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
          {renderItems(labels)}
        </TabsContent>
        <TabsContent value="history">
          <div className="mb-4 flex justify-end space-x-2">
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
          {renderItems(histories)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
