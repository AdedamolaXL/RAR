// app/components/layout/PlayerBar.tsx
'use client'

import { Play, Heart, Shuffle, SkipBack, SkipForward, Repeat, Volume2 } from "lucide-react"

export function PlayerBar() {
  return (
 <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 w-1/4">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-600 rounded"></div>
          <div>
            <h4 className="font-semibold text-sm">Jies</h4>
            <p className="text-gray-400 text-xs">BNXN</p>
          </div>
          <Heart className="w-4 h-4 text-green-500" />
        </div>

        <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Shuffle className="w-4 h-4" />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <SkipBack className="w-4 h-4" />
            </button>
            <button className="bg-white rounded-full p-2 hover:scale-105 transition-transform">
              <Play className="w-4 h-4 text-black" />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <SkipForward className="w-4 h-4" />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Repeat className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center space-x-2 w-full">
            <span className="text-xs text-gray-400">1:23</span>
            <div className="flex-1 bg-gray-600 rounded-full h-1">
              <div className="bg-white rounded-full h-1 w-1/3"></div>
            </div>
            <span className="text-xs text-gray-400">3:45</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-1/4 justify-end">
          <Volume2 className="w-4 h-4 text-gray-400" />
          <div className="w-20 bg-gray-600 rounded-full h-1">
            <div className="bg-white rounded-full h-1 w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
  )
}