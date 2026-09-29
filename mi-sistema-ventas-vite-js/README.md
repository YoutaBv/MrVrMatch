# Sistema de ventas

Aplicacion web con Vite y una API Express para gestionar empleados, clientes, productos y ventas.

## Desarrollo local

```sh
npm install
npm run dev
```

El modo de demostracion usa datos ficticios. Credenciales: `demo02` / `00000002`.

## TiDB Cloud

Duplica `.env.example` como `.env`, completa las credenciales de tu cluster y configura `USE_MOCK_DATA=false`. Importa el esquema y los datos desde TiDB Cloud usando tu copia local de `base/bd_ventas.sql`. Ese volcado se excluye de Git porque contiene datos personales; no publiques credenciales ni copias de la base de datos.

## Vercel

Configura el directorio raiz del proyecto Vercel como `mi-sistema-ventas-vite-js` dentro del repositorio. Vercel construye el frontend con `npm run build` y publica la API desde `api/index.js`. Agrega en Project Settings > Environment Variables `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL=true` y `USE_MOCK_DATA=false`. No configures `API_PORT` en Vercel.