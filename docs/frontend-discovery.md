# Frontend Discovery — Módulo Contenedores

Fecha de análisis: 2026-04-14

---

## 1. Stack exacto

| Tecnología | Versión | Notas |
|---|---|---|
| React | 19.2.4 | — |
| TypeScript | ~5.9.3 | — |
| Tailwind CSS | 4.2.1 | v4 — sin tailwind.config.js, config via CSS |
| Vite | 8.0.0 | Bundler |
| react-router-dom | 7.13.1 | BrowserRouter + Routes/Route |

---

## 2. Manejo de estado

| Herramienta | Uso |
|---|---|
| **Redux Toolkit** | Solo para auth global (`store.auth.user`, `store.auth.isSignedIn`) |
| **@tanstack/react-query v5** | Data fetching — `useQuery` en screens, `queryKey` + `queryFn` |
| **Estado local (useState)** | Estado de UI dentro de componentes |

**No hay Zustand, Jotai ni Context propio para features.** El estado de cada módulo vive en el componente screen usando `useQuery` para los datos remotos.

---

## 3. Data fetching — cliente HTTP

**Archivo**: `src/config/http/axios.ts`

```typescript
const api = axios.create({ baseURL: import.meta.env.VITE_BASE_URL });

api.interceptors.request.use(config => {
    const token = localStorage.getItem('AUTH_TOKEN');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
```

- Token JWT en `localStorage` clave `AUTH_TOKEN`
- Interceptor de Axios agrega el header automáticamente
- `VITE_BASE_URL` desde variables de entorno

**Patrón de error en DatasourceImpl:**
```typescript
catch (error) {
    if (isAxiosError(error)) {
        if (error.response?.data['statusCode'] == 404) throw new NotFoundErrorError(...)
        throw new Error(error.response?.data['message'])
    }
    throw new Error("Error no controlado")
}
```

---

## 4. Sistema de notificaciones (Toasts)

**Librería**: `sonner` v2.0.7

**Uso**: A través del hook `useNotification()`:
```typescript
const notification = useNotification();
notification.success('Mensaje de éxito');
notification.error('Mensaje de error');
notification.warning('Advertencia');
notification.information('Información');
```

El `Toaster` está montado en `main.tsx` dentro de `NotificationProvider`.
Posición: `top-center`.

---

## 5. Arquitectura por feature — Patrón exacto a replicar

Cada feature sigue esta estructura (ver `my-orders` como referencia):

```
src/features/<nombre>/
  domain/
    datasources/
      <Nombre>Datasource.ts      ← abstract class
      datasources.ts             ← re-export
    repositories/
      <Nombre>Repository.ts      ← abstract class
      repositories.ts            ← re-export
    types/
      types.ts                   ← tipos inferidos de zod schemas
    interfaces/
      interfaces.ts              ← payloads de inputs
    schemas/
      schemas.ts                 ← Zod schemas para validar respuestas
    domain.ts                    ← barrel de todo domain/
  infrastructure/
    datasources/
      <Nombre>DatasourceImpl.ts  ← implementación con axios
      datasources.ts             ← re-export
    repositories/
      <Nombre>RepositoryImpl.ts  ← thin wrapper del datasource
      repositories.ts            ← re-export
    errors/
      errors.ts                  ← clases de error custom
    infrastructure.ts            ← barrel de todo infrastructure/
  presentation/
    providers/
      <Nombre>Provider.ts        ← service/use-case class
      <nombre>RepositoryProvider.ts ← factory singleton
      providers.ts               ← re-export
    screens/
      <Screen>.tsx               ← page components (usan useQuery)
      screens.ts                 ← re-export
    components/
      <Componente>.tsx
      components.ts              ← re-export
    presentation.ts              ← barrel de todo presentation/
  <nombre>.ts                    ← barrel raíz del feature
```

**IMPORTANTE**: La carpeta del módulo va en `src/features/containers/`, **NO** en `src/modules/containers/` como dice el prompt original.

---

## 6. Componentes reutilizables existentes (`src/features/shared/components/`)

| Componente | Path | Descripción |
|---|---|---|
| `Modal` | `shared/components/Modal.tsx` | Dialog con `@headlessui/react`, prop `modal` (bool) + `closeModal` + `title` + `children` + `width` |
| `CustomFilledButton` | `shared/components/CustomFilledButton.tsx` | Botón verde relleno. Props: `label`, `type`, `onClick`, `icon`, `disabled`, `fullWitdh`, `className` |
| `CustomNavLink` | `shared/components/CustomNavLink.tsx` | Item del sidebar. Props: `to`, `label`, `children` (ícono) |
| `CustomSideBar` | `shared/components/CustomSideBar.tsx` | Sidebar. **Aquí se agrega el nuevo ítem** |
| `Table` | `shared/components/Table.tsx` | Tabla genérica con columns + data |
| `Tag` | `shared/components/Tag.tsx` | Badge de status de orden |
| `Pagination` | `shared/components/Pagination.tsx` | Paginación MUI |
| `TextFormField` | `shared/components/TextFormField.tsx` | Input de texto con react-hook-form |
| `SelectFormField` | `shared/components/SelectFormField.tsx` | Select con react-hook-form |
| `DateFormField` | `shared/components/DateFormField.tsx` | Input de fecha con react-hook-form |
| `PasswordFormField` | `shared/components/PasswordFormField.tsx` | Input de contraseña |

---

## 7. Rutas — dónde agregar la nueva ruta

**Archivo**: `src/router.tsx`

Agregar dentro del bloque `<Route element={<ProtectedLayout />}>`:
```tsx
// CONTAINERS
<Route path="/containers" element={<Containers />} />
```

Si el módulo requiere roles específicos, envolver con `<RoleMiddleware allowedRoles={['admin', 'administrative']} />`.

---

## 8. Sidebar — dónde agregar el nuevo ítem

**Archivo**: `src/features/shared/components/CustomSideBar.tsx`

Agregar un nuevo `<CustomNavLink to='/containers' label='Containers'>` con el ícono apropiado de `react-icons`.

Los roles disponibles: `admin`, `administrator` (nota: el rol en BD es `administrative`, pero el check actual usa `administrator` — verificar con el usuario si hay discrepancia).

---

## 9. Librería de íconos

**Librería**: `react-icons` v5.6.0

Paquetes usados en el proyecto: `bi` (BoxIcons), `bs` (Bootstrap Icons), `hi` (Heroicons).

Para "Containers" usar `BsTruck` de `react-icons/bs`:
```tsx
import { BsTruck } from 'react-icons/bs';
<BsTruck size={25} />
```

---

## 10. Validación de formularios

**Librería**: `react-hook-form` v7.71.2 + `zod` v4.3.6

Patrón:
```typescript
// 1. Definir schema en domain/schemas/schemas.ts
const Schema = z.object({ ... });

// 2. Inferir tipo en domain/types/types.ts
type MyType = z.infer<typeof Schema>;

// 3. Usar en screen con react-hook-form + zodResolver
const { register, handleSubmit } = useForm<MyType>({ resolver: zodResolver(Schema) });
```

---

## 11. Layout del Protected Layout

```
┌───────────────────────────────────────────┐
│ aside (bg-gray-900) │ header (bg-white)   │
│ CustomSideBar       │ CustomHeader         │
│                     ├─────────────────────│
│                     │ section (bg-gray-50) │
│                     │ <Outlet />           │
└───────────────────────────────────────────┘
```

El contenido de cada page se renderiza en la `section` con `p-6 overflow-y-auto`.

---

## 12. Diferencias críticas entre el prompt del frontend y la realidad del proyecto

| Aspecto | Prompt original asumía | Realidad del proyecto |
|---|---|---|
| Carpeta del módulo | `src/modules/containers/` | **`src/features/containers/`** |
| Estado global del draft | Zustand store | **Redux o estado local** — no hay Zustand |
| React Query para mutaciones | `useMutation` | **No se usan mutations** — las screens llaman providers directamente con async functions |
| Estructura del módulo | `pages/`, `components/`, `hooks/`, `services/`, `types/` | **`domain/`, `infrastructure/`, `presentation/screens/`, `presentation/components/`, `presentation/providers/`** |
| `containers.api.ts` | Archivo de servicio plano | **`ContainersDatasourceImpl.ts`** con el mismo patrón de axios |
| Toast directo con `toast()` | Sonner directo | **`useNotification()` hook** wrappea Sonner |

---

## 13. Consideración de roles para el módulo

Basándose en el código del sidebar:
- `admin` y `administrator` ven Products, Clients, Reports
- Todos los roles ven My Orders y Dashboard

El módulo Containers es de logística — probablemente solo `admin` y `administrative`. **Confirmar con el usuario antes de implementar el guard.**

---

## 14. Próximos pasos (orden de implementación)

1. Tipos Zod en `domain/schemas/` + `domain/types/`
2. Datasource abstract + Repository abstract en `domain/`
3. `ContainersDatasourceImpl` en `infrastructure/` (usando `api` de axios)
4. `ContainersRepositoryImpl` + Provider en `presentation/providers/`
5. Agregar ítem en sidebar + ruta en `router.tsx`
6. Screen principal `Containers.tsx` + subcomponentes
7. Modales: `ContainerDetailModal`, `AutoProposalModal`, `ConfirmModal`
8. Barrel files en cada nivel
