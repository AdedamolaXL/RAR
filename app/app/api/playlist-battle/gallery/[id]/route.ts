import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const playlistId = params.id

    const { data: playlist, error } = await supabase
      .from('gallery_playlists')
      .select(`
        *,
        user:users(username, wallet_address),
        playlist_prompt:playlist_battle_prompts(*)
      `)
      .eq('id', playlistId)
      .single()

    if (error || !playlist) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      playlist 
    })

  } catch (error: any) {
    console.error('Error fetching gallery playlist:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch playlist' },
      { status: 500 }
    )
  }
}