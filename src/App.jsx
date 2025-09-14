import { useState, useEffect } from 'react'
import { supabase } from './supabase'

function App() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', category: '', quantity: 0, price: 0, status: 'active' })
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)

  // Загрузка данных
  useEffect(() => {
    fetchItems()
    // Realtime подписка
    const subscription = suapabase
      .channel('items')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, () => fetchItems())
      .subscribe()
    return () => supabase.removeChannel(subscription)
  }, [])

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error(error)
    else setItems(data || [])
  }

  // Создание/Обновление
  const saveItem = async () => {
    if (!form.name) return alert('Название обязательно')
    setLoading(true)
    const payload = { ...form, updated_at: new Date().toISOString() }
    const { error } = editingId
      ? await supabase.from('items').update(payload).eq('id', editingId)
      : await supabase.from('items').insert(payload)
    if (error) console.error(error)
    else {
      setForm({ name: '', category: '', quantity: 0, price: 0, status: 'active' })
      setEditingId(null)
      fetchItems()
    }
    setLoading(false)
  }

  // Редактирование
  const editItem = (item) => {
    setForm({ name: item.name, category: item.category || '', quantity: item.quantity, price: item.price || 0, status: item.status })
    setEditingId(item.id)
  }

  // Удаление
  const deleteItem = async (id) => {
    if (!confirm('Удалить элемент?')) return
    const { error } = await supabase.from('items').delete().eq('id', id)
    if (error) console.error(error)
    fetchItems()
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Учёт товаров</h1>
      <div style={{ marginBottom: '16px', padding: '16px', border: '1px solid #ddd', borderRadius: '4px' }}>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Название"
          style={{ padding: '8px', marginRight: '8px', border: '1px solid #ddd' }}
        />
        <input
          type="text"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          placeholder="Категория"
          style={{ padding: '8px', marginRight: '8px', border: '1px solid #ddd' }}
        />
        <input
          type="number"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })}
          placeholder="Количество"
          style={{ padding: '8px', marginRight: '8px', border: '1px solid #ddd', width: '80px' }}
        />
        <input
          type="number"
          step="0.01"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
          placeholder="Цена"
          style={{ padding: '8px', marginRight: '8px', border: '1px solid #ddd', width: '80px' }}
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          style={{ padding: '8px', marginRight: '8px', border: '1px solid #ddd' }}
        >
          <option value="active">Активен</option>
          <option value="inactive">Неактивен</option>
        </select>
        <button
          onClick={saveItem}
          disabled={loading}
          style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '4px' }}
        >
          {editingId ? 'Обновить' : 'Добавить'}
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Название</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Категория</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Количество</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Цена</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Статус</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.category || '-'}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.quantity}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.price ? `$${item.price.toFixed(2)}` : '-'}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.status}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button
                  onClick={() => editItem(item)}
                  style={{ padding: '4px 8px', backgroundColor: '#f59e0b', color: 'white', marginRight: '8px', borderRadius: '4px' }}
                >
                  Редактировать
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  style={{ padding: '4px 8px', backgroundColor: '#ef4444', color: 'white', borderRadius: '4px' }}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
