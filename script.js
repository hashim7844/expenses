const expenseForm = document.getElementById('expense-form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const expensesList = document.getElementById('expenses');
const balanceDisplay = document.getElementById('balance');

// Get transactions from local storage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Function to render transactions to the DOM
function renderTransactions() {
  // Clear transactions list
  expensesList.innerHTML = '';

  let totalBalance = 0;

  // Render each transaction
  transactions.forEach((transaction, index) => {
    const transactionItem = document.createElement('div');
    transactionItem.classList.add('transaction-item');

    const sign = transaction.amount >= 0 ? '+' : '-';
    const transactionType = transaction.amount >= 0 ? 'Income' : 'Expense';
    transactionItem.innerHTML = `
      <div class="description">${transaction.text}</div>
      <div class="amount">${sign}$${Math.abs(transaction.amount)}</div>
      <div class="type">${transactionType}</div>
      <div class="date">${transaction.date}</div>
      <button class="edit-btn" onclick="editTransaction(${index})">Edit</button>
      <button class="delete-btn" onclick="deleteTransaction(${index})">Delete</button>
    `;

    totalBalance += transaction.amount;
    expensesList.appendChild(transactionItem);
  });

  balanceDisplay.textContent = totalBalance.toFixed(2);

  // Save transactions to local storage
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Function to add transaction
function addTransaction(event) {
  event.preventDefault();

  const text = textInput.value.trim();
  const amount = +amountInput.value.trim();

  if (text === '' || isNaN(amount)) {
    alert('Please provide valid transaction details');
    return;
  }

  const transaction = {
    text,
    amount,
    date: new Date().toLocaleDateString()
  };

  transactions.push(transaction);
  renderTransactions();

  // Clear form inputs
  textInput.value = '';
  amountInput.value = '';
}

// Function to edit transaction
function editTransaction(index) {
  const newText = prompt('Enter new description:', transactions[index].text);
  const newAmount = parseFloat(prompt('Enter new amount:', transactions[index].amount));

  if (newText !== null && !isNaN(newAmount)) {
    transactions[index].text = newText;
    transactions[index].amount = newAmount;
    transactions[index].date = new Date().toLocaleDateString();
    renderTransactions();
  }
}

// Function to delete transaction
function deleteTransaction(index) {
  if (confirm('Are you sure you want to delete this transaction?')) {
    transactions.splice(index, 1);
    renderTransactions();
  }
}

// Event listener for form submission
expenseForm.addEventListener('submit', addTransaction);

// Initial rendering of transactions
renderTransactions();
