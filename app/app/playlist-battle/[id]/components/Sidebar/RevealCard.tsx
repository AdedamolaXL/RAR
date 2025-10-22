import { Play, Plus, Eye, EyeOff, X, SkipForward, RefreshCw, Pause } from 'lucide-react'
import { RevealResult } from '@/app/playlist-battle/[id]/types/playlist-battle'

interface RevealCardProps {
  isFlipping: boolean
  isCardFlipped: boolean
  lastRevealResult: RevealResult | null
  canFlipMore: boolean
  attemptsLeft: number
  revealedCount: number
  totalQueueSongs: number
  hasPlaylistSongs: boolean // Add this to check if rearrangement is possible
  onFlip: () => void
  onFlipBack: () => void
  onAddToPlaylist: (songId: string) => void
  onPassSong: (songId: string) => void
  onRearrangePlaylist: () => void // Add this
  onPause: () => void // Add this
}

export const RevealCard = ({
  isFlipping,
  isCardFlipped,
  lastRevealResult,
  canFlipMore,
  attemptsLeft,
  revealedCount,
  totalQueueSongs,
  hasPlaylistSongs, // Add this
  onFlip,
  onFlipBack,
  onAddToPlaylist,
  onPassSong,
  onRearrangePlaylist, // Add this
  onPause // Add this
}: RevealCardProps) => {
  console.log('🎴 Card State:', { isCardFlipped, isFlipping })

   const handleCardClick = () => {
    if (isFlipping) return;
    
    if (isCardFlipped) {
      onFlipBack();
    } else {
      if (canFlipMore) {
        onFlip();
      }
    }
  }


   return (
    <div>
      <div 
        className={`relative w-full h-64 ${isFlipping ? 'pointer-events-none' : ''}`} 
        style={{ 
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Front of Card - Reveal Mode */}
        <div 
          className={`absolute w-full h-full bg-gradient-to-br from-purple-600 to-blue-700 rounded-xl shadow-2xl cursor-pointer transition-transform duration-500 ${
            canFlipMore ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'
          }`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: isCardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transformStyle: 'preserve-3d'
          }}
          onClick={canFlipMore ? handleCardClick : undefined}
        >
          <div className="flex flex-col items-center justify-center h-full p-6 text-white">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <Eye className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Reveal Card</h3>
            <p className="text-center text-white/90 text-base mb-2">
              {canFlipMore 
                ? "Click to reveal what's hidden" 
                : revealedCount >= totalQueueSongs 
                  ? "All songs revealed!" 
                  : "No more reveals available"}
            </p>
            {canFlipMore && (
              <div className="mt-3 text-sm bg-black/30 px-3 py-1.5 rounded">
                Attempts left: {attemptsLeft}
              </div>
            )}
          </div>
        </div>

        {/* Back of Card - Result Display */}
        <div 
          className={`absolute w-full h-full rounded-xl shadow-2xl cursor-pointer transition-transform duration-500 ${
            lastRevealResult?.revealed 
              ? 'bg-gradient-to-br from-green-600 to-emerald-700' 
              : 'bg-gradient-to-br from-gray-600 to-gray-700'
          } ${!isFlipping ? 'hover:scale-105' : ''}`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: isCardFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
            transformStyle: 'preserve-3d'
          }}
          onClick={handleCardClick}
        >
          <div className="flex flex-col items-center justify-center h-full p-6 text-white">
            {lastRevealResult?.revealed && lastRevealResult.song ? (
              <>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <Play className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Song Found!</h3>
                <p className="text-center font-semibold text-base mb-1">{lastRevealResult.song.title}</p>
                <p className="text-center text-white/80 text-sm mb-6">{lastRevealResult.song.artist}</p>

                
                {/* Action Buttons */}
                <div className="flex space-x-3 w-full max-w-xs">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      onAddToPlaylist(lastRevealResult.song!.id)
                    }}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-600 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add (+5⚡)</span>
                  </button>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      onPassSong(lastRevealResult.song!.id)
                    }}
                    className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center space-x-1"
                  >
                    <SkipForward className="w-4 h-4" />
                    <span>Pass (+3⚡)</span>
                  </button>
                </div>
                
                <p className="text-center text-white/60 text-xs mt-4">Click card to flip back</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <EyeOff className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-center mb-3">No Song</h3>
                <p className="text-center text-white/80 text-base mb-6">Better luck next time!</p>
                
                {/* Restorative Action Buttons */}
                <div className="flex space-x-3 w-full max-w-xs">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      onRearrangePlaylist()
                    }}
                    disabled={!hasPlaylistSongs}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Rearrange (+2⚡)</span>
                  </button>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      onPause()
                    }}
                    className="flex-1 bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-purple-600 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Pause (+5⚡)</span>
                  </button>
                </div>
                
                {!hasPlaylistSongs && (
                  <p className="text-center text-white/60 text-xs mt-2">
                    Add songs to playlist first to rearrange
                  </p>
                )}
                
                <p className="text-center text-white/60 text-xs mt-4">Click card to flip back</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>

  )
}