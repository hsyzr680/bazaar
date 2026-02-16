import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import pg from 'pg'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '.env') })
dotenv.config({ path: join(__dirname, '../.env') })
const { Pool } = pg

const app = express()
const PORT = process.env.PORT || 3000
const useDb = Boolean(process.env.DATABASE_URL)

const pool = useDb ? new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('railway') ? { rejectUnauthorized: false } : false
}) : null

async function testDatabaseConnection() {
  if (!pool) return
  const client = await pool.connect()
  try {
    await client.query('SELECT 1')
    console.log('✅ تم الاتصال بقاعدة البيانات PostgreSQL بنجاح (Railway)')
  } catch (err) {
    console.error('❌ فشل الاتصال بقاعدة البيانات:', err.message)
  } finally {
    client.release()
  }
}

async function initDb() {
  if (!pool) return
  try {
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8')
    await pool.query(schema)
  } catch (err) {
    console.error('تحذير: لم يتم تحميل schema:', err.message)
  }
}

app.use(cors())
app.use(express.json())

const clientDist = join(__dirname, '../client/dist')
const distExists = existsSync(clientDist)
if (distExists) app.use(express.static(clientDist))

app.get('/', (req, res) => {
  if (distExists) {
    res.sendFile(join(clientDist, 'index.html'))
    return
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.send(`
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head><meta charset="utf-8"><title>نور بازار</title></head>
    <body style="font-family: Arial; text-align: center; padding: 50px; background: #fef7ee;">
      <h1>🛒 نور بازار</h1>
      <p>المتجر يعمل على الواجهة. افتح الرابط:</p>
      <p><a href="http://localhost:5173" style="font-size: 1.2em; color: #ed751f;">http://localhost:5173</a></p>
    </body>
    </html>
  `)
})

const dataPath = join(__dirname, 'data.json')

const defaultProducts = [
  { id: '1', name: 'سماعات لاسلكية بلوتوث', price: 89.99, description: 'سماعات رأس مريحة مع إلغاء ضوضاء وجودة صوت استثنائية.', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', category: 'electronics' },
  { id: '2', name: 'ساعة ذكية رياضية', price: 149.00, description: 'ساعة ذكية مع قياس معدل ضربات القلب والنوم. مقاومة للماء.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', category: 'electronics' },
  { id: '3', name: 'تيشيرت قطن بيضاء', price: 19.99, description: 'تيشيرت قطن 100% مريح للارتداء اليومي.', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', category: 'clothes' },
  { id: '4', name: 'عطر رجالي كلاسيكي', price: 69.99, description: 'عطر خشبي فاخر برائحة دافئة ومميزة. يدوم طوال اليوم.', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', category: 'perfumes' }
]

function getData() {
  if (!existsSync(dataPath)) {
    const initial = { products: [...defaultProducts], orders: [] }
    writeFileSync(dataPath, JSON.stringify(initial, null, 2))
    return initial
  }
  const data = JSON.parse(readFileSync(dataPath, 'utf-8'))
  if (!data.products || data.products.length === 0) {
    data.products = [...defaultProducts]
    data.orders = data.orders || []
    writeFileSync(dataPath, JSON.stringify(data, null, 2))
  }
  return data
}

function saveData(data) {
  writeFileSync(dataPath, JSON.stringify(data, null, 2))
}

function rowToProduct(row) {
  return {
    id: String(row.id),
    name: row.name,
    description: row.description || '',
    price: parseFloat(row.price),
    image: row.image || '',
    category: row.category || ''
  }
}

// API: Products
app.get('/api/products', async (req, res) => {
  const { limit, category } = req.query
  try {
    if (pool) {
      let query = 'SELECT id, name, description, price, image, category FROM products ORDER BY id'
      const params = []
      if (category) {
        params.push(category)
        query = 'SELECT id, name, description, price, image, category FROM products WHERE category = $1 ORDER BY id'
      }
      const { rows } = await pool.query(query, params)
      let products = rows.map(rowToProduct)
      if (limit) products = products.slice(0, parseInt(limit))
      return res.json(products)
    }
    let products = getData().products
    if (category) products = products.filter(p => p.category === category)
    if (limit) products = products.slice(0, parseInt(limit))
    res.json(products)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/products/categories', async (req, res) => {
  try {
    if (pool) {
      const { rows } = await pool.query('SELECT DISTINCT category FROM products ORDER BY category')
      return res.json(rows.map(r => r.category))
    }
    const products = getData().products
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))]
    res.json(cats.sort())
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/products/:id', async (req, res) => {
  try {
    if (pool) {
      const { rows } = await pool.query(
        'SELECT id, name, description, price, image, category FROM products WHERE id = $1',
        [req.params.id]
      )
      if (rows.length === 0) return res.status(404).json({ error: 'Not found' })
      return res.json(rowToProduct(rows[0]))
    }
    const product = getData().products.find(p => p.id === req.params.id)
    if (!product) return res.status(404).json({ error: 'Not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/products', async (req, res) => {
  try {
    if (pool) {
      const { name, description, price, image, category } = req.body
      const { rows } = await pool.query(
        `INSERT INTO products (name, description, price, image, category) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, description, price, image, category`,
        [name || 'منتج', description || '', parseFloat(price) || 0, image || '', category || 'electronics']
      )
      return res.status(201).json(rowToProduct(rows[0]))
    }
    const data = getData()
    const newProduct = {
      id: String(Date.now()),
      name: req.body.name || 'منتج',
      price: parseFloat(req.body.price) || 0,
      description: req.body.description || '',
      image: req.body.image || '',
      category: req.body.category || 'electronics'
    }
    data.products.push(newProduct)
    saveData(data)
    res.status(201).json(newProduct)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/products/:id', async (req, res) => {
  try {
    if (pool) {
      const { name, description, price, image, category } = req.body
      const { rows } = await pool.query(
        `UPDATE products SET name=COALESCE($2,name), description=COALESCE($3,description), price=COALESCE($4,price), image=COALESCE($5,image), category=COALESCE($6,category) WHERE id=$1 RETURNING id, name, description, price, image, category`,
        [req.params.id, name, description, price, image, category]
      )
      if (rows.length === 0) return res.status(404).json({ error: 'Not found' })
      return res.json(rowToProduct(rows[0]))
    }
    const data = getData()
    const idx = data.products.findIndex(p => p.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Not found' })
    data.products[idx] = { ...data.products[idx], ...req.body }
    saveData(data)
    res.json(data.products[idx])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/products/:id', async (req, res) => {
  try {
    if (pool) {
      const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [req.params.id])
      if (rowCount === 0) return res.status(404).json({ error: 'Not found' })
      return res.json({ ok: true })
    }
    const data = getData()
    data.products = data.products.filter(p => p.id !== req.params.id)
    saveData(data)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// API: Orders
app.get('/api/orders', async (req, res) => {
  try {
    if (pool) {
      const { rows } = await pool.query('SELECT * FROM orders ORDER BY created_at DESC')
      res.json(rows)
      return
    }
    res.json(getData().orders)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/orders', async (req, res) => {
  try {
    if (pool) {
      const { name, phone, address, payment, items, total } = req.body
      const { rows } = await pool.query(
        `INSERT INTO orders (name, phone, address, payment, items, total) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [name, phone, address, payment || 'cash', JSON.stringify(items || []), parseFloat(total) || 0]
      )
      return res.status(201).json(rows[0])
    }
    const data = getData()
    const order = { id: String(Date.now()), ...req.body, createdAt: new Date().toISOString() }
    data.orders.push(order)
    saveData(data)
    res.status(201).json(order)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, async () => {
  await initDb()
  console.log(`🛒 نور بازار - السيرفر يعمل على http://localhost:${PORT}`)
  if (!useDb) {
    console.log('💡 بدون DATABASE_URL: المنتجات من ملف data.json. لإضافة 75 منتج استخدم PostgreSQL ثم نفّذ: npm run seed')
  }
  await testDatabaseConnection()
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ المنفذ ${PORT} مستخدم.`)
  } else console.error(err)
  process.exit(1)
})

export { pool }
