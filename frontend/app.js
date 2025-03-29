async function analyzeContract() {
    const contractAddress = document.getElementById('contractAddress').value;
    if (!contractAddress) {
        alert('Please enter a contract address');
        return;
    }
    
    document.getElementById('result').innerHTML = 'Analyzing...';
    
    try {
        const response = await fetch(`https://api.bscscan.com/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=YourBscScanAPIKey`);
        const data = await response.json();
        
        if (data.status === '1' && data.result.length > 0) {
            const contractCode = data.result[0].SourceCode || 'No source code available';
            document.getElementById('result').innerHTML = `<pre>${contractCode}</pre>`;
        } else {
            document.getElementById('result').innerHTML = 'No contract found or unable to fetch data';
        }
    } catch (error) {
        document.getElementById('result').innerHTML = 'Error fetching contract details';
        console.error(error);
    }
}
