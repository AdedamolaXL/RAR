import { ArrowLeft } from 'lucide-react'
import { BattleInstance, Song, RevealResult } from '@/app/playlist-battle/[id]/types/playlist-battle'
import { RevealCard } from './RevealCard'
import { EnergyBar } from './EnergyBar' 

interface SidebarContainerProps {
  battleInstance: BattleInstance
  revealedQueueSongs: Song[]
  queueSongs: Song[]
  playlistSongs: Song[]
  isFlipping: boolean
  isCardFlipped: boolean
  lastRevealResult: RevealResult | null
  canFlipMore: boolean
  currentSeedIndex: number
  onFlip: () => void
  onFlipBack: () => void // Add this
  onAddToPlaylist: (songId: string) => void
  onBack: () => void
  energyUnits: number
  canAddSong: boolean
  canPassSong: boolean // Add this
  onPassSong: (songId: string) => void 
  hasPlaylistSongs: boolean // Add this
  onRearrangePlaylist: () => void // Add this
  onPause: () => void 
}

export const SidebarContainer = ({
  battleInstance,
  revealedQueueSongs,
  queueSongs,
  playlistSongs,
  isFlipping,
  isCardFlipped,
  lastRevealResult,
  canFlipMore,
  currentSeedIndex,
  onFlip,
  onFlipBack, // Add this
  onAddToPlaylist,
  onBack,
  energyUnits,
  canAddSong,
  canPassSong, // Add this
  onPassSong,
  hasPlaylistSongs, // Add this
  onRearrangePlaylist, // Add this
  onPause,
}: SidebarContainerProps) => {
  const attemptsLeft = (battleInstance.random_seed?.slice(2).length || 0) - currentSeedIndex

  
   return (
     <div className="w-80 bg-gray-900 p-6 border-r border-gray-800 flex flex-col">
      <div className="flex items-center space-x-2 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold">Song Queue</h2>
       </div>
       
        <EnergyBar energyUnits={energyUnits} />

       {/* Centered Reveal Card */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <RevealCard
            isFlipping={isFlipping}
            isCardFlipped={isCardFlipped}
            lastRevealResult={lastRevealResult}
            canFlipMore={canFlipMore && (canAddSong || canPassSong)}
            attemptsLeft={attemptsLeft}
            revealedCount={revealedQueueSongs.length}
            totalQueueSongs={queueSongs.length}
            hasPlaylistSongs={hasPlaylistSongs} // Pass this
            onFlip={onFlip}
            onFlipBack={onFlipBack}
            onAddToPlaylist={onAddToPlaylist}
            onPassSong={onPassSong}
            onRearrangePlaylist={onRearrangePlaylist} // Pass this
            onPause={onPause} // Pass this
          />
        </div>
      </div>
    </div>
  )
}