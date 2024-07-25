const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 8000;

app.use(express.json());

const HASURA_GRAPHQL_ENDPOINT = process.env.HASURA_GRAPHQL_ENDPOINT;
const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET;

const hasuraRequest = async (query, variables) => {
  try {
    const response = await axios.post(HASURA_GRAPHQL_ENDPOINT, {
      query,
      variables,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

app.post('/deposit', async (req, res) => {
  const { userId, amount } = req.body;

  const updateBalanceQuery = `
    mutation updateBalance($userId: Int!, $amount: Float!) {
      update_users_by_pk(pk_columns: {id: $userId}, _inc: {balance: $amount}) {
        id
        balance
      }
    }
  `;

  const createTransactionQuery = `
    mutation createTransaction($userId: Int!, $amount: Float!) {
      insert_transactions_one(object: {user_id: $userId, type: "deposit", amount: $amount}) {
        id
      }
    }
  `;

  try {
    await hasuraRequest(updateBalanceQuery, { userId, amount });
    await hasuraRequest(createTransactionQuery, { userId, amount });

    res.status(200).send('Deposit successful');
  } catch (error) {
    res.status(500).send('Error processing deposit');
  }
});

app.post('/withdraw', async (req, res) => {
  const { userId, amount } = req.body;

  const getUserBalanceQuery = `
    query getUserBalance($userId: Int!) {
      users_by_pk(id: $userId) {
        balance
      }
    }
  `;

  const updateBalanceQuery = `
    mutation updateBalance($userId: Int!, $amount: Float!) {
      update_users_by_pk(pk_columns: {id: $userId}, _inc: {balance: $amount}) {
        id
        balance
      }
    }
  `;

  const createTransactionQuery = `
    mutation createTransaction($userId: Int!, $amount: Float!) {
      insert_transactions_one(object: {user_id: $userId, type: "withdrawal", amount: $amount}) {
        id
      }
    }
  `;

  try {
    const userResponse = await hasuraRequest(getUserBalanceQuery, { userId });
    const balance = userResponse.data.users_by_pk.balance;

    if (balance < amount) {
      return res.status(400).send('Insufficient balance');
    }

    await hasuraRequest(updateBalanceQuery, { userId, amount: -amount });
    await hasuraRequest(createTransactionQuery, { userId, amount });

    res.status(200).send('Withdrawal successful');
  } catch (error) {
    res.status(500).send('Error processing withdrawal');
  }
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
