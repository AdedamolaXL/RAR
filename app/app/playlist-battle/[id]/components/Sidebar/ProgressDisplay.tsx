import { RevealStats } from '@/app/playlist-battle/[id]/types/playlist-battle'

interface ProgressDisplayProps {
  revealedCount: number
  totalQueueSongs: number
  currentSeedIndex: number
  revealStats: RevealStats
}

export const ProgressDisplay = ({
  revealedCount,
  totalQueueSongs,
  currentSeedIndex,
  revealStats
}: ProgressDisplayProps) => {
  return (
    <div className="mb-4 p-3 bg-gray-800 rounded-lg">
      <div className="flex justify-between text-sm text-gray-400 mb-2">
        <span>Revealed: {revealedCount}/{totalQueueSongs}</span>
        <span>Attempts: {currentSeedIndex}/{revealStats.total}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentSeedIndex / revealStats.total) * 100}%` }}
        ></div>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(revealedCount / totalQueueSongs) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}