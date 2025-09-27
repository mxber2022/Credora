# Proving PDFs in ZKP

This repository contains tools for verifying PDF documents within zero-knowledge proof systems.
Learn more in this blog post: https://pse.dev/blog/zkpdf-unlocking-verifiable-data

## Why?

Sometimes you need to prove that:

- A PDF is **signed by a trusted authority**
- A specific **text appears on a given page** without revealing the entire document.

This repo enables such proving capability using SP1-based circuits.

## Structure

- **pdf-utils/** – Rust crates for:
  - Validating PKCS#7 signatures (RSA-SHA256)
  - Extracting Unicode text from PDF streams
- **circuits/** – SP1-compatible zero-knowledge circuits for signature and text proofs
- **app/** – Minimal React frontend to demo proof generation and verification

## How it Works

1. **Parse the PDF** using pure Rust (no OpenSSL or C deps)
2. **Generate a zk proof** using SP1 circuits
3. **Verify** the proof on-chain or off-chain

## Setup

Follow these steps to run the prover API and the demo frontend.

### Requirements

- [Rust](https://rustup.rs/)
- [SP1](https://docs.succinct.xyz/docs/sp1/getting-started/install)

### 1. Clone the Repository

```bash
git clone git@github.com:privacy-scaling-explorations/zkpdf
cd zkpdf
```

### 2. Run the Prover API

Start the prover service from the `circuits/script` directory. If you have access to the Succinct Prover Network, export your API key and run:

```bash
cd circuits/script
SP1_PROVER=network \
NETWORK_PRIVATE_KEY=<PROVER_NETWORK_KEY> \
RUST_LOG=info \
cargo run --release --bin prover
```

This will start the prover API on port **3001**.

> **Note:** If you don’t have access to the Succinct Prover Network, you can omit the environment variables to run the prover locally. (This will take longer.)
>
> For local proof generation, refer to `scripts/evm.rs` or run:

```bash
RUST_LOG=info cargo run --release --bin evm -- --system groth16
```

### 3. Run the Frontend

In a separate terminal, start the Next.js app:

```bash
cd app
yarn install
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the interface.



https://github.com/user-attachments/assets/2c369a52-1d2c-4487-b47d-bcb7e6ff2fec





## Use Cases

- Prove that a document is signed without showing its contents
- Selectively reveal fields from government-issued certificates
- Use verified document facts in smart contracts




curl -X POST "https://relayer-api.horizenlabs.io/api/v1/submit-proof/apikey" \
  -H "Content-Type: application/json" \
  -d '{
    "proofType": "sp1",
    "vkRegistered": false,
    "chainId": 845320009,
    "proofData": {
      "proof": "0xa4594c590684553c50ec703d77871b614f4de5c0189b290f5495bf310c12f8739d7a8cda010623372d89338af4466d1e13e3c5716874235e48e79ee246f6db5adc8cdb6f2033cd1361f1e3893b8824b588232276866bccd74dcd772142666b358cbefe7a0a0405c88fcf6c1fc26ee8ad8739b7660b01e23c5969b7890e5c1d4d3315e38312d0119e7047b5f301eeb29d1eac84d2f62d6d0a88ed2bb5bf8a08964149baa00a5737be42139a679fb07b33eb97d04e21dbe3b90cf4f1f6ee5e44dc81c7590c09f09574842fea346f73ba7c8012c95c1c0557f57f9343bbbed9529ec3c9a60b1dd9752afc99e05fe00b7a37bfb97d1bece21837f5c4577548e5ac88cd1f1001",
      "publicValues": "0x0000000000000000000000000000000000000000000000000000000000000001",
      "vk": "0x00961d64a0d9340a9f8dc7e72279e866078fc012b263bb23dd1ae417e8346161"
    }
  }'

