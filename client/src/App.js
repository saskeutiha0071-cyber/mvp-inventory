import React, { useEffect, useState } from 'react';
import { getItems } from './items';

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getItems().then(setItems).catch(console.error);
  }, []);

  return (
    <div>
      <h1>MVP Inventory</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name} — {item.quantity}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
