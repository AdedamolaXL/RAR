# RAR - Random Algorithm Radio
> A different way of listening, curating and finding music!

RAR is a Web3 music streaming platform that turns playlist creation into a verifiable game of randomness, taste, and reputation. It’s where music curation becomes a form of play — and your taste can literally grow your playlist value on-chain.

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

### Prerequisites
- Node.js 18+
- Supabase account
- Wallet with Arbitrum Sepolia ETH

### Environment Setup
```bash
# Clone the repository
git clone [repository-url]
cd rar
```

```bash
# Install dependencies
npm install
```

```bash
# Set up environment variables
cp .env.example .env.local
```

### Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Blockchain
ARBITRUM_SEPOLIA_RPC_URL=your_arbitrum_rpc_url
WALLET_PRIVATE_KEY=your_wallet_private_key

# Contracts
RANDOM_SEED_ADDRESS=0xA13C674F8A8715E157BA42237A6b1Dff24EE274F
COIN_FLIP_ADDRESS=0x762353AdF1342ba85f6dDEac0446E2DA43ab84bf
PLAYLIST_REPUTATION_NFT_ADDRESS=0x0532d0A87B6013a8A086C37D39BC1EB013abC2f4
```

### Running the Application

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
### Project Structure
```bash
app/
├── app/                    # Next.js app router pages
├── components/            # Reusable UI components
├── contracts/            # Smart contract ABIs and addresses
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
├── services/            # Business logic and API services
└── types/               # TypeScript type definitions
```

##  Smart Contracts
- RandomSeed.sol
  -Generates daily random seeds using Pyth Entropy
  - Stores seeds for playlist generation
  - Fee-based random number requests

- CoinFlip.sol
  - Handles fair coin flips for gameplay
  - Uses Pyth for verifiable randomness
  - Tracks user results and timestamps

- PlaylistReputationNFT.sol
  - ERC-721 NFTs for playlist reputation
  - Decay mechanics for ongoing engagement
  - Voting-based reputation growth
