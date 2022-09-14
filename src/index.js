const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

// Middleware
function verifyIfExistsAccountCPF(req, res, next) {
  const { cpf } = req.headers;
  const customer = customers.find(customer => customer.cpf === cpf)

  if(!customer) {
    return res.status(400).json({ error: 'Customer not Found!'});
  }

  req.customer = customer;

  return next();
}

const customers = [];

/**
 * Create Account
 * CPF - string
 * name - string
 * id - uuid
 * statement (todos os lançamentos da conta) - array
 */
app.post('/account', (req, res) => {
  const {name, cpf } = req.body;

  const customerAlreadyExists = customers.some(customer => customer.cpf === cpf);

  if(customerAlreadyExists) {
    return res.status(400).json({ error: 'Customer already exists!'});
  }

  customers.push({
    name,
    cpf,
    id: uuidv4(),
    statement: []
  });

  return res.status(201).send(`Sua conta foi criada ${name}!`);
})

// Search Statement
app.get('/statement/', verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;

  return res.json(customer.statement);
});

// Make Deposit
app.post('/deposit', verifyIfExistsAccountCPF, (req, res) => {
  const { description, amount } = req.body;
  const { customer } = req;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: 'deposit'
  }

  customer.statement.push(statementOperation);

  return res.status(201).send('Depósito realizado!');
})

app.listen(3333)