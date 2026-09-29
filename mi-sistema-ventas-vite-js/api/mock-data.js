import { Router } from 'express';

const empleados = [
  { IdEmpleado: 3, Dni: '00000003', Nombres: 'Empleado Demo Tres', Telefono: '900000003', Estado: '1', User: 'demo03' },
  { IdEmpleado: 2, Dni: '00000002', Nombres: 'Empleado Demo Dos', Telefono: '900000002', Estado: '1', User: 'demo02' },
  { IdEmpleado: 1, Dni: '00000001', Nombres: 'Empleado Demo Uno', Telefono: '900000001', Estado: '1', User: 'demo01' },
];

const clientes = [
  { IdCliente: 20, Dni: '10000004', Nombres: 'Cliente Demo Cuatro', Direccion: 'Direccion de prueba 4', Estado: '1' },
  { IdCliente: 19, Dni: '10000003', Nombres: 'Cliente Demo Tres', Direccion: 'Direccion de prueba 3', Estado: '1' },
  { IdCliente: 18, Dni: '10000002', Nombres: 'Cliente Demo Dos', Direccion: 'Direccion de prueba 2', Estado: '1' },
  { IdCliente: 17, Dni: '10000001', Nombres: 'Cliente Demo Uno', Direccion: 'Direccion de prueba 1', Estado: '1' },
];

const productos = [
  { IdProducto: 7, Nombres: 'Producto Nuevo w', Precio: 22, Stock: 35, Estado: '1' },
  { IdProducto: 4, Nombres: 'HeadPhones Sony M333', Precio: 500, Stock: 98, Estado: '1' },
  { IdProducto: 3, Nombres: 'Laptop Lenovo Ideapad 520', Precio: 800, Stock: 100, Estado: '1' },
  { IdProducto: 2, Nombres: 'Mouse Logitech 567', Precio: 20, Stock: 98, Estado: '1' },
  { IdProducto: 1, Nombres: 'Teclado Logitech 345 Editado', Precio: 150, Stock: 99, Estado: '1' },
];

const ventas = [
  { IdVentas: 94, NumeroSerie: 'DEMO-0001', FechaVentas: '2022-10-07', Monto: 20, Estado: '1', cliente: 'Cliente Demo Uno', empleado: 'Empleado Demo Dos' },
];

function nextId(rows, key) {
  return Math.max(0, ...rows.map((row) => Number(row[key]) || 0)) + 1;
}

export function createMockRouter() {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.json({ status: 'ok', mode: 'mock', database: 'bd_ventas' });
  });

  router.post('/login', (req, res) => {
    const { user, pass } = req.body || {};
    const empleado = empleados.find((item) => item.User === user && item.Dni === pass);

    if (!empleado) {
      return res.status(401).json({ message: 'Credenciales invalidas. Prueba demo02 / 00000002.' });
    }

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
  });

  router.get('/empleados', (_req, res) => res.json(empleados));
  router.get('/clientes', (_req, res) => res.json(clientes));
  router.get('/productos', (_req, res) => res.json(productos));
  router.get('/ventas', (_req, res) => res.json(ventas));

  router.get('/clientes/:dni', (req, res) => {
    const cliente = clientes.find((item) => item.Dni === req.params.dni);
    return cliente ? res.json(cliente) : res.status(404).json({ message: 'Cliente no encontrado.' });
  });

  router.get('/productos/:id', (req, res) => {
    const producto = productos.find((item) => item.IdProducto === Number(req.params.id));
    return producto ? res.json(producto) : res.status(404).json({ message: 'Producto no encontrado.' });
  });

  router.post('/empleados', (req, res) => {
    const empleado = {
      IdEmpleado: nextId(empleados, 'IdEmpleado'),
      Dni: req.body.dni,
      Nombres: req.body.nombres,
      Telefono: req.body.telefono,
      Estado: req.body.estado || '1',
      User: req.body.user,
    };
    empleados.unshift(empleado);
    res.status(201).json({ id: empleado.IdEmpleado, message: 'Empleado registrado correctamente.' });
  });

  router.post('/clientes', (req, res) => {
    const cliente = {
      IdCliente: nextId(clientes, 'IdCliente'),
      Dni: req.body.dni,
      Nombres: req.body.nombres,
      Direccion: req.body.direccion,
      Estado: req.body.estado || '1',
    };
    clientes.unshift(cliente);
    res.status(201).json({ id: cliente.IdCliente, message: 'Cliente registrado correctamente.' });
  });

  router.post('/productos', (req, res) => {
    const producto = {
      IdProducto: nextId(productos, 'IdProducto'),
      Nombres: req.body.nombres,
      Precio: Number(req.body.precio),
      Stock: Number(req.body.stock),
      Estado: req.body.estado || '1',
    };
    productos.unshift(producto);
    res.status(201).json({ id: producto.IdProducto, message: 'Producto registrado correctamente.' });
  });

  router.post('/ventas', (req, res) => {
    const detalle = Array.isArray(req.body.detalle) ? req.body.detalle : [];
    const monto = detalle.reduce((total, item) => total + Number(item.cantidad || 0) * Number(item.precio || 0), 0);
    const cliente = clientes.find((item) => item.IdCliente === Number(req.body.idCliente));
    const empleado = empleados.find((item) => item.IdEmpleado === Number(req.body.idEmpleado || 1));
    const venta = {
      IdVentas: nextId(ventas, 'IdVentas'),
      NumeroSerie: req.body.numeroSerie || `MOCK-${Date.now()}`,
      FechaVentas: req.body.fecha || new Date().toISOString().slice(0, 10),
      Monto: monto,
      Estado: '1',
      cliente: cliente?.Nombres || 'Cliente de prueba',
      empleado: empleado?.Nombres || 'Empleado de prueba',
    };
    ventas.unshift(venta);
    res.status(201).json({ id: venta.IdVentas, numeroSerie: venta.NumeroSerie, monto, message: 'Venta registrada correctamente.' });
  });

  return router;
}
