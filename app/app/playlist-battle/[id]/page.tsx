'use client'

import { useParams, useRouter } from 'next/navigation'
import { useBattleInstance } from '@/app/playlist-battle/[id]/components/hooks/useBattleInstance'
import { useRevealLogic } from '@/app/playlist-battle/[id]/components/hooks/useRevealLogic'
import { useAudioPlayer } from '@/app/playlist-battle/[id]/components/hooks/useAudioPlayer'
import { SidebarContainer } from '@/app/playlist-battle/[id]/components/Sidebar/SidebarContainer'
import { PlaylistHeader } from '@/app/playlist-battle/[id]/components/MainContent/PlaylistHeader'
import { PlaylistControls } from '@/app/playlist-battle/[id]/components/MainContent/PlaylistControl'
import { SongsList } from '@/app/playlist-battle/[id]/components/MainContent/SongList'
import { PlayerBar } from '@/app/playlist-battle/[id]/PlayerBar'
import { LoadingState } from '@/app/playlist-battle/[id]/LoadingState'
import { useBattleEnergy } from '@/hooks/useBattleEnergy'

interface PlaylistBattlePageProps {
  params: {
    id: string
  }
}

export default function PlaylistBattlePage({ params }: PlaylistBattlePageProps) {
  const router = useRouter()

const {
    battleInstance,
    playlistSongs,
    queueSongs,
    isLoading,
    loadBattleInstance,
    addSongToPlaylist,
    passSong,
    rearrangePlaylist, // Add this
    pause // Add this
  } = useBattleInstance(params.id)


    const {
    revealedQueueSongs,
    currentSeedIndex,
    isFlipping,
    isCardFlipped,
    lastRevealResult,
    shouldRevealSong,
    getCurrentSeedChar,
    getRevealStats,
    canFlipMore,
    flipCard,
    flipCardBack,
    removeSongFromRevealed,
    resetRevealState
  } = useRevealLogic(battleInstance?.random_seed, queueSongs)
  
  const { isPlaying, currentSong, playSong, likeSong } = useAudioPlayer()
  const { energyUnits, consumeEnergy, canAddSong, canPassSong, isLoading: energyLoading } = useBattleEnergy(battleInstance)
  
  const handleAddToPlaylist = async (songId: string) => {
  if (!canAddSong) {
    alert('Not enough energy to add song! Need 5 energy units.')
    return
  }

  const success = await addSongToPlaylist(songId)
  if (success) {
    // Energy is updated by the API, so we need to refresh the battle instance
    await loadBattleInstance()
    removeSongFromRevealed(songId)
    console.log('✅ Added song to playlist and consumed 5 energy')
  } else {
    alert('Failed to add song. Please try again.')
  }
}

const handlePassSong = async (songId: string) => {
  if (!canPassSong) {
    alert('Not enough energy to pass song! Need 3 energy units.')
    return
  }

  const success = await passSong(songId)
  if (success) {
    // Energy is updated by the API, so we need to refresh the battle instance
    await loadBattleInstance()
    removeSongFromRevealed(songId)
    console.log('✅ Passed song and consumed 3 energy')
  } else {
    alert('Failed to pass song. Please try again.')
  }
}
  
   // Add handlers for restorative actions
  const handleRearrangePlaylist = async () => {
    const success = await rearrangePlaylist()
    if (success) {
      // Refresh to get updated energy and playlist order
      await loadBattleInstance()
      console.log('✅ Playlist rearranged and gained 2 energy')
    } else {
      alert('Failed to rearrange playlist. Please try again.')
    }
  }

  const handlePause = async () => {
    const success = await pause()
    if (success) {
      // Refresh to get updated energy
      await loadBattleInstance()
      console.log('✅ Paused and gained 5 energy')
    } else {
      alert('Failed to pause. Please try again.')
    }
  }

  const handleLikeSong = (songId: string) => {
    likeSong(songId, loadBattleInstance)
  }

  const handlePlayAll = () => {
    if (playlistSongs.length > 0) {
      playSong(playlistSongs[0])
    }
  }

  // Loading state
  if (isLoading) {
    return <LoadingState />
  }

  // Not found state
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
      {/* Sidebar */}
     <SidebarContainer
        battleInstance={battleInstance}
        revealedQueueSongs={revealedQueueSongs}
        queueSongs={queueSongs}
        playlistSongs={playlistSongs}
        isFlipping={isFlipping}
        isCardFlipped={isCardFlipped}
        lastRevealResult={lastRevealResult}
        canFlipMore={canFlipMore}
        currentSeedIndex={currentSeedIndex}
        energyUnits={energyUnits}
        canAddSong={canAddSong}
        canPassSong={canPassSong}
        hasPlaylistSongs={playlistSongs.length > 0} // Pass this
        onFlip={flipCard}
        onFlipBack={flipCardBack}
        onAddToPlaylist={handleAddToPlaylist}
        onPassSong={handlePassSong}
        onRearrangePlaylist={handleRearrangePlaylist} // Add this
        onPause={handlePause} // Add this
        onBack={() => router.push('/')}
      />
       
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <PlaylistHeader
          playlistPrompt={battleInstance.playlist_prompt}
          playlistCount={playlistSongs.length}
          queueCount={queueSongs.length}
        />

        <div className="flex-1 p-6 bg-gradient-to-b from-gray-900 to-black overflow-y-auto">
          <PlaylistControls
            hasPlaylistSongs={playlistSongs.length > 0}
            onPlayAll={handlePlayAll}
          />

          <div className="space-y-2">
            <SongsList
              songs={playlistSongs}
              onPlaySong={playSong}
              onLikeSong={handleLikeSong}
            />
          </div>
        </div>
      </div>

      {/* Player Bar */}
      <PlayerBar currentSong={currentSong} />
    </div>
  )
}