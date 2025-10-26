# RAR - Random Algorithm Radio
> A different way of listening, curating and finding music!

RAR is a Web3 music application that turns playlist creation into a verifiable game of randomness, taste, and reputation using [Pyth randomness](https://github.com/pyth-network/pyth-examples/tree/main/entropy). It’s where music listening becomes a form of play.!


## Inspiration
Traditional music platforms use predictable algorithms that often lead to echo chambers. We wanted to create a platform where:
- True randomness drives discovery
- Community curation meets algorithmic generation
- Blockchain verifiability ensures fair and transparent processes
- Turning playlist making into a game of discovery and excitement. 

## What It Does
🎮 Playlist Battles
- Coin-flip start: Begin with a blockchain-verified coin flip that determines your starting conditions
  - Heads initialize your playlist instance with 0 songs.
  - Tails initialize your playlist instance with 2 songs. 
- Energy-based gameplay: Manage energy units to:
  -  add songs(-5 eu),
  -  pass on tracks (-3 eu),
  -  rearrange your playlist (+2 eu),
  -  or just pause and do nothing (+5 eu)
- Random song reveals: Use cryptographic seeds to reveal songs from your personal library.
  - We turn the 64 hexademical string generated for each random seed into an ideal 64 song queue
  - Where if the next character in your string determines if you get a song in your next queue or not
    - if the next character in the string is numbers, you get a song revealed
    - if the next character is an alphabet, no song is revealed :)   
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
  - [RandomSeed.sol](https://github.com/AdedamolaXL/RAR/blob/main/contract/contracts/RandomSeed.sol) - Daily random seed generation
  - [CoinFlip.sol](https://github.com/AdedamolaXL/RAR/blob/main/contract/contracts/CoinFlip.sol) - Fair random number generation for gameplay
  - [PlaylistReputationNFT.sol](https://github.com/AdedamolaXL/RAR/blob/main/contract/contracts/PlaylistReputationNFT.sol) - Reputation tracking with decay

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
├── app/                 # Next.js app router pages
├── components/          # Reusable UI components
├── contracts/           # Smart contract ABIs and addresses
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
├── services/            # Business logic and API services
└── types/               # TypeScript type definitions
```
