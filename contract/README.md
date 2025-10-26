# NFT Growth Contract

This repository contains the smart contracts for the RAR (Random Algorithm Radio) project, utilizing Solidity ^0.8.24. The contracts enable verifiable randomness, gamified playlist creation, and reputation tracking while integrating with the Pyth network for entropy (randomness) services.

## Contracts Overview

- **RandomSeed.sol:** Manages daily random seed generation for algorithmic playlist creation using Pyth Entropy.

- **CoinFlip.sol:** Handles fair coin flip mechanics for playlist battle initialization with verifiable randomness.

- **PlaylistReputationNFT.sol:** Implements ERC721A tokens with reputation growth and decay mechanics for playlist creators.

## Features

### RandomSeed Contract
- Daily random seed generation using Pyth Entropy
- Fee-based random number requests for playlist generation
-Seed storage and retrieval for deterministic playlist algorithms
- Automatic callback handling for entropy results

### CoinFlip Contract
- Fair coin flip mechanics for gameplay initialization
- User-specific result tracking with timestamps
- Integration with playlist battle energy systems
- Verifiable randomness for transparent gameplay

### PlaylistReputationNFT Contract
- Minting reputation NFTs for successful playlist submissions
- Voting-based reputation growth with community upvotes
- Time-based reputation decay mechanics
- Locking and unlocking mechanisms for state management between random callbacks

## Dependencies

- OpenZeppelin Contracts (Access Control, Security)
- ERC721A Contracts (Efficient batch minting)
- Pyth Network Entropy SDK (Randomness)

## Getting Started

### Prerequisites

- Node.js and npm/yarn installed.
- Bunx and Hardhat setup for smart contract compilation and deployment.

### Installation

Clone the repository and install the dependencies:

```sh
bun install
```

### Deploying to Blast Network

To deploy the contracts to the Blast Sepolia network, use the following commands:

1. **Deploy and verify the Contract**:
   ```sh
   bunx hardhat ignition deploy ignition/modules/App.ts --network arbitrum-sepolia
   ```

### Interacting with the Contracts

After deployment, you can interact with the contracts through the Next.js project built for this demo

## Contract Functions

### RandomSeed Contract

- requestRandomSeed(): Requests a new random seed for daily playlist generation (requires fee)
- currentSeed(): Returns the current active random seed
- getRequestFee(): Returns the fee required for making a seed request

### CoinFlip Contract

- requestRandom(): Requests a random coin flip for gameplay initialization (requires fee)
- getUserResult(address user): Returns the coin flip result for a specific user
- hasUserResult(address user): Checks if a user has a pending or completed coin flip result
- getRequestFee(): Returns the fee required for making a coin flip request

### PlaylistReputationNFT Contract

- mintPlaylist(address to, string memory playlistName, string memory playlistId): Mints a new reputation NFT for a playlist
- voteForPlaylist(uint256 tokenId): Increases reputation through community voting
- triggerDecay(uint256 tokenId): Initiates reputation decay with random intensity
- getPlaylistInfo(uint256 tokenId): Returns reputation and metadata for a playlist NFT
- tokensOfOwner(address owner): Returns all token IDs owned by an address
- unlock(uint256 tokenId): Unlocks an NFT after callback completion

## Acknowledgments

This implementation of Pyth Entropy for music and gaming applications was inspired by innovative uses of blockchain randomness. Special thanks to the Pyth network for providing verifiable entropy services and the broader Web3 community for continuous innovation.

We hope these contracts inspire further development at the intersection of music, gaming, and blockchain technology, creating new possibilities for community-driven content creation and discovery.
