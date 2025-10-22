import { Play, Plus, EyeOff } from 'lucide-react'
import { Song } from '@/app/playlist-battle/[id]/types/playlist-battle'

interface RevealedSongsListProps {
  revealedSongs: Song[]
  onAddToPlaylist: (songId: string) => void
}

export const RevealedSongsList = ({
  revealedSongs,
  onAddToPlaylist
}: RevealedSongsListProps) => {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-300 mb-2">Revealed Songs</h3>
      {revealedSongs.length === 0 ? (
        <div className="text-center py-6 text-gray-400 border-2 border-dashed border-gray-700 rounded-lg">
          <EyeOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No songs revealed yet</p>
          <p className="text-xs">Use the reveal card above</p>
        </div>
      ) : (
        revealedSongs.map((song) => (
          <div 
            key={song.id} 
            className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all group"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded flex-shrink-0 flex items-center justify-center">
                <Play className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">{song.title}</p>
                <p className="text-gray-400 text-xs truncate">{song.artist}</p>
              </div>
            </div>
            <button 
              onClick={() => onAddToPlaylist(song.id)}
              className="p-2 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
              title="Add to playlist"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ))
      )}
    </div>
  )
}