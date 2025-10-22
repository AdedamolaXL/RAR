import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const battleInstanceId = params.id

    // Get current battle instance
    const { data: battle, error: fetchError } = await supabase
      .from('playlist_battle_instances')
      .select('playlist_songs, energy_units')
      .eq('id', battleInstanceId)
      .single()

    if (fetchError) {
      throw fetchError
    }

    // Check if there are songs to rearrange
    if (!battle.playlist_songs || battle.playlist_songs.length === 0) {
      return NextResponse.json({ 
        error: 'No songs in playlist to rearrange' 
      }, { status: 400 })
    }

    // Rearrange playlist songs (shuffle them)
    const shuffledSongs = [...battle.playlist_songs]
    for (let i = shuffledSongs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledSongs[i], shuffledSongs[j]] = [shuffledSongs[j], shuffledSongs[i]];
    }

    // Add 2 energy units
    const newEnergy = Math.min(100, battle.energy_units + 2)

    // Update playlist order and energy
    const { data: updatedBattle, error: updateError } = await supabase
      .from('playlist_battle_instances')
      .update({ 
        playlist_songs: shuffledSongs,
        energy_units: newEnergy,
        updated_at: new Date().toISOString()
      })
      .eq('id', battleInstanceId)
      .select(`
        *,
        playlist_prompt:playlist_battle_prompts(*)
      `)
      .single()

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ 
      success: true, 
      updatedBattle,
      energy_units: newEnergy,
      message: 'Playlist rearranged and gained 2 energy!'
    })
    
  } catch (error: any) {
    console.error('Error rearranging playlist:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to rearrange playlist' },
      { status: 500 }
    )
  }
}