const ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;
const resultElement = document.getElementById('result');

async function analyzeContract() {
    const contractAddress = document.getElementById('contractAddress').value.trim();

    if (!ADDRESS_PATTERN.test(contractAddress)) {
        resultElement.textContent = 'Enter a valid 42-character EVM contract address (0x followed by 40 hexadecimal characters).';
        return;
    }

    resultElement.textContent = 'Analyzing…';
    try {
        const response = await fetch('/api/contract-source?address=' + encodeURIComponent(contractAddress), {
            signal: AbortSignal.timeout(20000)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Could not fetch contract details.');

        resultElement.replaceChildren();
        const summary = document.createElement('p');
        summary.textContent = 'Contract: ' + (data.contractName || 'Unknown') +
            ' · Compiler: ' + (data.compilerVersion || 'Unknown') +
            ' · Verified source: ' + (data.verified ? 'Yes' : 'No');
        resultElement.appendChild(summary);

        if (data.sourceCode) {
            const pre = document.createElement('pre');
            // Contract source is untrusted remote content. Render it as text, never HTML.
            pre.textContent = data.sourceCode;
            resultElement.appendChild(pre);
        } else {
            const note = document.createElement('p');
            note.textContent = 'Verified source code is not available for this address.';
            resultElement.appendChild(note);
        }
    } catch (error) {
        resultElement.textContent = error instanceof Error
            ? 'Could not fetch contract details: ' + error.message
            : 'Could not fetch contract details. Please try again.';
    }
}
