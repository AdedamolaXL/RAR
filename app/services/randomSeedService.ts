import { ethers } from 'ethers'
import { songService } from './songService'
import { Song } from '@/types/song'

const RANDOM_SEED_ABI = [
  "function requestRandomSeed() external payable",
  "function currentSeed() external view returns (bytes32)",
  "event RandomSeedGenerated(bytes32 seed)"
]

const CONTRACT_ADDRESS = "0xA13C674F8A8715E157BA42237A6b1Dff24EE274F"

export const randomSeedService = {
  // Request a new random seed from blockchain
  async requestRandomSeed(): Promise<void> {
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, RANDOM_SEED_ABI, signer)
      
      // You'll need to check the actual fee amount from the contract
      const tx = await contract.requestRandomSeed({ value: ethers.parseEther("0.001") })
      await tx.wait()
    } catch (error) {
      console.error('Error requesting random seed:', error)
      throw error
    }
  },

  // Get current seed from blockchain
  async getCurrentSeed(): Promise<string | null> {
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, RANDOM_SEED_ABI, provider)
      
      const seed = await contract.currentSeed()
      return seed === '0x0000000000000000000000000000000000000000000000000000000000000000' ? null : seed
    } catch (error) {
      console.error('Error fetching random seed:', error)
      return null
    }
  },

  // Generate daily playlists using blockchain randomness
  async generateDailyPlaylists(): Promise<any[]> {
    const seed = await this.getCurrentSeed()
    const allSongs = await songService.getSongs()
    
    if (allSongs.length === 0) {
      return this.getFallbackPlaylists()
    }

    // Use blockchain seed if available, otherwise fallback
    const playlists = seed 
      ? this.generatePlaylistsWithSeed(allSongs, seed)
      : this.generatePlaylistsWithFallback(allSongs)

    return playlists
  },

  // Generate playlists using blockchain seed
  generatePlaylistsWithSeed(songs: Song[], seed: string): any[] {
    const playlistTemplates = [
      { name: "Daily Mix", description: "Fresh picks for today", color: "bg-gradient-to-br from-purple-900 to-blue-500" },
      { name: "Chill Vibes", description: "Perfect for relaxing", color: "bg-gradient-to-br from-green-900 to-emerald-500" },
      { name: "Energy Boost", description: "Get motivated", color: "bg-gradient-to-br from-orange-900 to-red-500" },
      { name: "Focus Flow", description: "Concentrate and create", color: "bg-gradient-to-br from-blue-900 to-cyan-500" },
      { name: "Community Picks", description: "Trending in the community", color: "bg-gradient-to-br from-pink-900 to-rose-500" },
      { name: "Discover Weekly", description: "New finds just for you", color: "bg-gradient-to-br from-yellow-900 to-amber-500" }
    ]

    // Use Fisher-Yates shuffle with blockchain seed
    const shuffledSongs = this.fisherYatesShuffle([...songs], seed)
    
    return playlistTemplates.map((template, index) => {
      const start = index * 5
      const end = start + 5
      const playlistSongs = shuffledSongs.slice(start, end)
      
      return {
        ...template,
        id: index + 1,
        songs: playlistSongs,
        songCount: playlistSongs.length
      }
    })
  },

  // Fisher-Yates shuffle using blockchain seed
  fisherYatesShuffle<T>(array: T[], seed: string): T[] {
    const shuffled = [...array]
    const random = this.createSeededRandom(seed)
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled
  },

  // Create deterministic random number generator from seed
  createSeededRandom(seed: string): () => number {
    // Convert bytes32 seed to numeric seed
    const numericSeed = this.bytes32ToNumber(seed)
    let state = numericSeed
    
    return () => {
      // Simple LCG (Linear Congruential Generator)
      state = (state * 1664525 + 1013904223) % 4294967296
      return state / 4294967296
    }
  },

  // Convert bytes32 to number for seeding
  bytes32ToNumber(bytes32: string): number {
    // Take first 8 characters of the hex string and convert to number
    return parseInt(bytes32.slice(2, 10), 16)
  },

  // Fallback without blockchain seed
  generatePlaylistsWithFallback(songs: Song[]): any[] {
    const shuffledSongs = [...songs].sort(() => Math.random() - 0.5)
    
    const playlistTemplates = [
      { name: "Daily Mix", description: "Fresh picks for today", color: "bg-gradient-to-br from-purple-900 to-blue-500" },
      { name: "Chill Vibes", description: "Perfect for relaxing", color: "bg-gradient-to-br from-green-900 to-emerald-500" },
      { name: "Energy Boost", description: "Get motivated", color: "bg-gradient-to-br from-orange-900 to-red-500" },
      { name: "Focus Flow", description: "Concentrate and create", color: "bg-gradient-to-br from-blue-900 to-cyan-500" },
      { name: "Community Picks", description: "Trending in the community", color: "bg-gradient-to-br from-pink-900 to-rose-500" },
      { name: "Discover Weekly", description: "New finds just for you", color: "bg-gradient-to-br from-yellow-900 to-amber-500" }
    ]

    return playlistTemplates.map((template, index) => {
      const start = index * 5
      const end = start + 5
      const playlistSongs = shuffledSongs.slice(start, end)
      
      return {
        ...template,
        id: index + 1,
        songs: playlistSongs,
        songCount: playlistSongs.length
      }
    })
  },

  // Fallback playlists when no songs available
  getFallbackPlaylists() {
    return [
      { id: 1, name: "Daily Mix", description: "Fresh picks for today", color: "bg-gradient-to-br from-purple-900 to-blue-500", songs: [], songCount: 0 },
      { id: 2, name: "Chill Vibes", description: "Perfect for relaxing", color: "bg-gradient-to-br from-green-900 to-emerald-500", songs: [], songCount: 0 },
      { id: 3, name: "Energy Boost", description: "Get motivated", color: "bg-gradient-to-br from-orange-900 to-red-500", songs: [], songCount: 0 },
      { id: 4, name: "Focus Flow", description: "Concentrate and create", color: "bg-gradient-to-br from-blue-900 to-cyan-500", songs: [], songCount: 0 },
      { id: 5, name: "Community Picks", description: "Trending in the community", color: "bg-gradient-to-br from-pink-900 to-rose-500", songs: [], songCount: 0 },
      { id: 6, name: "Discover Weekly", description: "New finds just for you", color: "bg-gradient-to-br from-yellow-900 to-amber-500", songs: [], songCount: 0 }
    ]
  }
}