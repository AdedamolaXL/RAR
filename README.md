# RAR - Random Algorithm Radio
> A different way of listening, curating and finding music!

RAR is a Web3 music experience that turns playlist creation into a verifiable game of randomness, taste, and reputation. It’s where music curation becomes a form of play — and your taste can literally grow your playlist value on-chain.

## Inspiration
Traditional music platforms use predictable algorithms that often lead to echo chambers. We wanted to create a platform where:
- True randomness drives discovery
- Community curation meets algorithmic generation
- Blockchain verifiability ensures fair and transparent processes
- Gamification makes music discovery fun and engaging

## What It Does
🎮 Playlist Battles
- Coin-flip start: Begin with a blockchain-verified coin flip that determines your starting conditions
- Energy-based gameplay: Manage energy units to add songs, pass on tracks, or rearrange your playlist
- Random song reveals: Use cryptographic seeds to reveal songs from your personal library
- Gallery submission: Share your curated playlists with the community

🎵 Daily Algorithmic Playlists
- Blockchain-seeded randomness: Daily random seeds from Pyth Entropy ensure truly unpredictable playlists
- Smart distribution: Algorithm fairly distributes songs across multiple daily playlists
- Fresh daily content: New playlists generated every 24 hours

🏆 Reputation & NFTs
- Playlist Reputation NFTs: Earn NFT-based reputation when your playlists get upvoted
- Decay mechanics: Reputation naturally decays over time, encouraging ongoing engagement
- Community voting: Upvote/downvote system with blockchain integration

## How We Built It
Frontend
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Wagmi and Viem for blockchain interactions

Backend & Infrastructure
- Supabase for database and storage
- Next.js API Routes for serverless functions
- PostgreSQL for relational data

Blockchain & Smart Contracts
- Arbitrum Sepolia for low-cost transactions
- Pyth Network for verifiable randomness
- Custom Solidity Contracts:
  - RandomSeed.sol - Daily random seed generation
  - CoinFlip.sol - Fair random number generation for gameplay
  - PlaylistReputationNFT.sol - Reputation tracking with decay

## Local Development
Prerequisites
- Node.js 18+
- Supabase account
- Wallet with Arbitrum Sepolia ETH
