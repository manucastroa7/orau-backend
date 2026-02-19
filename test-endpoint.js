async function testEndpoint() {
    console.log('Sending request to http://localhost:3000/mail/contact...');
    const start = Date.now();
    try {
        const response = await fetch('http://localhost:3000/mail/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId: 'test-id',
                productName: 'Test Product',
                userName: 'Test User',
                userEmail: 'test@example.com',
                message: 'This is a test message from debug script.'
            }),
        });

        const end = Date.now();
        console.log(`Response status: ${response.status}`);
        console.log(`Time taken: ${(end - start) / 1000} seconds`);
        const data = await response.json();
        console.log('Response body:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

testEndpoint();
