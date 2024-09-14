// 'use client'

// import { useState, ChangeEvent } from 'react'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { PlusCircle, X } from "lucide-react"
// import Link from "next/link"
// import { postFilm } from '@/lib/api'

// export default function Component() {
//   const [step, setStep] = useState(1)
//   const [formData, setFormData] = useState({
//     image: null as File | null,
//     number: '',
//   })
//   const [creators, setCreators] = useState([""])
//   const [coCreators, setCoCreators] = useState([""])

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, files } = e.target
//     if (type === 'file' && files) {
//       setFormData(prev => ({ ...prev, [name]: files[0] }))
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }))
//     }
//   }

//   const handleNext = () => {
//     setStep(2)
//   }

//   const handleBack = () => {
//     setStep(1)
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (formData.image) {
//       await postFilm(formData.image)
//     }
//     console.log('Form submitted:', { ...formData, creators, coCreators })
//   }

//   const addCreator = () => {
//     if (creators.length < 2) {
//       setCreators([...creators, ""]);
//     }
//   }

//   const addCoCreator = () => {
//     if (coCreators.length < 3) {
//       setCoCreators([...coCreators, ""]);
//     }
//   }

//   const removeCreator = (index: number) => {
//     const newCreators = creators.filter((_, i) => i !== index)
//     setCreators(newCreators)
//   }

//   const removeCoCreator = (index: number) => {
//     const newCoCreators = coCreators.filter((_, i) => i !== index)
//     setCoCreators(newCoCreators)
//   }

//   const handleCreatorChange = (index: number, value: string) => {
//     const newCreators = [...creators]
//     newCreators[index] = value
//     setCreators(newCreators)
//   }

//   const handleCoCreatorChange = (index: number, value: string) => {
//     const newCoCreators = [...coCreators]
//     newCoCreators[index] = value
//     setCoCreators(newCoCreators)
//   }

//   const StepIndicator = ({ number, active }: { number: number; active: boolean }) => (
//     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
//       active ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-500'
//     }`}>
//       {number}
//     </div>
//   )

//   return (
//     <Card className="w-full max-w-2xl mx-auto">
//       <CardHeader>
//         <div className="flex justify-center items-center space-x-4 mb-6">
//           <StepIndicator number={1} active={step >= 1} />
//           <div className="h-1 w-16 bg-gray-200">
//             <div 
//               className="h-1 bg-primary transition-all duration-300 ease-in-out" 
//               style={{ width: step === 2 ? '100%' : '0%' }}
//             ></div>
//           </div>
//           <StepIndicator number={2} active={step === 2} />
//         </div>
//         <CardTitle>{step === 1 ? 'Step 1: Basic Information' : 'Step 2: Actors Form'}</CardTitle>
//       </CardHeader>
//       <form onSubmit={handleSubmit}>
//         <CardContent className="space-y-6">
//           <div className="w-full max-w-md mx-auto">
//             {step === 1 ? (
//               <>
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="image">画像</Label>
//                     <Input
//                       id="image"
//                       name="image"
//                       type="file"
//                       accept="image/*"
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="number">数字</Label>
//                     <Input
//                       id="number"
//                       name="number"
//                       type="number"
//                       value={formData.number}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <div className="space-y-6">
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold">Actors</h3>
//                   <div className="space-y-4">
//                     <div>
//                       <h4 className="text-md font-medium mb-2">Creators</h4>
//                       {creators.map((creator, index) => (
//                         <div
//                           key={`creator-${index}`}
//                           className="flex items-center space-x-2 mb-2"
//                         >
//                           <Input
//                             value={creator}
//                             onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                               handleCreatorChange(index, e.target.value)
//                             }
//                             placeholder="Creator name"
//                           />
//                           {index > 0 && (
//                             <Button
//                               type="button"
//                               variant="outline"
//                               size="icon"
//                               onClick={() => removeCreator(index)}
//                             >
//                               <X className="h-4 w-4" />
//                               <span className="sr-only">Remove Creator</span>
//                             </Button>
//                           )}
//                         </div>
//                       ))}
//                       {creators.length < 2 && (
//                         <Button type="button" variant="outline" onClick={addCreator}>
//                           <PlusCircle className="h-4 w-4 mr-2" />
//                           Add Creator
//                         </Button>
//                       )}
//                     </div>
//                     <div>
//                       <h4 className="text-md font-medium mb-2">Co-Creators</h4>
//                       {coCreators.map((coCreator, index) => (
//                         <div
//                           key={`co-creator-${index}`}
//                           className="flex items-center space-x-2 mb-2"
//                         >
//                           <Input
//                             value={coCreator}
//                             onChange={(e) =>
//                               handleCoCreatorChange(index, e.target.value)
//                             }
//                             placeholder="Co-Creator name"
//                           />
//                           {index > 0 && (
//                             <Button
//                               type="button"
//                               variant="outline"
//                               size="icon"
//                               onClick={() => removeCoCreator(index)}
//                             >
//                               <X className="h-4 w-4" />
//                               <span className="sr-only">Remove Co-Creator</span>
//                             </Button>
//                           )}
//                         </div>
//                       ))}
//                       {coCreators.length < 3 && (
//                         <Button type="button" variant="outline" onClick={addCoCreator}>
//                           <PlusCircle className="h-4 w-4 mr-2" />
//                           Add Co-Creator
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </CardContent>
//         <CardFooter className="flex justify-between">
//           {step === 2 && (
//             <Button type="button" variant="outline" onClick={handleBack}>
//               戻る
//             </Button>
//           )}
//           {step === 1 ? (
//             <Button type="button" onClick={handleNext} className="ml-auto">
//               次へ
//             </Button>
//           ) : (
//             <Link href="/label" passHref>
//               <Button type="submit">提出</Button>
//             </Link>
//           )}
//         </CardFooter>
//       </form>
//     </Card>
//   )
// }


'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { postFilm } from '@/lib/api'

export default function Component() {
  const [formData, setFormData] = useState({
    image: null as File | null,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target
    if (files && files.length > 0) {
      setFormData(prev => ({ ...prev, [name]: files[0] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.image) {
      try {
        const response = await postFilm(formData.image)
        console.log('Form submitted:', response)
      } catch (error) {
        console.error('Error submitting form:', error)
      }
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>画像アップロード</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="w-full max-w-md mx-auto">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image">画像</Label>
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
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit">提出</Button>
        </CardFooter>
      </form>
    </Card>
  )
}