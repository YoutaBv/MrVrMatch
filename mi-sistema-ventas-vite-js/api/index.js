import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import { createMockRouter } from './mock-data.js';

dotenv.config();

const app = express();
const port = Number(process.env.API_PORT || 4000);
const useMockData = process.env.USE_MOCK_DATA === 'true' ||
  (!process.env.VERCEL && process.env.USE_MOCK_DATA !== 'false');

app.use(cors());
app.use(express.json());

if (useMockData) {
  app.use('/api', createMockRouter());
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bd_ventas',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: process.env.DB_NAME || 'bd_ventas' });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'No se pudo conectar a la base de datos.',
      detail: error.message,
    });
  }
});

app.post('/api/login', async (req, res) => {
  const { user, pass } = req.body || {};

  if (!user || !pass) {
    return res.status(400).json({ message: 'Usuario y contraseña requeridos.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT IdEmpleado, Dni, Nombres, Telefono, Estado, User FROM empleado WHERE User = ? AND Dni = ?',
      [user, pass]
    );

    if (!rows.length) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const empleado = rows[0];
    return res.json({
      success: true,
      user: {
        id: empleado.IdEmpleado,
        dni: empleado.Dni,
        nombres: empleado.Nombres,
        telefono: empleado.Telefono,
        estado: empleado.Estado,
        user: empleado.User,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al iniciar sesión.', detail: error.message });
  }
});

app.get('/api/empleados', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM empleado ORDER BY IdEmpleado DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar empleados.', detail: error.message });
  }
});

app.post('/api/empleados', async (req, res) => {
  const { dni, nombres, telefono, estado = '1', user } = req.body || {};

  if (!dni || !nombres || !telefono || !user) {
    return res.status(400).json({ message: 'Faltan datos obligatorios.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO empleado (Dni, Nombres, Telefono, Estado, User) VALUES (?, ?, ?, ?, ?)',
      [dni, nombres, telefono, estado, user]
    );

    res.status(201).json({ id: result.insertId, message: 'Empleado registrado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear empleado.', detail: error.message });
  }
});

app.put('/api/empleados/:id', async (req, res) => {
  const { id } = req.params;
  const { dni, nombres, telefono, estado, user } = req.body || {};

  try {
    await pool.query(
      'UPDATE empleado SET Dni = ?, Nombres = ?, Telefono = ?, Estado = ?, User = ? WHERE IdEmpleado = ?',
      [dni, nombres, telefono, estado, user, id]
    );

    res.json({ message: 'Empleado actualizado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar empleado.', detail: error.message });
  }
});

app.delete('/api/empleados/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM empleado WHERE IdEmpleado = ?', [req.params.id]);
    res.json({ message: 'Empleado eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar empleado.', detail: error.message });
  }
});

app.get('/api/clientes', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM cliente ORDER BY IdCliente DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar clientes.', detail: error.message });
  }
});

app.get('/api/clientes/:dni', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM cliente WHERE Dni = ? LIMIT 1', [req.params.dni]);
    if (!rows.length) {
      return res.status(404).json({ message: 'Cliente no encontrado.' });
    }
    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Error al buscar cliente.', detail: error.message });
  }
});

app.post('/api/clientes', async (req, res) => {
  const { dni, nombres, direccion, estado = '1' } = req.body || {};

  if (!dni || !nombres || !direccion) {
    return res.status(400).json({ message: 'Faltan datos del cliente.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO cliente (Dni, Nombres, Direccion, Estado) VALUES (?, ?, ?, ?)',
      [dni, nombres, direccion, estado]
    );
    res.status(201).json({ id: result.insertId, message: 'Cliente registrado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear cliente.', detail: error.message });
  }
});

app.get('/api/productos', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM producto ORDER BY IdProducto DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar productos.', detail: error.message });
  }
});

app.get('/api/productos/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM producto WHERE IdProducto = ? LIMIT 1', [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }
    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Error al buscar producto.', detail: error.message });
  }
});

app.post('/api/productos', async (req, res) => {
  const { nombres, precio, stock, estado = '1' } = req.body || {};

  if (!nombres || !precio || !stock) {
    return res.status(400).json({ message: 'Faltan datos del producto.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO producto (Nombres, Precio, Stock, Estado) VALUES (?, ?, ?, ?)',
      [nombres, precio, stock, estado]
    );
    res.status(201).json({ id: result.insertId, message: 'Producto registrado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear producto.', detail: error.message });
  }
});

app.put('/api/productos/:id', async (req, res) => {
  const { nombres, precio, stock, estado } = req.body || {};

  try {
    await pool.query(
      'UPDATE producto SET Nombres = ?, Precio = ?, Stock = ?, Estado = ? WHERE IdProducto = ?',
      [nombres, precio, stock, estado, req.params.id]
    );
    res.json({ message: 'Producto actualizado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar producto.', detail: error.message });
  }
});

app.delete('/api/productos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM producto WHERE IdProducto = ?', [req.params.id]);
    res.json({ message: 'Producto eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto.', detail: error.message });
  }
});

app.get('/api/ventas', async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT v.IdVentas, v.NumeroSerie, v.FechaVentas, v.Monto, v.Estado,
             c.Nombres AS cliente, e.Nombres AS empleado
      FROM ventas v
      INNER JOIN cliente c ON c.IdCliente = v.IdCliente
      INNER JOIN empleado e ON e.IdEmpleado = v.IdEmpleado
      ORDER BY v.IdVentas DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar ventas.', detail: error.message });
  }
});

app.post('/api/ventas', async (req, res) => {
  const { idCliente, idEmpleado = 1, numeroSerie = `SER-${Date.now()}`, fecha = new Date().toISOString().slice(0, 10), detalle = [] } = req.body || {};

  if (!idCliente || !Array.isArray(detalle) || !detalle.length) {
    return res.status(400).json({ message: 'Debe enviar un cliente y al menos un detalle de venta.' });
  }

  const monto = detalle.reduce((sum, item) => {
    const cantidad = Number(item.cantidad || 0);
    const precio = Number(item.precio || 0);
    return sum + cantidad * precio;
  }, 0);

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [venta] = await connection.query(
      'INSERT INTO ventas (IdCliente, IdEmpleado, NumeroSerie, FechaVentas, Monto, Estado) VALUES (?, ?, ?, ?, ?, ?)',
      [idCliente, idEmpleado, numeroSerie, fecha, monto, '1']
    );

    for (const item of detalle) {
      await connection.query(
        'INSERT INTO detalle_ventas (IdVentas, IdProducto, Cantidad, PrecioVenta) VALUES (?, ?, ?, ?)',
        [venta.insertId, item.idProducto, item.cantidad, item.precio]
      );
    }

    await connection.commit();

    res.status(201).json({
      id: venta.insertId,
      numeroSerie,
      monto,
      message: 'Venta registrada correctamente.',
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Error al registrar venta.', detail: error.message });
  } finally {
    connection.release();
  }
});

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`API Node en http://localhost:${port}`);
  });
}

export default app;
