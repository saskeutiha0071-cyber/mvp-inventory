import { query } from '../db.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const { rows } = await query('SELECT * FROM items WHERE id=$1', [id]);
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      res.status(200).json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  }
  else if (req.method === 'PUT') {
    try {
      const { name, category, quantity, price, status } = req.body;
      const { rows } = await query(
        `UPDATE items SET name=$1, category=$2, quantity=$3, price=$4, status=$5, updated_at=now() WHERE id=$6 RETURNING *`,
        [name, category, quantity, price, status, id]
      );
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      res.status(200).json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  }
  else if (req.method === 'DELETE') {
    try {
      await query('DELETE FROM items WHERE id=$1', [id]);
      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  }
  else {
    res.setHeader('Allow', ['GET','PUT','DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
