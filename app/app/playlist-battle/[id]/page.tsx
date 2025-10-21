'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Play, Plus, ListMusic, ArrowLeft, Heart, MoreHorizontal, Volume2 } from 'lucide-react'
import { songService } from '@/services/songService'
import { playlistBattleService } from '@/services/playlistBattleService'

interface PlaylistBattlePageProps {
  params: {
    id: string
  }
}

interface Song {
  id: string
  title: string
  artist: string
  album?: string
  duration: number
  file_path: string
  likes: number
  play_count: number
}

interface BattleInstance {
  id: string
  user_id: string
  playlist_prompt: {
    name: string
    description: string
    color_gradient: string
  }
  random_seed: string
  coin_flip_result: boolean
  initial_seed_count: number
  library_songs: string[]
  playlist_songs: string[]
  queue_songs: string[]
  created_at: string
}

export default function PlaylistBattlePage({ params }: PlaylistBattlePageProps) {
  const [battleInstance, setBattleInstance] = useState<BattleInstance | null>(null)
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([])
  const [queueSongs, setQueueSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadBattleInstance()
  }, [params.id])

  const loadBattleInstance = async () => {
    try {
      setIsLoading(true)
      
      // Fetch battle instance with full song details
      const response = await fetch(`/api/playlist-battle/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        setBattleInstance(data.battleInstance)
        setPlaylistSongs(data.playlistSongs || [])
        setQueueSongs(data.queueSongs || [])
      } else {
        console.error('Failed to load battle instance:', data.error)
      }
    } catch (error) {
      console.error('Error loading battle instance:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addSongToPlaylist = async (songId: string) => {
    try {
      const response = await fetch(`/api/playlist-battle/${params.id}/add-song`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId })
      })
      
      const data = await response.json()
      if (data.success) {
        setBattleInstance(data.updatedBattle)
        setPlaylistSongs(data.playlistSongs || [])
        setQueueSongs(data.queueSongs || [])
      } else {
        console.error('Failed to add song:', data.error)
      }
    } catch (error) {
      console.error('Error adding song to playlist:', error)
    }
  }

  const playSong = async (song: Song) => {
    try {
      // Increment play count
      await songService.incrementPlayCount(song.id)
      
      // Get the actual audio URL
      const audioUrl = songService.getSongUrl(song.file_path)
      
      // Create an audio element to play the song
      const audio = new Audio(audioUrl)
      
      audio.onplay = () => {
        setIsPlaying(true)
        setCurrentSong(song)
      }
      
      audio.onpause = () => {
        setIsPlaying(false)
      }
      
      audio.onended = () => {
        setIsPlaying(false)
        setCurrentSong(null)
      }
      
      await audio.play()
    } catch (err) {
      console.error('Error playing song:', err)
      alert('Error playing song. Please try again.')
    }
  }

  const likeSong = async (songId: string) => {
    try {
      await songService.likeSong(songId)
      // Refresh the song data
      loadBattleInstance()
    } catch (err) {
      console.error('Error liking song:', err)
    }
  }

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getGradientClass = (colorGradient: string) => {
    // Extract color from gradient string or use default
    if (colorGradient && colorGradient.includes('from-')) {
      return colorGradient
    }
    return 'bg-gradient-to-b from-purple-900 to-black'
  }

  if (isLoading) {
    return (
      <div className="flex h-full bg-black text-white">
        <div className="w-80 bg-gray-900 p-6">
          <div className="animate-pulse bg-gray-800 h-6 w-24 rounded mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-gray-800 h-12 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="p-6 bg-gradient-to-b from-purple-900 to-black">
            <div className="animate-pulse bg-gray-800 h-8 w-48 rounded mb-2"></div>
            <div className="animate-pulse bg-gray-800 h-4 w-32 rounded"></div>
          </div>
          <div className="p-6 flex-1">
            <div className="flex items-center space-x-4 mb-6">
              <div className="animate-pulse bg-gray-800 w-12 h-12 rounded-full"></div>
              <div className="animate-pulse bg-gray-800 w-12 h-12 rounded-full"></div>
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-gray-800 h-16 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!battleInstance) {
    return (
      <div className="flex h-full bg-black text-white items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Battle Not Found</h1>
          <p className="text-gray-400 mb-6">The playlist battle you're looking for doesn't exist.</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full bg-black text-white">
      {/* Sidebar - Song Queue */}
      <div className="w-80 bg-gray-900 p-6 border-r border-gray-800">
        <div className="flex items-center space-x-2 mb-6">
          <button 
            onClick={() => router.push('/')}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold">Song Queue</h2>
        </div>
        
        <div className="space-y-2">
          {queueSongs.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <ListMusic className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Queue is empty</p>
              <p className="text-sm">All songs added to playlist</p>
            </div>
          ) : (
            queueSongs.map((song) => (
              <div 
                key={song.id} 
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all group"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded flex-shrink-0 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{song.title}</p>
                    <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                  </div>
                </div>
                <button 
                  onClick={() => addSongToPlaylist(song.id)}
                  className="p-2 bg-green-500 rounded-full hover:bg-green-600 transition-colors opacity-0 group-hover:opacity-100"
                  title="Add to playlist"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Battle Info */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h3 className="font-semibold mb-2">Battle Info</h3>
          <div className="text-sm text-gray-400 space-y-1">
            <p>Initial Seeds: {battleInstance.initial_seed_count}</p>
            <p>Coin Flip: {battleInstance.coin_flip_result ? 'Heads' : 'Tails'}</p>
            <p>Queue: {queueSongs.length} songs</p>
            <p>Playlist: {playlistSongs.length} songs</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className={`p-6 ${getGradientClass(battleInstance.playlist_prompt.color_gradient)} flex items-end space-x-6`}>
          <div className="w-48 h-48 bg-black bg-opacity-30 rounded-lg shadow-2xl flex items-center justify-center flex-shrink-0">
            <ListMusic className="w-16 h-16 text-white opacity-70" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-300">PLAYLIST BATTLE</p>
            <h1 className="text-5xl font-bold mt-2 mb-4">{battleInstance.playlist_prompt.name}</h1>
            <p className="text-gray-300 text-lg">{battleInstance.playlist_prompt.description}</p>
            <div className="flex items-center space-x-2 mt-4 text-sm text-gray-300">
              <span>NFTune</span>
              <span>•</span>
              <span>{playlistSongs.length} songs in playlist</span>
              <span>•</span>
              <span>{queueSongs.length} songs in queue</span>
            </div>
          </div>
        </div>

        {/* Playlist Content */}
        <div className="flex-1 p-6 bg-gradient-to-b from-gray-900 to-black overflow-y-auto">
          {/* Playlist Controls */}
          <div className="flex items-center space-x-6 mb-8">
            <button 
              onClick={() => playlistSongs.length > 0 && playSong(playlistSongs[0])}
              className="bg-green-500 hover:bg-green-400 rounded-full p-4 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={playlistSongs.length === 0}
            >
              <Play className="w-6 h-6 text-black" />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <ListMusic className="w-8 h-8" />
            </button>
          </div>

          {/* Playlist Songs */}
          <div className="space-y-2">
            {playlistSongs.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <ListMusic className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No songs in playlist yet</h3>
                <p>Add songs from the queue to build your battle playlist</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-gray-400 text-sm font-medium border-b border-gray-800">
                  <div className="col-span-1">#</div>
                  <div className="col-span-6">TITLE</div>
                  <div className="col-span-3">ALBUM</div>
                  <div className="col-span-2 text-right">DURATION</div>
                </div>
                
                {playlistSongs.map((song, index) => (
                  <div 
                    key={song.id} 
                    className="grid grid-cols-12 gap-4 px-4 py-3 rounded-md hover:bg-gray-800 transition-all cursor-pointer group"
                    onClick={() => playSong(song)}
                  >
                    <div className="col-span-1 flex items-center">
                      <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
                      <Play className="w-4 h-4 text-white hidden group-hover:block" />
                    </div>
                    <div className="col-span-6 flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded flex-shrink-0 flex items-center justify-center">
                        <Play className="w-3 h-3 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">{song.title}</p>
                        <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                      </div>
                    </div>
                    <div className="col-span-3 flex items-center">
                      <p className="text-gray-400 text-sm truncate">{song.album || 'Single'}</p>
                    </div>
                    <div className="col-span-2 flex items-center justify-end space-x-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          likeSong(song.id)
                        }}
                        className="text-gray-400 hover:text-green-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Like song"
                      >
                        <Heart className="w-4 h-4" />
                        {song.likes > 0 && (
                          <span className="text-xs ml-1">{song.likes}</span>
                        )}
                      </button>
                      <button 
                        className="text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                        title="More options"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      <p className="text-gray-400 text-sm">{formatDuration(song.duration)}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Player Bar */}
      <div className="fixed bottom-0 left-80 right-0 bg-gray-900 border-t border-gray-800 p-4 z-50">
        <div className="flex items-center justify-between">
          {/* Current Track */}
          {currentSong ? (
            <div className="flex items-center space-x-4 w-1/4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-600 rounded flex items-center justify-center">
                <Play className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-sm truncate">{currentSong.title}</h4>
                <p className="text-gray-400 text-xs truncate">{currentSong.artist}</p>
              </div>
            </div>
          ) : (
            <div className="w-1/4 text-gray-400 text-sm">
              No song playing
            </div>
          )}

          {/* Player Controls */}
          <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-white transition-colors">
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center space-x-2 w-full">
              <span className="text-xs text-gray-400">0:00</span>
              <div className="flex-1 bg-gray-600 rounded-full h-1">
                <div className="bg-white rounded-full h-1 w-0"></div>
              </div>
              <span className="text-xs text-gray-400">
                {currentSong ? formatDuration(currentSong.duration) : '0:00'}
              </span>
            </div>
          </div>

          {/* Empty space for balance */}
          <div className="w-1/4"></div>
        </div>
      </div>
    </div>
  )
}