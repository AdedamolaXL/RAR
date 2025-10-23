'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useAccount } from 'wagmi'
import { Play, Heart, Users, Music, Clock } from 'lucide-react'
import { songService } from '@/services/songService'
import { useRouter } from 'next/navigation'

interface GalleryPlaylist {
  id: string
  playlist_name: string
  playlist_description: string
  playlist_songs: string[]
  energy_remaining: number
  likes: number
  play_count: number
  submitted_at: string
  user: {
    username: string
    wallet_address: string
  }
  playlist_prompt: {
    id: string
    name: string
    description: string
    color_gradient: string
  }
}

export default function PlaylistBattleGallery() {
  const [galleryData, setGalleryData] = useState<Record<string, any>>({})
  const [allSongs, setAllSongs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useUser()
  const { address } = useAccount()
  const router = useRouter() 

  useEffect(() => {
    loadGalleryPlaylists()
    loadAllSongs()
  }, [user, address])

  const loadGalleryPlaylists = async () => {
    try {
      setIsLoading(true)
      const url = address ? `/api/playlist-battle/gallery?userAddress=${address}` : '/api/playlist-battle/gallery'
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        setGalleryData(data.galleryPlaylists)
      }
    } catch (error) {
      console.error('Error loading gallery playlists:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadAllSongs = async () => {
    try {
      const songs = await songService.getSongs()
      setAllSongs(songs)
    } catch (error) {
      console.error('Error loading songs:', error)
    }
  }

  const getSongMap = () => {
    return new Map(allSongs.map(song => [song.id, song]))
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks}w ago`
  }

  if (isLoading) {
    return (
      <div className="flex h-full bg-black text-white">
        <div className="flex-1 p-8">
          <div className="animate-pulse space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-800 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const promptCount = Object.keys(galleryData).length
  const totalPlaylists = Object.values(galleryData).reduce((total: number, group: any) => 
    total + (group.playlists?.length || 0), 0
  )

  return (
    <div className="flex h-full bg-black text-white">
      {/* Sidebar */}
      <div className="w-64 bg-black p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">NFTune Gallery</h1>
          <p className="text-gray-400 text-sm">Community Playlist Battles</p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-gray-300 mb-2">
              <Users className="w-4 h-4" />
              <span>{totalPlaylists} Playlists</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <Music className="w-4 h-4" />
              <span>{promptCount} Categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-gradient-to-r from-gray-900 to-black p-6">
          <h1 className="text-3xl font-bold mb-2">Playlist Battle Gallery</h1>
          <p className="text-gray-400">
            Discover playlists created by the community in playlist battles
          </p>
        </header>

        <main className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-gray-900 to-black">
          {promptCount === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Playlists Yet</h3>
              <p>Complete a playlist battle to submit your first creation!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(galleryData).map(([promptId, group]: [string, any]) => (
                <section key={promptId} className="mb-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-4 h-12 rounded ${group.prompt.color_gradient.split(' ')[0]}`}></div>
                    <div>
                      <h2 className="text-2xl font-bold">{group.prompt.name}</h2>
                      <p className="text-gray-400">{group.prompt.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {group.playlists.map((playlist: GalleryPlaylist) => {
    const songMap = getSongMap()
    const playlistSongs = playlist.playlist_songs
      .map(songId => songMap.get(songId))
      .filter(Boolean)
    
    return (
      // ADD THE CLICKABLE DIV HERE:
      <div 
        key={playlist.id}
        className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-all cursor-pointer group"
        onClick={() => router.push(`/playlist-battle/gallery/${playlist.id}`)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">
              {playlist.playlist_name}
            </h3>
            <p className="text-gray-400 text-sm">
              by {playlist.user.username}
            </p>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation() // Prevent navigation when clicking play
              // Add play functionality here if desired
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-green-500 rounded-full p-2 hover:scale-105"
          >
            <Play className="w-4 h-4 text-black" />
          </button>
        </div>

        {/* REST OF THE CARD CONTENT (stats, song previews, etc.) */}
        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <Music className="w-4 h-4" />
            <span>{playlistSongs.length} songs</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{formatTimeAgo(playlist.submitted_at)}</span>
          </div>
          <div className="flex items-center space-x-4 pt-2">
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4 text-red-500" />
              <span>{playlist.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Play className="w-4 h-4 text-green-500" />
              <span>{playlist.play_count}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>{playlist.energy_remaining} energy</span>
            </div>
          </div>
        </div>

        {/* Preview of first few songs */}
        <div className="mt-4 space-y-1">
          {playlistSongs.slice(0, 3).map((song, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
              <span className="truncate">{song?.title}</span>
            </div>
          ))}
          {playlistSongs.length > 3 && (
            <div className="text-xs text-gray-600 pl-4">
              +{playlistSongs.length - 3} more
            </div>
          )}
        </div>
      </div>
    )
  })}
</div>
                </section>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}