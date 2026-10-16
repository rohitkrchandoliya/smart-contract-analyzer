const ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;
const resultElement = document.getElementById('result');

async function analyzeContract() {
    const contractAddress = document.getElementById('contractAddress').value.trim();

    if (!ADDRESS_PATTERN.test(contractAddress)) {
        resultElement.textContent = 'Enter a valid 42-character EVM contract address (0x followed by 40 hexadecimal characters).';
        return;
    }

    // This frontend-only project must be configured with a real BscScan API key.
    // Do not put a private server-side key in a public frontend bundle.
    const apiKey = window.BSCSCAN_API_KEY;
    if (typeof apiKey !== 'string' || !apiKey.trim() || apiKey === 'YourBscScanAPIKey') {
        resultElement.textContent = 'BscScan API is not configured. Set BSCSCAN_API_KEY in a trusted backend proxy before using this scanner.';
        return;
    }

    resultElement.textContent = 'Analyzing…';

    try {
        const params = new URLSearchParams({
            module: 'contract',
            action: 'getsourcecode',
            address: contractAddress,
            apikey: apiKey
        });
        const response = await fetch('https://api.bscscan.com/api?' + params.toString());

        if (!response.ok) {
            throw new Error('BscScan returned HTTP ' + response.status + '.');
        }

        const data = await response.json();
        if (data.status === '1' && Array.isArray(data.result) && data.result.length > 0) {
            const contractCode = data.result[0].SourceCode;
            resultElement.replaceChildren();

            if (!contractCode) {
                resultElement.textContent = 'The address was found, but verified source code is not available.';
                return;
            }

            const heading = document.createElement('p');
            heading.textContent = 'Verified source code:';
            const pre = document.createElement('pre');
            // Contract source is untrusted remote content. Never interpret it as HTML.
            pre.textContent = contractCode;
            resultElement.append(heading, pre);
        } else {
            resultElement.textContent = data.message || 'No verified source code found for this address.';
        }
    } catch (error) {
        resultElement.textContent = error instanceof Error
            ? 'Could not fetch contract details: ' + error.message
            : 'Could not fetch contract details. Please try again.';
        console.error(error);
    }
}
