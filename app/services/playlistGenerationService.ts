// app/services/playlistGenerationService.ts
import { supabase } from '@/lib/supabase'

class PlaylistGenerationService {
  private hasGeneratedThisSession = false
  private generationPromise: Promise<boolean> | null = null

  async ensurePlaylistsGenerated(): Promise<boolean> {
    // If we've already generated in this session, return
    if (this.hasGeneratedThisSession) {
      return true
    }

    // If generation is already in progress, return that promise
    if (this.generationPromise) {
      return this.generationPromise
    }

    // Start new generation
    this.generationPromise = this.generatePlaylistsIfNeeded()
    const result = await this.generationPromise
    
    if (result) {
      this.hasGeneratedThisSession = true
    }
    
    return result
  }

  private async generatePlaylistsIfNeeded(): Promise<boolean> {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      // Check if playlists already exist for today
      const { data: existingPlaylists } = await supabase
        .from('daily_playlists')
        .select('id')
        .eq('day', today)
        .limit(1)

      // If playlists already exist, no need to generate
      if (existingPlaylists && existingPlaylists.length > 0) {
        console.log('🎵 Playlists already exist for today')
        return true
      }

      console.log('🔄 No playlists found for today, generating...')

      // Step 1: Generate seed if needed
      const seedResponse = await fetch('/api/generate-daily-seed')
      const seedData = await seedResponse.json()

      if (!seedData.success) {
        console.error('❌ Failed to generate seed:', seedData.error)
        return false
      }

      // Step 2: Generate playlists with the seed
      const playlistsResponse = await fetch('/api/generate-playlists')
      const playlistsData = await playlistsResponse.json()

      if (playlistsData.success) {
        console.log('✅ Playlists generated successfully on app startup')
        return true
      } else {
        console.error('❌ Failed to generate playlists:', playlistsData.error)
        return false
      }

    } catch (error) {
      console.error('❌ Error in playlist generation:', error)
      return false
    }
  }

  // Reset for new sessions (optional)
  resetSession() {
    this.hasGeneratedThisSession = false
    this.generationPromise = null
  }
}

export const playlistGenerationService = new PlaylistGenerationService()