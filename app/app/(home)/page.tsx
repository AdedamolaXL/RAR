'use client'

import { Card } from "@/components/ui/card"
import { Wallet } from "@/components/wagmi/components/wallet"
import Link from "next/link"
import { Play, Heart, Plus, MoreHorizontal, Shuffle, SkipBack, SkipForward, Repeat, Volume2, Upload, Library } from "lucide-react"
import { UploadSong } from "@/components/media/upload-song"
import { RecentlyUploaded } from "@/components/media/recently-uploaded"
import { useState, useEffect } from 'react'
import { randomSeedService } from '@/services/randomSeedService'
import { usePlaylistBattle } from '@/hooks/usePlaylistBattle'
import { useAccount } from 'wagmi'

export default function Home() {
  const { startBattle, isLoading, error } = usePlaylistBattle()
  const { isConnected } = useAccount()
  const [showUpload, setShowUpload] = useState(false)
  const [refreshSongs, setRefreshSongs] = useState(0)
  const [playlists, setPlaylists] = useState<any[]>([])
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(true)
  const [battlePrompts, setBattlePrompts] = useState<any[]>([])
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(true)

  // Load playlists when connected
  useEffect(() => {
    if (isConnected) {
      loadTodaysPlaylists()
      loadBattlePrompts()
    }
  }, [isConnected])

  const loadTodaysPlaylists = async () => {
    try {
      setIsLoadingPlaylists(true)
      const todaysPlaylists = await randomSeedService.getTodaysPlaylists()
      setPlaylists(todaysPlaylists)
    } catch (error) {
      console.error('Error loading playlists:', error)
      setPlaylists(randomSeedService.getFallbackPlaylists())
    } finally {
      setIsLoadingPlaylists(false)
    }
  }

  const loadBattlePrompts = async () => {
    try {
      setIsLoadingPrompts(true)
      const response = await fetch('/api/playlist-battle/prompts')
      const data = await response.json()
      
      if (data.success && data.prompts.length > 0) {
        setBattlePrompts(data.prompts)
        console.log('Loaded battle prompts:', data.prompts)
      } else {
        console.warn('No prompts found, using fallback')
        setBattlePrompts(getFallbackPrompts())
      }
    } catch (error) {
      console.error('Error loading battle prompts:', error)
      setBattlePrompts(getFallbackPrompts())
    } finally {
      setIsLoadingPrompts(false)
    }
  }

  const getFallbackPrompts = () => {
    return [
      {
        id: 'temp-1',
        name: 'Workout Energy Mix',
        description: 'High-energy tracks to fuel your session',
        color_gradient: 'from-purple-600 to-blue-600'
      },
      {
        id: 'temp-2',
        name: 'Chill Vibes Only',
        description: 'Relaxing beats for your downtime',
        color_gradient: 'from-green-600 to-emerald-600'
      },
      {
        id: 'temp-3',
        name: 'Party Starters',
        description: 'Get the celebration going',
        color_gradient: 'from-orange-600 to-red-600'
      },
      {
        id: 'temp-4',
        name: 'Focus Flow',
        description: 'Deep concentration soundtrack',
        color_gradient: 'from-blue-600 to-cyan-600'
      }
    ]
  }

  const handleUploadSuccess = () => {
    setRefreshSongs(prev => prev + 1)
    setShowUpload(false)
  }

  const handleStartBattle = async (promptId: string) => {
    console.log('Starting battle with prompt ID:', promptId)
    await startBattle(promptId)
  }

  // Show wallet connection if not connected
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-screen bg-black text-white">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">Connect your wallet to start playlist battles and explore NFTune</p>
          <Wallet />
        </div>
      </div>
    )
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

          {/* Content Area */}
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
                {/* Playlist Battle Section */}
                <section className="mb-8">
                  <h1 className="text-3xl font-bold mb-2">Create Your Ultimate Playlist Battle</h1>
                  <p className="text-gray-400 mb-6">Go head-to-head in a fastest finger playlist showdown</p>
                  
                  {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded mb-4">
                      {error}
                    </div>
                  )}
                  
                  {isLoadingPrompts ? (
                    <div className="grid grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-gray-800 rounded-md h-32 animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {battlePrompts.map((prompt) => (
                        <button 
                          key={prompt.id}
                          onClick={() => handleStartBattle(prompt.id)}
                          disabled={isLoading}
                          className={`bg-gradient-to-r ${prompt.color_gradient} rounded-md flex items-center overflow-hidden hover:scale-105 transition-all cursor-pointer group p-4 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <div className="w-16 h-16 bg-black bg-opacity-20 flex items-center justify-center flex-shrink-0">
                            {isLoading ? (
                              <div className="animate-spin">⟳</div>
                            ) : (
                              <Play className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div className="p-4 flex-1">
                            <h3 className="font-semibold">{prompt.name}</h3>
                            <p className="text-gray-200 text-sm">{prompt.description}</p>
                          </div>
                          {isLoading ? (
                            <div className="mr-4 animate-spin">⟳</div>
                          ) : (
                            <div className="mr-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-2 hover:scale-105">
                              <Play className="w-4 h-4 text-black" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
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

                <RecentlyUploaded refreshTrigger={refreshSongs} />
              </>
            )}
          </main>
        </div>
      </div>

      {/* Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 w-1/4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-600 rounded"></div>
            <div>
              <h4 className="font-semibold text-sm">Growing NFT Beats</h4>
              <p className="text-gray-400 text-xs">Web3 Symphony</p>
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
    </>
  )
}