import { ListMusic } from 'lucide-react'
import { PlaylistPrompt } from '@/app/playlist-battle/[id]/types/playlist-battle'

interface PlaylistHeaderProps {
  playlistPrompt: PlaylistPrompt
  playlistCount: number
  queueCount: number
}

export const PlaylistHeader = ({
  playlistPrompt,
  playlistCount,
  queueCount
}: PlaylistHeaderProps) => {
  const getGradientClass = (colorGradient: string) => {
    if (colorGradient && colorGradient.includes('from-')) {
      return colorGradient
    }
    return 'bg-gradient-to-b from-purple-900 to-black'
  }

  return (
    <div className={`p-6 ${getGradientClass(playlistPrompt.color_gradient)} flex items-end space-x-6`}>
      <div className="w-48 h-48 bg-black bg-opacity-30 rounded-lg shadow-2xl flex items-center justify-center flex-shrink-0">
        <ListMusic className="w-16 h-16 text-white opacity-70" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold uppercase tracking-wider text-gray-300">PLAYLIST BATTLE</p>
        <h1 className="text-5xl font-bold mt-2 mb-4">{playlistPrompt.name}</h1>
        <p className="text-gray-300 text-lg">{playlistPrompt.description}</p>
        <div className="flex items-center space-x-2 mt-4 text-sm text-gray-300">
          <span>NFTune</span>
          <span>•</span>
          <span>{playlistCount} songs in playlist</span>
          <span>•</span>
          <span>{queueCount} songs in queue</span>
        </div>
      </div>
    </div>
  )
}