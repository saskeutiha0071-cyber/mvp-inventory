'use client';
import { useState, useEffect } from 'react';

interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    fetch('/api/expenses')
      .then(res => res.json())
      .then(setExpenses)
      .catch(console.error);
  }, []);

  const addExpense = async () => {
    await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, amount }),
    });
    window.location.reload(); // Обновить список
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Учёт расходов</h1>
      <form onSubmit={(e) => { e.preventDefault(); addExpense(); }} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <input
          type="number"
          placeholder="Сумма"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border p-2 rounded w-32"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Добавить</button>
      </form>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Описание</th>
            <th className="border p-2">Сумма</th>
            <th className="border p-2">Дата</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(exp => (
            <tr key={exp.id} className="border">
              <td className="p-2">{exp.description}</td>
              <td className="p-2">{exp.amount}</td>
              <td className="p-2">{new Date(exp.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}