import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { userService } from '@/services/userService'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userAddress = searchParams.get('userAddress')
    
    let query = supabase
      .from('gallery_playlists')
      .select(`
        *,
        user:users(username, wallet_address),
        playlist_prompt:playlist_battle_prompts(*)
      `)
      .order('submitted_at', { ascending: false })

    // If user address provided, filter by user
    if (userAddress) {
      const user = await userService.getUserByWalletAddress(userAddress.toLowerCase())
      if (user) {
        query = query.eq('user_id', user.id)
      }
    }

    const { data: galleryPlaylists, error } = await query

    if (error) {
      throw error
    }

    // Group by playlist prompt
    const groupedPlaylists = galleryPlaylists?.reduce((acc: any, playlist) => {
      const promptId = playlist.playlist_prompt_id
      if (!acc[promptId]) {
        acc[promptId] = {
          prompt: playlist.playlist_prompt,
          playlists: []
        }
      }
      acc[promptId].playlists.push(playlist)
      return acc
    }, {})

    return NextResponse.json({ 
      success: true, 
      galleryPlaylists: groupedPlaylists || {},
      totalCount: galleryPlaylists?.length || 0
    })

  } catch (error: any) {
    console.error('Error fetching gallery playlists:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch gallery playlists' },
      { status: 500 }
    )
  }
}