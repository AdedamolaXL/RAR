import { Play, ListMusic } from 'lucide-react'

interface PlaylistControlsProps {
  hasPlaylistSongs: boolean
  onPlayAll: () => void
}

export const PlaylistControls = ({
  hasPlaylistSongs,
  onPlayAll
}: PlaylistControlsProps) => {
  return (
    <div className="flex items-center space-x-6 mb-8">
      <button 
        onClick={onPlayAll}
        className="bg-green-500 hover:bg-green-400 rounded-full p-4 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!hasPlaylistSongs}
      >
        <Play className="w-6 h-6 text-black" />
      </button>
      <button className="text-gray-400 hover:text-white transition-colors">
        <ListMusic className="w-8 h-8" />
      </button>
    </div>
  )
}