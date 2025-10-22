import { Play, Volume2 } from 'lucide-react'
import { Song } from '@/app/playlist-battle/[id]/types/playlist-battle'

interface PlayerBarProps {
  currentSong: Song | null
}

export const PlayerBar = ({ currentSong }: PlayerBarProps) => {
  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
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
  )
}