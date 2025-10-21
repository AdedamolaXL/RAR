// app/app/api/playlist-battle/[id]/add-song/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { playlistBattleService } from '@/services/playlistBattleService'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const battleInstanceId = params.id
    const { songId } = await request.json()
    
    if (!songId) {
      return NextResponse.json({ error: 'Song ID is required' }, { status: 400 })
    }

    const updatedBattle = await playlistBattleService.addSongToPlaylist(battleInstanceId, songId)
    const battleSongs = await playlistBattleService.getBattleSongs(battleInstanceId)
    
    return NextResponse.json({ 
      success: true, 
      updatedBattle,
      ...battleSongs
    })
    
  } catch (error: any) {
    console.error('Error adding song to playlist:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add song to playlist' },
      { status: 500 }
    )
  }
}