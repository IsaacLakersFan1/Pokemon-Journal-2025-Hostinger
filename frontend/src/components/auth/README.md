# Sistema de Autenticación

Este directorio contiene los componentes y lógica para el manejo de autenticación en la aplicación.

## Componentes

### ProtectedRoute
Componente que protege rutas que requieren autenticación. Si el usuario no está autenticado, lo redirige al login.

```tsx
<ProtectedRoute>
  <SessionsPage />
</ProtectedRoute>
```

### PublicRoute
Componente para rutas públicas (login, signup). Si el usuario ya está autenticado, lo redirige a la página principal.

```tsx
<PublicRoute>
  <LoginPage />
</PublicRoute>
```

**Permitir acceso cuando está autenticado:**
```tsx
<PublicRoute allowAuthenticated={true}>
  <LoginPage />
</PublicRoute>
```

## Hook useAuth

Hook personalizado que maneja el estado de autenticación:

```tsx
const { user, loading, isAuthenticated, logout, checkAuth } = useAuth();
```

### Propiedades
- `user`: Usuario autenticado o null
- `loading`: Estado de carga durante verificación
- `isAuthenticated`: Boolean que indica si está autenticado
- `logout`: Función para cerrar sesión
- `checkAuth`: Función para verificar autenticación

## Flujo de Autenticación

1. **Inicio de la aplicación**: Se verifica automáticamente si hay un token válido
2. **Rutas protegidas**: Si no está autenticado → redirige a `/login`
3. **Rutas públicas**: Si está autenticado → redirige a `/home`
4. **Logout**: Limpia el estado y redirige al login

## Configuración

Las rutas están configuradas en `App.tsx`:

```tsx
// Rutas públicas
<Route path="/login" element={<PublicRoute allowAuthenticated={true}><LoginPage /></PublicRoute>} />
<Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

// Rutas protegidas  
<Route path="/sessions" element={<ProtectedRoute><SessionsPage /></ProtectedRoute>} />
```

## Características

- ✅ Verificación automática de autenticación
- ✅ Redirección automática según estado de auth
- ✅ Loading states durante verificación
- ✅ Protección de rutas
- ✅ Manejo de errores
- ✅ Persistencia de sesión con cookies
