// app/hooks/useCoinFlipClient.ts
'use client'

import { useAccount, useWriteContract, useReadContract } from 'wagmi'
import { useState, useCallback } from 'react'
import { CoinFlipAddress } from '@/contracts/addresses'
import COIN_FLIP_ABI from '@/contracts/CoinFlip.json'
import { parseEther } from 'viem'

export const useCoinFlipClient = () => {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { writeContractAsync } = useWriteContract()
  
  // Read the fee from the contract
  const { data: feeData } = useReadContract({
    address: CoinFlipAddress,
    abi: COIN_FLIP_ABI.abi,
    functionName: 'getRequestFee',
  })

  const requestRandom = useCallback(async (): Promise<{ sequenceNumber: string; txHash: string } | null> => {
    if (!address) {
      setError('No wallet connected')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log('🎲 Requesting random number from CoinFlip contract...')
      console.log('📍 Contract:', CoinFlipAddress)
      console.log('👤 User:', address)
      
      const fee = feeData || parseEther("0.0005") // Default fallback
      console.log('💰 Required fee:', fee.toString(), 'wei')
      
      // Call requestRandom on the CoinFlip contract
      const hash = await writeContractAsync({
        address: CoinFlipAddress,
        abi: COIN_FLIP_ABI.abi,
        functionName: 'requestRandom',
        value: fee,
      })
      
      console.log('✅ Transaction sent:', hash)
      
      return {
        sequenceNumber: '0', // We don't really need this
        txHash: hash
      }
      
    } catch (err: any) {
      console.error('❌ Error requesting random:', err)
      setError(err.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [address, writeContractAsync, feeData])

  const getUserResult = useCallback(async (): Promise<{
    randomNumber: string
    isHeads: boolean
    timestamp: number
    exists: boolean
  } | null> => {
    if (!address) {
      setError('No wallet connected')
      return null
    }

    try {
      console.log('📊 Checking user result for:', address)
      
      // Use ethers to read from contract (server-side via API)
      const response = await fetch(`/api/coin-flip/result/${address}`)
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error)
      }
      
      console.log('✅ User result:', data.result)
      return data.result
      
    } catch (err: any) {
      console.error('❌ Error getting user result:', err)
      setError(err.message)
      return null
    }
  }, [address])

  const hasUserResult = useCallback(async (): Promise<boolean> => {
    if (!address) {
      setError('No wallet connected')
      return false
    }

    try {
      const response = await fetch(`/api/coin-flip/has-result/${address}`)
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error)
      }
      
      return data.hasResult
    } catch (err: any) {
      console.error('❌ Error checking user result:', err)
      setError(err.message)
      return false
    }
  }, [address])

  const waitForResult = useCallback(async (timeoutMs = 60000): Promise<{
    randomNumber: string
    isHeads: boolean
    timestamp: number
    exists: boolean
  } | null> => {
    if (!address) {
      setError('No wallet connected')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log('⏳ Waiting for random result...')
      const startTime = Date.now()
      
      return new Promise(async (resolve, reject) => {
        const checkInterval = setInterval(async () => {
          try {
            // Check if timeout reached
            if (Date.now() - startTime > timeoutMs) {
              clearInterval(checkInterval)
              reject(new Error('Timeout waiting for random result'))
              return
            }
            
            // Check if result exists
            const hasResult = await hasUserResult()
            
            if (hasResult) {
              clearInterval(checkInterval)
              const result = await getUserResult()
              if (result) {
                console.log('✅ Result received:', result)
                resolve(result)
              } else {
                reject(new Error('Failed to get result'))
              }
            } else {
              console.log('⏳ Still waiting... checking again in 2s')
            }
          } catch (error) {
            clearInterval(checkInterval)
            reject(error)
          }
        }, 2000) // Check every 2 seconds
      })
      
    } catch (err: any) {
      console.error('❌ Error waiting for result:', err)
      setError(err.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [address, hasUserResult, getUserResult])

  return {
    requestRandom,
    getUserResult,
    hasUserResult,
    waitForResult,
    isLoading,
    error,
    clearError: () => setError(null)
  }
}