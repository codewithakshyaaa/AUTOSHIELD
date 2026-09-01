# 🛡️ AutoShield: Autonomous Infrastructure Protection Powered by x402 on Algorand

> **Hackathon Track:** *Agentic Solutions: Powered by x402*  
> **Blockchain:** Algorand Testnet (Nodely Algod API)  
> **Protocol:** RFC 402 / x402-avm Standard  
> **Facilitator:** GoPlausible x402 Facilitator (`https://facilitator.goplausible.xyz`)  
> **AI Vision:** Gemini 2.5 Multimodal Infrastructure Quality Inspector  
> **Explorer Proof:** LoRA Algorand Testnet Explorer (`https://lora.algokit.io/testnet`)  

---

## 🌟 Overview

**AutoShield** is a decentralized, agentic civic infrastructure monitoring and bounty payout protocol built on **Algorand Testnet** and **x402 HTTP Payment Gateways**. 

Traditional municipal reporting suffers from weeks of bureaucratic delays, unverified claims, and manual payout processing. **AutoShield** transforms civic maintenance into an autonomous, self-governing economic loop:

1. **AI Vision Damage Radar:** Citizens or edge cameras upload photo evidence of road potholes, broken luminaires, water main bursts, or downed power lines. Multimodal **Gemini Vision** analyzes structural defect severity (0–100) and calculates dynamic escrow bounty pricing in **ALGO**.
2. **Strict HTTP 402 Autonomous Gate:** Submitting damage reports is gated by the **x402-avm protocol**. If submitted without payment headers, the server responds with a strict `HTTP 402 Payment Required` challenge containing `WWW-Authenticate: x402` and `X-402-Payment-Request` payloads.
3. **Pera Wallet & GoPlausible Facilitator:** The client intercepts the 402 challenge, prompts **Pera Wallet** or the **GoPlausible Facilitator** to sign/relay the escrow deposit on Algorand Testnet, and resubmits with `Authorization: x402 txId=...`.
4. **Agentic AI Verification & Autonomous Escrow Release:** Once civil workers repair the defect, they upload after-fix photo evidence. Gemini Vision conducts a rigorous Before vs. After restoration quality audit. If quality passes (Score $\ge$ 80), the Algorand smart escrow autonomously signs and broadcasts a release payout transaction directly to the worker's wallet with cryptographic **LoRA Explorer proof**.

---

## 🏗️ Architecture & x402 Protocol Flow

```
+---------------------------------------------------------------------------------------------+
|                                    AutoShield x402 Flow                                      |
+---------------------------------------------------------------------------------------------+

  [ Citizen / Edge Sensor ]                   [ AutoShield Express ]             [ Algorand Testnet / LoRA ]
              |                                        |                                     |
              | 1. POST /api/infrastructure/submit     |                                     |
              |    (No payment authentication)         |                                     |
              |--------------------------------------->|                                     |
              |                                        |                                     |
              | 2. HTTP 402 Payment Required           |                                     |
              |    WWW-Authenticate: x402 ...          |                                     |
              |    X-402-Payment-Request: {...}        |                                     |
              |<---------------------------------------|                                     |
              |                                        |                                     |
    [ Pera Wallet / GoPlausible ]                      |                                     |
              |                                        |                                     |
              | 3. Sign & Broadcast Escrow Deposit ALGO transaction                          |
              |----------------------------------------------------------------------------->|
              |                                        |                                     |
              | 4. Confirmed on Algorand Testnet (TxID: 2H7K4J..., Round #42890120)          |
              |<-----------------------------------------------------------------------------|
              |                                        |                                     |
              | 5. Re-POST /api/infrastructure/submit  |                                     |
              |    Authorization: x402 txId=2H7K4J...  |                                     |
              |--------------------------------------->|                                     |
              |                                        | 6. Verify On-Chain via Algod        |
              |                                        |------------------------------------>|
              |                                        |    Verified OK                      |
              |                                        |<------------------------------------|
              | 7. HTTP 200 OK (Bounty Locked)         |                                     |
              |<---------------------------------------|                                     |
              |                                                                              |
  [ Repair Worker ]                                                                          |
              | 8. Upload After-Fix Photo Proof                                              |
              |--------------------------------------->|                                     |
              |                                        | 9. Gemini AI Before/After Audit     |
              |                                        |    (Restoration Score: 94/100)      |
              |                                        |                                     |
              |                                        | 10. Autonomous Escrow Release Txn   |
              |                                        |------------------------------------>|
              |                                        |    Payout Confirmed                 |
              |<---------------------------------------|<------------------------------------|
              | 11. LoRA Proof Explorer Hash Verified                                        |
```

---

## ⚡ Key Technical Features

### 1. Pure x402 HTTP Payment Gate Implementation
* Conforms to the `x402-avm` and RFC 402 specifications.
* Express middleware intercepts unauthenticated resource requests and returns standard:
  ```http
  HTTP/1.1 402 Payment Required
  WWW-Authenticate: x402 realm="AutoShield Escrow Gate", network="algorand-testnet", address="4K7VZY...", amount="1500000", asset_id="0", facilitator="https://facilitator.goplausible.xyz"
  X-402-Payment-Request: {"challengeId":"ch_1725...","payTo":"4K7VZY...","amountMicroAlgos":1500000,"network":"algorand-testnet"}
  ```
* Intercepted client-side by custom Axios/Fetch interceptor to trigger on-chain settlement seamlessly.

### 2. Multi-Option Testnet Payment Gateway
* **Pera Wallet Connect & Deep Link:** Native QR code generation, mobile deep linking, and transaction payload preparation.
* **Instant In-Browser Testnet Keypair Generator:** 1-click testnet account generator with 25-word mnemonic export and Algorand Testnet Dispenser integration.
* **GoPlausible Facilitator Settlement:** Gasless/relayed payment execution simulation via facilitator proxy.

### 3. Agentic Gemini Multimodal AI Engine
* **Severity Diagnosis:** Inspects asphalt cavitation, wire exposure, flood volume, and barrier deformation to generate an engineering defect score (0–100).
* **Escrow Payout Valuation:** Dynamically computes fair market repair bounties in ALGO based on labor hours, materials, and hazard urgency multiplier.
* **Dual-Image Verification:** Evaluates Before vs. After images to confirm flush compaction, structural torque, and road safety clearance before unlocking smart escrow.

### 4. LoRA Algorand Testnet Explorer Integration
* Every escrow deposit, facilitator settlement, and worker payout generates a verifiable transaction hash linked directly to:
  `https://lora.algokit.io/testnet/transaction/{txId}`
* Real-time ledger records confirmed block rounds, microAlgo amounts, sender/receiver addresses, and immutable `x402:autoshield:...` transaction notes.

---

## 🚀 Live Demo & Step-by-Step Testing Guide

### Step 1: Connect or Generate an Algorand Testnet Wallet
1. Open the app and click **Connect Wallet** in the top navigation bar.
2. Choose **Pera Wallet Connect** or click **Generate Instant Testnet Keypair** to immediately receive a fresh 58-character Algorand address.
3. Testnet funds can be topped up via the official [Algorand Testnet Dispenser](https://bank.testnet.algorand.network/).

### Step 2: AI Vision Scan & Severity Assessment
1. Navigate to the **Report Defect** tab.
2. Select any hackathon demo preset (e.g. *Grade-4 Arterial Road Pothole*, *Municipal Water Main Rupture*, *Damaged LED Streetlight*) or drag-and-drop a custom photo.
3. Click **Run AI Severity Assessment & Bounty Pricing**.
4. The Gemini Vision agent will output:
   - Defect Category & Severity Score (e.g. 88/100 Critical)
   - Civil repair recommendation
   - Dynamic Escrow Bounty (e.g. `1.50 ALGO`)

### Step 3: Trigger the x402 HTTP 402 Payment Challenge
1. Click **Lock Escrow Bounty (HTTP 402 Gate)**.
2. The frontend sends an unauthenticated request to `/api/infrastructure/submit-ticket`.
3. The server rejects with **HTTP 402 Payment Required** and returns the cryptographic payment challenge.
4. The **x402 Payment Modal** intercepts the challenge and displays the required deposit breakdown, recipient escrow address, and raw HTTP 402 response headers.
5. Click **Authorize & Pay with Pera Wallet** or **Relay via GoPlausible Facilitator**.
6. The transaction confirms on Algorand Testnet, unlocks the ticket, and adds it to the community pool with a LoRA explorer link.

### Step 4: Claim Bounty & Worker Verification Loop
1. Navigate to the **Active Bounties** or **Worker Verify** tab.
2. Click **Claim & Submit Fix Verification** on an active ticket.
3. Inspect the side-by-side **Before (Hazard)** vs **After (Repaired)** comparison.
4. Select a repair proof preset (e.g. *Asphalt Flush & Compacted Seal*) or upload an after-repair photo.
5. Enter your worker payout address.
6. Click **Run AI Quality Audit & Release Escrow**.
7. Gemini compares the before/after images. Upon passing quality audit (Score $\ge$ 80), the escrow autonomously broadcasts the payout transaction on Algorand Testnet.
8. View the on-chain payout transaction hash and open the proof directly in the **LoRA Explorer**.

### Step 5: Live Testnet Ledger & Architecture Docs
1. Visit the **LoRA Explorer** tab to inspect all real-time transaction records, confirmed rounds, and note payloads.
2. Visit the **Architecture** tab to view copyable cURL commands demonstrating the raw HTTP 402 challenge/unlock flow in your terminal.

---

## 🛠️ Tech Stack & Dependencies

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti |
| **Backend** | Node.js, Express, TypeScript (`tsx`, `esbuild`) |
| **Blockchain** | `algosdk`, `@algorandfoundation/algokit-utils`, Nodely Testnet Algod API |
| **x402 Protocol** | RFC 402 Standard, GoPlausible Facilitator (`@x402-avm` architecture) |
| **AI Vision** | Google Gemini 2.5 Multimodal SDK (`@google/genai`) |
| **Explorer** | LoRA Algorand Explorer (`https://lora.algokit.io/testnet`) |

---

## 📜 License
MIT License — AutoShield Team for the **Agentic Solutions: Powered by x402** Hackathon Track.
