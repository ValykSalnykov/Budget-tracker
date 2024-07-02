const API_BASE_URL = '/.netlify/functions';

export async function fetchBudgetItems() {
  const response = await fetch(`${API_BASE_URL}/budget-items`);
  if (!response.ok) {
    throw new Error('Не удалось получить бюджетные записи');
  }
  return response.json();
}

export async function createBudgetItem(item) {
  const response = await fetch(`${API_BASE_URL}/budget-items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    throw new Error('Не удалось создать бюджетную запись');
  }
  return response.json();
}

// Обновите остальные функции аналогичным образом

// const API_BASE_URL = 'http://localhost:5000/api';

// export async function fetchBudgetItems() {
//   const response = await fetch(`${API_BASE_URL}/budget-items`);
//   if (!response.ok) {
//     throw new Error('Не удалось получить бюджетные записи');
//   }
//   return response.json();
// }

// export async function createBudgetItem(item) {
//   const response = await fetch(`${API_BASE_URL}/budget-items`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(item),
//   });
//   if (!response.ok) {
//     throw new Error('Не удалось создать бюджетную запись');
//   }
//   return response.json();
// }

// export async function updateBudgetItem(id, item) {
//   const response = await fetch(`${API_BASE_URL}/budget-items/${id}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(item),
//   });
//   if (!response.ok) {
//     throw new Error('Не удалось обновить бюджетную запись');
//   }
//   return response.json();
// }

// export async function deleteBudgetItem(id) {
//   const response = await fetch(`${API_BASE_URL}/budget-items/${id}`, {
//     method: 'DELETE',
//   });
//   if (!response.ok) {
//     throw new Error('Не удалось удалить бюджетную запись');
//   }
//   return response.json();
// }