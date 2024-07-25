const API_URL = 'http://localhost:3000';

async function deposit() {
  const userId = document.getElementById('userId').value;
  const amount = document.getElementById('amount').value;
  const responseDiv = document.getElementById('response');

  try {
    const response = await fetch(`${API_URL}/deposit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: parseInt(userId), amount: parseFloat(amount) }),
    });

    const data = await response.text();
    responseDiv.innerHTML = `Response: ${data}`;
  } catch (error) {
    responseDiv.innerHTML = `Error: ${error.message}`;
  }
}

async function withdraw() {
  const userId = document.getElementById('userId').value;
  const amount = document.getElementById('amount').value;
  const responseDiv = document.getElementById('response');

  try {
    const response = await fetch(`${API_URL}/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: parseInt(userId), amount: parseFloat(amount) }),
    });

    const data = await response.text();
    responseDiv.innerHTML = `Response: ${data}`;
  } catch (error) {
    responseDiv.innerHTML = `Error: ${error.message}`;
  }
}
