// app/app/playlist-battle/gallery/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { playlistBattleService } from '@/services/playlistBattleService'
import { useUser } from '@/contexts/UserContext'

export default function PlaylistBattleGallery() {
  const [battles, setBattles] = useState<any[]>([])
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      loadUserBattles()
    }
  }, [user])

  const loadUserBattles = async () => {
    try {
      const userBattles = await playlistBattleService.getUserBattles(user.id)
      setBattles(userBattles)
    } catch (error) {
      console.error('Error loading battles:', error)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Your Playlist Battles</h1>
      <div className="grid grid-cols-3 gap-6">
        {battles.map((battle) => (
          <div key={battle.id} className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-xl font-bold">{battle.playlist_prompt.name}</h3>
            <p className="text-gray-400">Initial seeds: {battle.initial_seed_count}</p>
            <p className="text-gray-400">Playlist: {battle.playlist_songs.length} songs</p>
            <p className="text-gray-400">Queue: {battle.queue_songs.length} songs</p>
          </div>
        ))}
      </div>
    </div>
  )
}