document.getElementById('create-user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
  
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
  
    const data = await response.json();
    alert('User created: ' + data.name);
  });
  
  document.getElementById('create-transaction-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('userId').value;
    const amount = document.getElementById('amount').value;
    const type = document.getElementById('type').value;
  
    const response = await fetch('http://localhost:3000/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, amount, type })
    });
  
    const data = await response.json();
    alert('Transaction created: ' + data.amount + ' (' + data.type + ')');
  });
  