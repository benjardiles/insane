# Plataforma de Comercio Electrónico - Frontend

## Descripción General
Este proyecto implementa el frontend de una plataforma de comercio electrónico que se comunica con una arquitectura de microservicios. Desarrollado con Next.js, proporciona interfaces para clientes, tiendas, repartidores y administradores.

## Requisitos previos
- Node.js (v18+)
- npm o yarn

## Cómo levantar el servicio

1. Clonar el repositorio:
```bash
git clone [url-del-repositorio]
cd [nombre-del-repositorio]
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

4. El frontend estará disponible en `http://localhost:3001`

## Orden de inicio recomendado
1. Base de datos MongoDB
2. Microservicio de Usuarios
3. Microservicio de Tienda
4. Microservicio de Compras
5. Frontend

## Conexión con microservicios
El frontend está configurado para conectarse a los siguientes microservicios:
- Microservicio de Usuarios: `http://localhost:3000`
- Microservicio de Tienda: `http://localhost:3002`
- Microservicio de Compras: `http://localhost:3003`

## Usuarios de prueba
Puedes utilizar estos usuarios para probar la aplicación:

| Rol | Email | Contraseña |
|-----|-------|------------|
| Cliente | cliente@test.com | password123 |
| Tienda | tienda@test.com | password123 |
| Repartidor | delivery@test.com | password123 |
| Admin | admin@test.com | admin123 |

## Funcionalidades por rol

### Cliente
- Navegar por el catálogo de productos
- Añadir productos al carrito
- Realizar pedidos
- Ver historial de pedidos

### Tienda
- Gestionar productos
- Recibir y procesar pedidos
- Ver estadísticas de ventas

### Repartidor
- Ver pedidos disponibles para entrega
- Actualizar estado de entregas

### Administrador
- Gestionar usuarios
- Supervisar pedidos
- Ver estadísticas generales

## Estructura del proyecto
El proyecto sigue la estructura estándar de Next.js con:
- `/src/app`: Páginas y rutas de la aplicación
- `/src/components`: Componentes reutilizables
- `/src/services`: Servicios para comunicación con APIs
- `/src/contexts`: Contextos de React para estado global
- `/src/store`: Estado global con Zustand



# Plataforma de Comercio Electrónico - Arquitectura de Microservicios (RESUMEN TODO EL PROYECTO)

## Descripción General

Este proyecto implementa una plataforma completa de comercio electrónico utilizando una arquitectura de microservicios. Cada componente está diseñado para funcionar de manera independiente, permitiendo escalabilidad, mantenimiento y desarrollo más eficientes.

## Arquitectura

![Arquitectura de Microservicios]

### Componentes Principales

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| Frontend (Next.js) | 3000 | Interfaz de usuario para clientes y tiendas |
| Microservicio de Usuarios | 3001 | Gestión de usuarios, autenticación y perfiles |
| Microservicio de Tienda | 3002 | Gestión de productos, pedidos y tiendas |

## Tecnologías Utilizadas

- **Frontend**: Next.js, React, TypeScript
- **Backend**: NestJS, TypeScript
- **Base de Datos**: MongoDB
- **Autenticación**: JWT
- **Comunicación**: REST API, TCP (microservicios)
- **Documentación API**: Swagger
- **Contenedores**: Docker (opcional)

## Microservicios

### 1. Frontend (insane)

Aplicación web construida con Next.js que proporciona la interfaz de usuario para todos los tipos de usuarios.

```bash
# Instalación
cd insane
npm install

# Ejecución
npm run dev
```

**Características principales:**
- Catálogo de productos
- Carrito de compras
- Gestión de pedidos
- Panel de administración para tiendas
- Autenticación de usuarios

### 2. Microservicio de Usuarios (microservicio-Usuario)

Gestiona la autenticación, registro y perfiles de usuarios.

```bash
# Instalación
cd microservicio-Usuario
npm install


# Ejecución
npm run start:dev
```

**Características principales:**
- Registro y autenticación de usuarios
- Gestión de perfiles
- Roles y permisos
- Recuperación de contraseña
- Comunicación por microservicios (TCP puerto 3001)

### 3. Microservicio de Tienda (store-microservice-f)

Gestiona productos, pedidos, proveedores y reseñas.

```bash
# Instalación
cd store-microservice-f
npm install

# Ejecución
npm run dev
```

**Características principales:**
- Gestión de productos
- Procesamiento de pedidos
- Gestión de proveedores
- Sistema de reseñas
- Panel de estadísticas

## Configuración de Base de Datos

Todos los microservicios utilizan MongoDB. Asegúrate de tener MongoDB instalado y ejecutándose


La base de datos predeterminada es `DbWeb` y se ejecuta en `localhost:27017`.

## Flujo de Comunicación

1. El cliente interactúa con el frontend (Next.js)
2. El frontend se comunica con los microservicios a través de API REST
3. Los microservicios se comunican entre sí mediante TCP cuando es necesario
4. Cada microservicio gestiona su propia conexión a la base de datos

## Endpoints Principales

### Microservicio de Usuarios (http://localhost:3000/api)
- **Autenticación**: `/auth/login`, `/auth/register`
- **Usuarios**: `/users`, `/users/:id`
- **Perfiles**: `/users/profile`

### Microservicio de Tienda (http://localhost:3002/api/store)
- **Productos**: `/products`, `/products/:id`
- **Pedidos**: `/orders`, `/orders/:id`
- **Proveedores**: `/suppliers`, `/suppliers/:id`
- **Reseñas**: `/reviews`, `/reviews/:id`
- **Dashboard**: `/dashboard`

## Desarrollo

### Requisitos Previos
- Node.js (v16+)
- MongoDB
- npm o yarn


