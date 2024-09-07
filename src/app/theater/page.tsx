"use client"

import { Card, CardContent } from "@/components/ui/card"

export default function Page() {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6">
        <div className="aspect-video mb-4">
          <video
            className="w-full h-full rounded-lg"
            controls
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          />
        </div>
        <h2 className="text-2xl font-bold mb-2">Big Buck Bunny</h2>
        <div className="space-y-4 text-sm text-gray-500">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Creators:</h3>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>Blender Foundation</li>
              <li>Ton Roosendaal</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Co-creators:</h3>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>Sacha Goedegebure</li>
              <li>Jan Morgenstern</li>
              <li>Andy Goralczyk</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}