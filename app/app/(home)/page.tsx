'use client'

import { Card } from "@/components/ui/card"
import { Wallet } from "@/components/wagmi/components/wallet"
import Link from "next/link"
import { Play, Heart, Plus, MoreHorizontal, Shuffle, SkipBack, SkipForward, Repeat, Volume2, Upload, Library } from "lucide-react"
import { UploadSong } from "@/components/media/upload-song"
import { RecentlyUploaded } from "@/components/media/recently-uploaded"
import { useState } from "react"

export default function Home() {
  const [showUpload, setShowUpload] = useState(false)
  const [refreshSongs, setRefreshSongs] = useState(0)

  // Mock data for demonstration
  const playlists = [
    { id: 1, name: "Liked Songs", description: "127 songs", color: "bg-gradient-to-br from-purple-900 to-blue-500" },
    { id: 2, name: "Daily Mix 1", description: "Made for you", color: "bg-gradient-to-br from-green-900 to-emerald-500" },
    { id: 3, name: "Chill Vibes", description: "Your calm space", color: "bg-gradient-to-br from-orange-900 to-red-500" },
    { id: 4, name: "Workout Energy", description: "Power through your workout", color: "bg-gradient-to-br from-blue-900 to-cyan-500" },
    { id: 5, name: "Focus Flow", description: "Concentrate and flow", color: "bg-gradient-to-br from-pink-900 to-rose-500" },
    { id: 6, name: "Community Uploads", description: "Songs from our users", color: "bg-gradient-to-br from-yellow-900 to-amber-500" },
  ]

  const handleUploadSuccess = () => {
    setRefreshSongs(prev => prev + 1)
    setShowUpload(false)
  }

  return (
    <>
      <div className="flex h-full bg-black text-white">
        {/* Sidebar */}
        <div className="w-64 bg-black p-6 flex flex-col">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">NFTune</h1>
            <p className="text-gray-400 text-sm">Music for NFT Growers</p>
          </div>
          
          <nav className="space-y-6">
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-4 text-white font-semibold">
                <div className="w-6 h-6 bg-white rounded-sm"></div>
                <span>Home</span>
              </Link>
              <Link href="/nft" className="flex items-center space-x-4 text-gray-400 hover:text-white transition-colors">
                <div className="w-6 h-6 bg-gray-600 rounded-sm"></div>
                <span>NFT Management</span>
              </Link>
              <button className="flex items-center space-x-4 text-gray-400 hover:text-white transition-colors w-full">
                <div className="w-6 h-6 bg-gray-600 rounded-sm"></div>
                <span>Search</span>
              </button>
            </div>

            <div className="pt-4 border-t border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <button className="flex items-center space-x-4 text-gray-400 hover:text-white transition-colors">
                  <div className="w-6 h-6 bg-gray-600 rounded-sm flex items-center justify-center">
                    <Library className="w-4 h-4" />
                  </div>
                  <span>Your Library</span>
                </button>
              </div>
              
              <div className="space-y-2">
                <Link href="/nft" className="block py-2 px-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-md hover:from-green-600 hover:to-emerald-700 transition-all">
                  Your NFTs
                </Link>
                
                {/* Upload Button */}
                <button 
                  onClick={() => setShowUpload(true)}
                  className="flex items-center space-x-3 w-full py-2 px-3 text-gray-400 hover:text-white hover:bg-gray-800 transition-all rounded-md"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Song</span>
                </button>
                
                <button className="block py-2 px-3 text-gray-400 hover:text-white transition-colors text-left w-full">
                  Liked Songs
                </button>
              </div>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <header className="bg-gradient-to-r from-gray-900 to-black p-6 flex items-center justify-between">
            <div className="flex space-x-4">
              <button className="w-8 h-8 bg-black bg-opacity-70 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all">
                <SkipBack className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 bg-black bg-opacity-70 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all">
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <Wallet />
              <button className="bg-white text-black px-4 py-1 rounded-full text-sm font-semibold hover:scale-105 transition-transform">
                Upgrade
              </button>
            </div>
          </header>

          {/* Content Area - Added padding-bottom to prevent player bar overlay */}
          <main className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-gray-900 to-black pb-32">
            {showUpload ? (
              <section className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-3xl font-bold">Upload Your Music</h1>
                  <button 
                    onClick={() => setShowUpload(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Back to Home
                  </button>
                </div>
                <div className="max-w-2xl">
                  <UploadSong onUploadSuccess={handleUploadSuccess} />
                </div>
              </section>
            ) : (
              <>
                {/* Regular Home Content */}
                <section className="mb-8">
                  <h1 className="text-3xl font-bold mb-6">Good afternoon</h1>
                  <div className="grid grid-cols-3 gap-4">
                    {playlists.slice(0, 6).map((playlist) => (
                      <div key={playlist.id} className="bg-gray-800 bg-opacity-60 rounded-md flex items-center overflow-hidden hover:bg-gray-700 transition-all cursor-pointer group">
                        <div className={`w-16 h-16 ${playlist.color} flex-shrink-0`}></div>
                        <div className="p-4 flex-1">
                          <h3 className="font-semibold">{playlist.name}</h3>
                        </div>
                        <button className="mr-4 opacity-0 group-hover:opacity-100 transition-opacity bg-green-500 rounded-full p-2 hover:scale-105">
                          <Play className="w-5 h-5 text-black" />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Made for NFT Growers</h2>
                    <button className="text-gray-400 hover:text-white text-sm font-semibold">
                      Show all
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-6">
                    {playlists.map((playlist) => (
                      <div key={playlist.id} className="bg-gray-800 bg-opacity-40 p-4 rounded-lg hover:bg-gray-700 transition-all cursor-pointer group">
                        <div className={`w-full aspect-square rounded-md ${playlist.color} mb-4 relative overflow-hidden`}>
                          <button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-green-500 rounded-full p-2 hover:scale-105 shadow-lg">
                            <Play className="w-5 h-5 text-black" />
                          </button>
                        </div>
                        <h3 className="font-semibold mb-1">{playlist.name}</h3>
                        <p className="text-gray-400 text-sm">{playlist.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Recently Uploaded Songs - Replaces Recently Played */}
                <RecentlyUploaded refreshTrigger={refreshSongs} />
              </>
            )}
          </main>
        </div>
      </div>

      {/* Player Bar - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-50">
        <div className="flex items-center justify-between">
          {/* Current Track */}
          <div className="flex items-center space-x-4 w-1/4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-600 rounded"></div>
            <div>
              <h4 className="font-semibold text-sm">Growing NFT Beats</h4>
              <p className="text-gray-400 text-xs">Web3 Symphony</p>
            </div>
            <Heart className="w-4 h-4 text-green-500" />
          </div>

          {/* Player Controls */}
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

          {/* Volume Control */}
          <div className="flex items-center space-x-2 w-1/4 justify-end">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <div className="w-20 bg-gray-600 rounded-full h-1">
              <div className="bg-white rounded-full h-1 w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}