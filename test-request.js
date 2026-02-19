async function testRequest() {
    console.log('Sending request...');
    try {
        const response = await fetch('http://localhost:3000/mail/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });

        console.log('Status:', response.status);
        const text = await response.text();
        console.log('Body:', text);
    } catch (e) {
        console.error('Error:', e);
    }
}

testRequest();
