import { query } from './db.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { q, category, minQty, page = 1, perPage = 20, sort = 'created_at', order = 'desc' } = req.query;
      const offset = (page - 1) * perPage;

      const whereClauses = [];
      const params = [];
      let idx = 1;

      if (q) {
        whereClauses.push(`lower(name) LIKE '%' || lower($${idx++}) || '%'`);
        params.push(q);
      }
      if (category) {
        whereClauses.push(`category = $${idx++}`);
        params.push(category);
      }
      if (minQty) {
        whereClauses.push(`quantity >= $${idx++}`);
        params.push(minQty);
      }

      const where = whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : '';

      const allowedSort = ['created_at','price','name','quantity'];
      const sortField = allowedSort.includes(sort) ? sort : 'created_at';
      const orderDir = order && order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

      const sql = `
        SELECT * FROM items
        ${where}
        ORDER BY ${sortField} ${orderDir}
        LIMIT $${idx++} OFFSET $${idx++}
      `;

      params.push(perPage);
      params.push(offset);

      const { rows } = await query(sql, params);
      res.status(200).json({ data: rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  }
  else if (req.method === 'POST') {
    try {
      const { name, category, quantity = 0, price = null, status = 'active' } = req.body;
      const { rows } = await query(
        `INSERT INTO items (name, category, quantity, price, status) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [name, category, quantity, price, status]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  }
  else {
    res.setHeader('Allow', ['GET','POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
