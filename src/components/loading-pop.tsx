'use client'

import React, { useState, useEffect } from 'react'

export default function LoadingPop() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % 3)
    }, 800)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="text-center">
        <div className="flex justify-center space-x-4 mb-4">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`text-5xl font-light transition-all duration-500 ease-in-out ${
                index === activeIndex
                  ? 'text-white opacity-100 transform scale-110'
                  : 'text-gray-400 opacity-50 transform scale-100'
              }`}
              aria-hidden={index !== activeIndex}
            >
              wait🍿
            </div>
          ))}
        </div>
      </div>
      <div className="sr-only" aria-live="polite">
        ローディング中です。お待ちください。
      </div>
    </div>
  )
}