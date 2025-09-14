import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Наш клиент для Supabase
import './App.css'; // Стили

function App() {
  // --- Состояния компонента (State) ---
  const [items, setItems] = useState([]); // Состояние для хранения списка записей
  const [loading, setLoading] = useState(true); // Состояние для отслеживания загрузки
  
  // Состояние для новой записи, соответствует структуре таблицы
  const initialFormState = { name: '', category: '', quantity: 0, price: '', status: 'active' };
  const [newItem, setNewItem] = useState(initialFormState);
  
  // Состояние для редактируемой записи
  const [editingItem, setEditingItem] = useState(null); // Хранит весь объект для редактирования

  // --- CRUD Операции ---

  // 1. Чтение данных (Read)
  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('items') // УКАЖИ ИМЯ СВОЕЙ ТАБЛИЦЫ
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data);
    } catch (error) {
      alert('Ошибка при загрузке данных: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  // Обработчик изменений в полях формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };
  
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingItem({ ...editingItem, [name]: value });
  }

  // 2. Создание данных (Create)
  async function addItem(e) {
    e.preventDefault();
    if (!newItem.name) return alert("Поле 'Название' обязательно для заполнения.");

    try {
      const { data, error } = await supabase
        .from('items') // УКАЖИ ИМЯ СВОЕЙ ТАБЛИЦЫ
        .insert([newItem])
        .select()
        .single();

      if (error) throw error;
      setItems([data, ...items]);
      setNewItem(initialFormState); // Сбрасываем форму
    } catch (error) {
      alert('Ошибка при добавлении записи: ' + error.message);
    }
  }
  
  // 3. Обновление данных (Update)
  async function updateItem(e) {
    e.preventDefault();
    
    try {
      // Исключаем системные поля из объекта для обновления
      const { id, created_at, updated_at, ...updateData } = editingItem;

      const { data, error } = await supabase
        .from('items') // УКАЖИ ИМЯ СВОЕЙ ТАБЛИЦЫ
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setItems(items.map(item => (item.id === id ? data : item)));
      setEditingItem(null); // Выходим из режима редактирования

    } catch (error) {
      alert('Ошибка при обновлении записи: ' + error.message);
    }
  }


  // 4. Удаление данных (Delete)
  async function deleteItem(id) {
    if (!window.confirm("Вы уверены, что хотите удалить эту запись?")) return;

    try {
      const { error } = await supabase
        .from('items') // УКАЖИ ИМЯ СВОЕЙ ТАБЛИЦЫ
        .delete()
        .eq('id', id);

      if (error) throw error;
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      alert('Ошибка при удалении записи: ' + error.message);
    }
  }

  // --- Отображение (Render) ---
  return (
    <div className="container">
      <header>
        <h1>Складской учет</h1>
        <p>Управление данными в Supabase через React</p>
      </header>

      <main>
        {/* Форма для редактирования, появляется вместо формы добавления */}
        {editingItem ? (
           <form className="add-form editing" onSubmit={updateItem}>
             <h2>Редактирование записи ID: {editingItem.id}</h2>
             <div className="form-grid">
                <input type="text" name="name" placeholder="Название" value={editingItem.name} onChange={handleEditInputChange} required />
                <input type="text" name="category" placeholder="Категория" value={editingItem.category} onChange={handleEditInputChange} />
                <input type="number" name="quantity" placeholder="Количество" value={editingItem.quantity} onChange={handleEditInputChange} />
                <input type="number" step="0.01" name="price" placeholder="Цена" value={editingItem.price} onChange={handleEditInputChange} />
                <select name="status" value={editingItem.status} onChange={handleEditInputChange}>
                    <option value="active">Активен</option>
                    <option value="inactive">Неактивен</option>
                    <option value="archived">В архиве</option>
                </select>
             </div>
             <div className="form-actions">
                <button type="submit">Сохранить</button>
                <button type="button" className="cancel-btn" onClick={() => setEditingItem(null)}>Отмена</button>
             </div>
           </form>
        ) : (
          <form className="add-form" onSubmit={addItem}>
            <h2>Добавить новый товар</h2>
            <div className="form-grid">
              <input type="text" name="name" placeholder="Название" value={newItem.name} onChange={handleInputChange} required />
              <input type="text" name="category" placeholder="Категория" value={newItem.category} onChange={handleInputChange} />
              <input type="number" name="quantity" placeholder="Количество" value={newItem.quantity} onChange={handleInputChange} />
              <input type="number" step="0.01" name="price" placeholder="Цена" value={newItem.price} onChange={handleInputChange} />
              <select name="status" value={newItem.status} onChange={handleInputChange}>
                <option value="active">Активен</option>
                <option value="inactive">Неактивен</option>
                <option value="archived">В архиве</option>
              </select>
            </div>
            <button type="submit">Добавить товар</button>
          </form>
        )}
        
        <div className="items-container">
          <h2>Список товаров</h2>
          {loading ? (
            <p>Загрузка...</p>
          ) : (
            <div className="item-list">
              {items.map(item => (
                <div key={item.id} className="item-card">
                  <div className="item-details">
                    <span className={`status-badge status-${item.status}`}>{item.status}</span>
                    <h3>{item.name}</h3>
                    <p><strong>Категория:</strong> {item.category || 'N/A'}</p>
                    <p><strong>Количество:</strong> {item.quantity}</p>
                    <p><strong>Цена:</strong> {item.price ? `${parseFloat(item.price).toFixed(2)} ₽` : 'N/A'}</p>
                    <small>Добавлено: {new Date(item.created_at).toLocaleDateString()}</small>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => setEditingItem(item)}>Изменить</button>
                    <button className="delete-btn" onClick={() => deleteItem(item.id)}>Удалить</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
