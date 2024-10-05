"use client";

import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader, 
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, X } from "lucide-react";
import { postFilm } from "@/lib/api";
import { AnchorWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import { validateMember } from "@/lib/utils";
import { Member } from "./label-form";
import Avatar from "boring-avatars";
import { useRouter } from "next/navigation";

interface FilmCreationFormProps {
  labelPda: string | null;
  msPda: string | null;
}

export type ActorForm = {
  creator: string[];
  coCreator: string[];
};

export default function Component({ labelPda, msPda }: FilmCreationFormProps) {
  const wallet = useAnchorWallet();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    image: null as File | null,
    number: "",
  });
  const [creators, setCreators] = useState<Member[]>([
    { address: "", isValid: false, name: "", pda: "", error: "" },
  ]);
  const [coCreators, setCoCreators] = useState<Member[]>([
    { address: "", isValid: false, name: "", pda: "", error: "" },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.image && labelPda && msPda) {
      const actor = {
        creator: creators.map((creator) => creator.address),
        coCreator: coCreators.map((coCreator) => coCreator.address),
      };
     const res =  await postFilm(formData.image, labelPda, msPda, actor);
     if(res.ok) {
      router.push('/explorer')
     }
    }
    console.log("Form submitted:", {
      ...formData,
      creators,
      coCreators,
      labelPda,
    });
  };

  const addCreator = () => {
    if (creators.length < 2) {
      setCreators([
        ...creators,
        { address: "", isValid: false, name: "", pda: "", error: "" },
      ]);
    }
  };

  const addCoCreator = () => {
    if (coCreators.length < 3) {
      setCoCreators([
        ...coCreators,
        { address: "", isValid: false, name: "", pda: "", error: "" },
      ]);
    }
  };

  const removeCreator = (index: number) => {
    const newCreators = creators.filter((_, i) => i !== index);
    setCreators(newCreators);
  };

  const removeCoCreator = (index: number) => {
    const newCoCreators = coCreators.filter((_, i) => i !== index);
    setCoCreators(newCoCreators);
  };

  const handleCreatorChange = async (
    index: number,
    value: string,
    wallet: AnchorWallet
  ) => {
    const newCreators = [...creators];
    const { isValid, name, pda, error } = await validateMember(
      value,
      index,
      creators.map((creator) => ({ address: creator.address })),
      wallet
    );
    newCreators[index] = { address: value, isValid, name, pda, error };
    setCreators(newCreators);

    console.log(`Creator ${index} updated:`, newCreators[index]);
  };

  const handleCoCreatorChange = async (
    index: number,
    value: string,
    wallet: AnchorWallet
  ) => {
    const newCoCreators = [...coCreators];
    const { isValid, name, pda, error } = await validateMember(
      value,
      index,
      coCreators.map((coCreator) => ({ address: coCreator.address })),
      wallet
    );
    newCoCreators[index] = { address: value, isValid, name, pda, error };
    setCoCreators(newCoCreators);
  };

  const StepIndicator = ({
    number,
    active,
  }: {
    number: number;
    active: boolean;
  }) => (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
        active
          ? "bg-primary text-primary-foreground"
          : "bg-gray-200 text-gray-500"
      }`}
    >
      {number}
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto text-white">
      <CardHeader>
        <div className="flex justify-center items-center space-x-4 mb-6">
          <StepIndicator number={1} active={step >= 1} />
          <div className="h-1 w-16 bg-gray-200">
            <div
              className="h-1 bg-primary transition-all duration-300 ease-in-out"
              style={{ width: step === 2 ? "100%" : "0%" }}
            ></div>
          </div>
          <StepIndicator number={2} active={step === 2} />
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="w-full max-w-md mx-auto">
            {step === 1 ? (
              <div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image">Image</Label>
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {wallet && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-center">Credit Form</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-md font-medium mb-2">Creators</h4>
                        {creators.map((creator, index) => (
                          <div key={`creator-${index}`} className="space-y-2 mb-4">
                            <div className="flex items-center space-x-2">
                              <Input
                                value={creator.address}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                  handleCreatorChange(
                                    index,
                                    e.target.value,
                                    wallet
                                  )
                                }
                                placeholder="Creator address"
                                className={creator.error ? "border-red-500" : ""}
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
                            {creator.isValid && (
                              <Card className="mt-2 bg-white bg-opacity-15">
                                <CardContent className="flex items-center space-x-4 p-4">
                                  <Avatar
                                    name={`creator-${index}`}
                                    colors={[
                                      "#3fbbb7",
                                      "#9945ff",
                                      "#14f195",
                                      "#5997cd",
                                      "#7179e0",
                                    ]}
                                    variant="marble"
                                    size={50}
                                  />
                                  <div>
                                    <h2 className="text-lg font-semibold text-white">
                                      {creator.name}
                                    </h2>
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                            {creator.error && (
                              <p className="text-red-500 mt-2">{creator.error}</p>
                            )}
                          </div>
                        ))}
                        {creators.length < 2 && creators[0].isValid && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addCreator}
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Creator
                          </Button>
                        )}
                      </div>
                      <div>
                        <h4 className="text-md font-medium mb-2">
                          Co-Creators
                        </h4>
                        {coCreators.map((coCreator, index) => (
                          <div key={`co-creator-${index}`} className="space-y-2 mb-4">
                            <div className="flex items-center space-x-2">
                              <Input
                                value={coCreator.address}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                  handleCoCreatorChange(
                                    index,
                                    e.target.value,
                                    wallet
                                  )
                                }
                                placeholder="Co-Creator address"
                                className={coCreator.error ? "border-red-500" : ""}
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
                            {coCreator.isValid && (
                              <Card className="mt-2 bg-white bg-opacity-15 text-white">
                                <CardContent className="flex items-center space-x-4 p-4">
                                  <Avatar
                                    name={`co-creator-${index}`}
                                    colors={[
                                      "#3fbbb7",
                                      "#9945ff",
                                      "#14f195",
                                      "#5997cd",
                                      "#7179e0",
                                    ]}
                                    variant="marble"
                                    size={50}
                                  />
                                  <div>
                                    <h2 className="text-lg font-semibold">
                                      {coCreator.name}
                                    </h2>
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                            {coCreator.error && (
                              <p className="text-red-500 mt-2">{coCreator.error}</p>
                            )}
                          </div>
                        ))}
                        {coCreators.length < 3 && coCreators[0].isValid && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addCoCreator}
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Co-Creator
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {step === 2 && (
            <Button type="button" variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          {step === 1 ? (
            <Button type="button" variant="outline" onClick={handleNext} className="ml-auto">
              Next
            </Button>
          ) : (
            <Button type="submit" variant="outline">Submit</Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}