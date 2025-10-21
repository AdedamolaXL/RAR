// app/hooks/usePlaylistBattle.ts
'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useCoinFlipClient } from './useCoinFlipClient'

export const usePlaylistBattle = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { address } = useAccount()
  const router = useRouter()
  const { requestRandom, waitForResult } = useCoinFlipClient()

  const initializeBattle = async (playlistPromptId: string) => {
    if (!address) {
      setError('No wallet connected')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log('🎮 Starting battle initialization...')
      console.log('📍 Prompt ID:', playlistPromptId)
      console.log('👤 User Address:', address)

      // Step 1: Request random number from CoinFlip contract (user pays fee)
      console.log('🎲 Step 1: Requesting random number from CoinFlip contract...')
      const randomRequest = await requestRandom()
      
      if (!randomRequest) {
        throw new Error('Failed to request random number from blockchain')
      }
      
      console.log('✅ Random request successful:', randomRequest)

      // Step 2: Wait for the random result (with timeout)
      console.log('⏳ Step 2: Waiting for random result from Pyth Entropy...')
      const randomResult = await waitForResult(60000) // 60 second timeout
      
      if (!randomResult || !randomResult.exists) {
        throw new Error('Timeout waiting for random number from blockchain')
      }
      
      console.log('✅ Random result received:', {
        isHeads: randomResult.isHeads,
        timestamp: randomResult.timestamp
      })

      // Step 3: Call API to create battle instance with the random result
      console.log('💾 Step 3: Creating battle instance in database...')
      const response = await fetch('/api/playlist-battle/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          playlistPromptId,
          userAddress: address,
          randomNumber: randomResult.randomNumber,
          coinFlipResult: randomResult.isHeads,
          timestamp: randomResult.timestamp
        })
      })

      const data = await response.json()

      if (!data.success) {
        console.error('❌ API Error:', data)
        throw new Error(data.error || 'Failed to initialize battle')
      }

      console.log('✅ Battle instance created successfully:', data.battleInstance.id)
      return data.battleInstance
      
    } catch (err: any) {
      console.error('❌ Battle initialization failed:', err)
      setError(err.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const startBattle = async (playlistPromptId: string) => {
    console.log('🚀 Starting battle with prompt:', playlistPromptId)
    const battleInstance = await initializeBattle(playlistPromptId)
    
    if (battleInstance && battleInstance.id) {
      console.log('✅ Redirecting to battle page:', battleInstance.id)
      router.push(`/playlist-battle/${battleInstance.id}`)
    } else {
      console.error('❌ Failed to create battle instance')
      setError('Failed to create battle instance')
    }
  }

  return {
    initializeBattle,
    startBattle,
    isLoading,
    error,
    clearError: () => setError(null)
  }
}