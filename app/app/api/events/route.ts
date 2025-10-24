import { NextResponse } from 'next/server'
import { startDecayListener } from '@/lib/decayListener'

// Keep the connection alive
export const maxDuration = 300 // 5 minutes

export async function GET() {
  try {
    console.log('🚀 Starting event listeners...')
    startDecayListener()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Event listeners started' 
    })
  } catch (error: any) {
    console.error('Error starting listeners:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}