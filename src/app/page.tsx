'use client';

import { useState, useEffect } from 'react';

interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
  createdAt: string;
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных
  useEffect(() => {
    async function fetchExpenses() {
      try {
        const response = await fetch('/api/expenses');
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const data = await response.json();
        // Проверяем, является ли data массивом
        if (!Array.isArray(data)) {
          throw new Error('Данные не являются массивом');
        }
        setExpenses(data);
      } catch (err: any) {
        setError(err.message || 'Не удалось загрузить данные');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchExpenses();
  }, []);

  // Обработка отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, amount: parseFloat(amount) }),
      });
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      const newExpense = await response.json();
      setExpenses([...expenses, newExpense]);
      setDescription('');
      setAmount('');
    } catch (err: any) {
      setError(err.message || 'Не удалось добавить запись');
      console.error('Submit error:', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Учёт расходов</h1>

      {/* Форма */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label className="block text-sm font-medium">Описание</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Сумма</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 w-full"
            required
            step="0.01"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Добавить
        </button>
      </form>

      {/* Ошибка */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Таблица */}
      {loading ? (
        <p>Загрузка...</p>
      ) : expenses.length === 0 ? (
        <p>Нет данных</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2">Описание</th>
              <th className="border p-2">Сумма</th>
              <th className="border p-2">Дата</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td className="border p-2">{expense.description}</td>
                <td className="border p-2">{expense.amount}</td>
                <td className="border p-2">{new Date(expense.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
