# FastBite Delivery - Frontend

FastBite Delivery es una aplicación web moderna para entrega de comida, construida con React y Vite. Cuenta con un diseño responsivo, simulación de seguimiento de pedidos en tiempo real y un panel de administración para gestionar productos y pedidos.

## Características

-   **Interfaz de Usuario**:
    -   **Menú**: Navega por productos por categoría (Hamburguesas, Pizzas, Bebidas, etc.).
    -   **Carrito**: Agrega artículos, ajusta cantidades y realiza el pago.
    -   **Seguimiento de Pedidos**: Ver el estado de tu pedido en tiempo real.
    -   **Asistente IA**: Chatbot integrado con Google Gemini para atención al cliente.
-   **Panel de Administración**:
    -   **Gestión de Productos**: Agregar, editar y eliminar productos.
    -   **Gestión de Pedidos**: Ver y actualizar estados de los pedidos.
    -   **Analíticas**: Gráficos visuales para estadísticas de ventas y pedidos.
-   **Stack Tecnológico**:
    -   **Framework**: React 19 + Vite
    -   **Estilos**: Tailwind CSS (vía CDN)
    -   **Lenguaje**: TypeScript
    -   **Enrutamiento**: React Router DOM
    -   **Iconos**: Lucide React
    -   **Gráficos**: Recharts

## Comenzando

### Prerrequisitos

-   Node.js (v18 o superior recomendado)
-   npm

### Instalación

1.  Clonar el repositorio:
    ```bash
    git clone https://github.com/jhonlemus05/FastBite-Delivery.git
    cd FastBite-Delivery
    ```

2.  Instalar dependencias:
    ```bash
    npm install
    ```

3.  Configurar Variables de Entorno:
    Crea un archivo `.env.local` en el directorio raíz y agrega:
    ```env
    VITE_API_URL=http://localhost:3000/api  # O tu URL del backend desplegado
    VITE_GEMINI_API_KEY=tu_clave_api_gemini
    ```

4.  Ejecutar el servidor de desarrollo:
    ```bash
    npm run dev
    ```

5.  Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## Estructura del Proyecto

-   `src/pages`: Vistas principales de la aplicación (Home, Menu, Cart, AdminDashboard, Login).
-   `src/components`: Componentes de UI reutilizables.
-   `src/context`: Gestión de estado global (StoreContext).
-   `src/services`: Integración de API y servicios de IA.
-   `src/types`: Interfaces y tipos de TypeScript.

## Despliegue

Este proyecto está configurado para despliegue en **Vercel**.

1.  Sube tu código a GitHub.
2.  Importa el proyecto en Vercel.
3.  Configura las variables de entorno `VITE_API_URL` y `VITE_GEMINI_API_KEY` en Vercel.
4.  ¡Despliega!

El archivo `vercel.json` maneja las reescrituras de rutas para la Single Page Application (SPA).
