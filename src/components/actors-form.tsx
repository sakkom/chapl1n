"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, X } from "lucide-react";
import Link from "next/link";

export default function ActorsForm() {
  const [creators, setCreators] = useState([""]);
  const [coCreators, setCoCreators] = useState([""]);

  const addCreator = () => {
    setCreators([...creators, ""]);
  };

  const addCoCreator = () => {
    setCoCreators([...coCreators, ""]);
  };

  const removeCreator = (index: number) => {
    const newCreators = creators.filter((_, i) => i !== index);
    setCreators(newCreators);
  };

  const removeCoCreator = (index: number) => {
    const newCoCreators = coCreators.filter((_, i) => i !== index);
    setCoCreators(newCoCreators);
  };

  const handleCreatorChange = (index: number, value: string) => {
    const newCreators = [...creators];
    newCreators[index] = value;
    setCreators(newCreators);
  };

  const handleCoCreatorChange = (index: number, value: string) => {
    const newCoCreators = [...coCreators];
    newCoCreators[index] = value;
    setCoCreators(newCoCreators);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Actors Form</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Actors</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-md font-medium mb-2">Creators</h4>
              {creators.map((creator, index) => (
                <div
                  key={`creator-${index}`}
                  className="flex items-center space-x-2 mb-2"
                >
                  <Input
                    value={creator}
                    onChange={(e: any) =>
                      handleCreatorChange(index, e.target.value)
                    }
                    placeholder="Creator name"
                  />
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeCreator(index)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove Creator</span>
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addCreator}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Creator
              </Button>
            </div>
            <div>
              <h4 className="text-md font-medium mb-2">Co-Creators</h4>
              {coCreators.map((coCreator, index) => (
                <div
                  key={`co-creator-${index}`}
                  className="flex items-center space-x-2 mb-2"
                >
                  <Input
                    value={coCreator}
                    onChange={(e) =>
                      handleCoCreatorChange(index, e.target.value)
                    }
                    placeholder="Co-Creator name"
                  />
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeCoCreator(index)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove Co-Creator</span>
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addCoCreator}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Co-Creator
              </Button>
            </div>
          </div>
          <Link href={`/label`}>
            <Button>submit</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
