import './style.css';

const app = document.querySelector('#app');

app.innerHTML = `
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">V</div>
        <div>
          <p class="eyebrow">Sistema</p>
          <h1>Ventas</h1>
        </div>
      </div>

      <nav class="nav">
        <button class="nav-item active" data-view="dashboard">Dashboard</button>
        <button class="nav-item" data-view="empleados">Empleados</button>
        <button class="nav-item" data-view="clientes">Clientes</button>
        <button class="nav-item" data-view="productos">Productos</button>
        <button class="nav-item" data-view="ventas">Ventas</button>
      </nav>
    </aside>

    <main class="content">
      <header class="topbar">
        <div>
          <p class="eyebrow">Panel de control</p>
          <h2>Mi Sistema de Ventas</h2>
        </div>
        <button id="btn-login" class="primary-btn">Iniciar sesión</button>
      </header>

      <section id="view-root" class="panel"></section>
    </main>
  </div>
`;

const state = {
  view: 'dashboard',
  user: null,
  empleados: [],
  clientes: [],
  productos: [],
  ventas: [],
};

const viewRoot = document.querySelector('#view-root');
const btnLogin = document.querySelector('#btn-login');

function renderDashboard() {
  viewRoot.innerHTML = `
    <div class="stats-grid">
      <article class="stat-card">
        <span>Empleados</span>
        <strong>${state.empleados.length}</strong>
      </article>
      <article class="stat-card">
        <span>Clientes</span>
        <strong>${state.clientes.length}</strong>
      </article>
      <article class="stat-card">
        <span>Productos</span>
        <strong>${state.productos.length}</strong>
      </article>
      <article class="stat-card">
        <span>Ventas</span>
        <strong>${state.ventas.length}</strong>
      </article>
    </div>

    <div class="welcome-box">
      <h3>Resumen del negocio</h3>
      <p>Este frontend replica el flujo principal del sistema Java original: login, gestión de empleados, clientes, productos y ventas.</p>
      <p>La API usa la base de datos <strong>bd_ventas</strong> conectada a TiDB Cloud.</p>
    </div>
  `;
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error de la API');
  }

  return data;
}

async function loadData() {
  try {
    const [empleados, clientes, productos, ventas] = await Promise.all([
      fetchJson('/api/empleados'),
      fetchJson('/api/clientes'),
      fetchJson('/api/productos'),
      fetchJson('/api/ventas'),
    ]);

    state.empleados = empleados;
    state.clientes = clientes;
    state.productos = productos;
    state.ventas = ventas;
  } catch (error) {
    console.error(error);
    viewRoot.innerHTML = `<div class="alert error">${error.message}</div>`;
  }
}

function renderLoginForm() {
  viewRoot.innerHTML = `
    <form id="login-form" class="form-card">
      <h3>Acceso al sistema</h3>
      <label>
        Usuario
        <input name="user" type="text" placeholder="Ingrese usuario" required />
      </label>
      <label>
        Contraseña
        <input name="pass" type="password" placeholder="Ingrese contraseña" required />
      </label>
      <button type="submit" class="primary-btn">Ingresar</button>
    </form>
  `;

  document.querySelector('#login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      const data = await fetchJson('/api/login', {
        method: 'POST',
        body: JSON.stringify({
          user: form.get('user'),
          pass: form.get('pass'),
        }),
      });

      state.user = data.user;
      btnLogin.textContent = `Hola, ${data.user.user}`;
      await loadData();
      state.view = 'dashboard';
      renderView();
    } catch (error) {
      viewRoot.innerHTML = `<div class="alert error">${error.message}</div>`;
    }
  });
}

function renderEmpleadoTable() {
  viewRoot.innerHTML = `
    <div class="toolbar">
      <h3>Empleados</h3>
      <button class="primary-btn" type="button">Nuevo empleado</button>
    </div>
    <table>
      <thead>
        <tr><th>ID</th><th>DNI</th><th>Nombres</th><th>Teléfono</th><th>Estado</th><th>Usuario</th></tr>
      </thead>
      <tbody>
        ${state.empleados.map((emp) => `
          <tr>
            <td>${emp.IdEmpleado}</td>
            <td>${emp.Dni}</td>
            <td>${emp.Nombres}</td>
            <td>${emp.Telefono}</td>
            <td>${emp.Estado}</td>
            <td>${emp.User}</td>
          </tr>
        `).join('') || '<tr><td colspan="6">Sin registros</td></tr>'}
      </tbody>
    </table>
  `;
}

function renderClienteTable() {
  viewRoot.innerHTML = `
    <div class="toolbar">
      <h3>Clientes</h3>
    </div>
    <table>
      <thead>
        <tr><th>ID</th><th>DNI</th><th>Nombres</th><th>Dirección</th><th>Estado</th></tr>
      </thead>
      <tbody>
        ${state.clientes.map((cli) => `
          <tr>
            <td>${cli.IdCliente}</td>
            <td>${cli.Dni}</td>
            <td>${cli.Nombres}</td>
            <td>${cli.Direccion}</td>
            <td>${cli.Estado}</td>
          </tr>
        `).join('') || '<tr><td colspan="5">Sin registros</td></tr>'}
      </tbody>
    </table>
  `;
}

function renderProductoTable() {
  viewRoot.innerHTML = `
    <div class="toolbar">
      <h3>Productos</h3>
    </div>
    <table>
      <thead>
        <tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Estado</th></tr>
      </thead>
      <tbody>
        ${state.productos.map((prod) => `
          <tr>
            <td>${prod.IdProducto}</td>
            <td>${prod.Nombres}</td>
            <td>${prod.Precio}</td>
            <td>${prod.Stock}</td>
            <td>${prod.Estado}</td>
          </tr>
        `).join('') || '<tr><td colspan="5">Sin registros</td></tr>'}
      </tbody>
    </table>
  `;
}

function renderVentasTable() {
  viewRoot.innerHTML = `
    <div class="toolbar">
      <h3>Ventas</h3>
    </div>
    <table>
      <thead>
        <tr><th>ID</th><th>Número</th><th>Cliente</th><th>Empleado</th><th>Fecha</th><th>Monto</th></tr>
      </thead>
      <tbody>
        ${state.ventas.map((venta) => `
          <tr>
            <td>${venta.IdVentas}</td>
            <td>${venta.NumeroSerie}</td>
            <td>${venta.cliente}</td>
            <td>${venta.empleado}</td>
            <td>${venta.FechaVentas}</td>
            <td>${venta.Monto}</td>
          </tr>
        `).join('') || '<tr><td colspan="6">Sin registros</td></tr>'}
      </tbody>
    </table>
  `;
}

function renderView() {
  if (!state.user) {
    renderLoginForm();
    return;
  }

  switch (state.view) {
    case 'empleados':
      renderEmpleadoTable();
      break;
    case 'clientes':
      renderClienteTable();
      break;
    case 'productos':
      renderProductoTable();
      break;
    case 'ventas':
      renderVentasTable();
      break;
    case 'dashboard':
    default:
      renderDashboard();
      break;
  }
}

document.querySelectorAll('.nav-item').forEach((button) => {
  button.addEventListener('click', async () => {
    state.view = button.dataset.view;
    if (!state.user && state.view !== 'dashboard') {
      renderLoginForm();
      return;
    }

    if (state.user) {
      await loadData();
    }
    renderView();
  });
});

btnLogin.addEventListener('click', () => {
  state.user = null;
  btnLogin.textContent = 'Iniciar sesión';
  state.view = 'dashboard';
  renderView();
});

loadData().then(() => renderView()).catch(() => renderLoginForm());
