# Smart Contract Analyzer

A small BNB Smart Chain contract metadata viewer. It retrieves contract name, compiler version, verification status, and source code from BscScan/Etherscan API v2. It does **not** perform a vulnerability audit.

## Run locally

1. Use Node.js 20 or later.
2. Copy `.env.example` to `.env` and set your own `BSC_API_KEY`.
3. Run `npm install`.
4. Run `npm start` and open `http://localhost:3000`.

The API key is read by the Node server, not embedded in frontend JavaScript. Never commit `.env` or real credentials. If a key was committed previously, revoke/rotate it.

## Scope

- Validates EVM address format.
- Uses Etherscan API v2 with BNB Smart Chain chain ID 56.
- Displays remote contract source as plain text to avoid interpreting untrusted source as HTML.
- Does not assess vulnerabilities or provide a security score.
