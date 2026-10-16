require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const BSC_API_KEY = process.env.BSC_API_KEY || "";
const ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;

app.use(express.static(path.join(__dirname, "frontend")));

app.get("/api/contract-source", async (req, res) => {
    const address = typeof req.query.address === "string" ? req.query.address.trim() : "";
    if (!ADDRESS_PATTERN.test(address)) {
        return res.status(400).json({ error: "Invalid EVM contract address." });
    }
    if (!BSC_API_KEY) {
        return res.status(503).json({ error: "BscScan API is not configured on the server." });
    }

    try {
        const params = new URLSearchParams({
            chainid: "56",
            module: "contract",
            action: "getsourcecode",
            address,
            apikey: BSC_API_KEY
        });
        const response = await fetch("https://api.etherscan.io/v2/api?" + params.toString(), {
            signal: AbortSignal.timeout(15000)
        });
        if (!response.ok) throw new Error("BscScan returned HTTP " + response.status);
        const data = await response.json();
        if (data.status !== "1" || !Array.isArray(data.result) || !data.result[0]) {
            return res.status(404).json({ error: data.message || "No contract metadata found." });
        }

        const contract = data.result[0];
        const sourceCode = typeof contract.SourceCode === "string" ? contract.SourceCode : "";
        return res.json({
            contractName: contract.ContractName || "Unknown",
            compilerVersion: contract.CompilerVersion || "Unknown",
            verified: sourceCode.trim().length > 0,
            sourceCode
        });
    } catch (error) {
        console.error("BscScan request failed:", error.message);
        return res.status(502).json({ error: "Could not fetch contract metadata. Please try again." });
    }
});

app.listen(PORT, () => console.log("Smart Contract Analyzer listening on port " + PORT));
