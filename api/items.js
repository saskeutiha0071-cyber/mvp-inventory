import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { q, category, minQty, page = 1, perPage = 20, sort = 'created_at', order = 'desc' } = req.query
      const from = (page - 1) * perPage
      const to = from + perPage - 1

      let query = supabase.from('items').select('*', { count: 'exact' })

      if (q) query = query.ilike('name', `%${q}%`)
      if (category) query = query.eq('category', category)
      if (minQty) query = query.gte('quantity', minQty)

      const allowedSort = ['created_at','price','name','quantity']
      const sortField = allowedSort.includes(sort) ? sort : 'created_at'
      const orderDir = order.toLowerCase() === 'asc' ? { ascending: true } : { ascending: false }

      query = query.order(sortField, orderDir).range(from, to)

      const { data, error } = await query

      if (error) throw error
      res.status(200).json({ data })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'server error' })
    }
  }

  else if (req.method === 'POST') {
    try {
      const { name, category, quantity = 0, price = null, status = 'active' } = req.body
      const { data, error } = await supabase
        .from('items')
        .insert([{ name, category, quantity, price, status }])
        .select()

      if (error) throw error
      res.status(201).json(data[0])
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'server error' })
    }
  }

  else {
    res.setHeader('Allow', ['GET','POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
