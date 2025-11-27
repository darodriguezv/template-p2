# Sistema de Impuestos de Springfield

Sistema de gestión de impuestos para propiedades en Springfield, desarrollado con NestJS, TypeORM y PostgreSQL.

## Configuración del Proyecto

### Prerequisitos
- Node.js (v18 o superior)
- Docker Desktop
- npm o yarn

### Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
   - El archivo `.env` ya está configurado con los valores por defecto
   - Modificar si es necesario (puerto de BD, contraseñas, etc.)

4. Iniciar la base de datos PostgreSQL con Docker:
```bash
docker-compose up -d
```

5. Iniciar el servidor en modo desarrollo:
```bash
npm run start:dev
```

El servidor estará disponible en `http://localhost:3000/api`

## Estructura del Proyecto

### Entidades

- **ApiToken**: Gestión de tokens de API con límite de peticiones
- **Character**: Personajes con sus propiedades y favoritos
- **Location**: Locaciones/propiedades con sus dueños

### Endpoints

#### Token (Público - 15%)

1. **Crear Token**
   - `POST /api/token`
   - Body: `{ "token": "texto_unico" }`
   - Crea un nuevo token con 10 peticiones restantes

2. **Validar Token**
   - `GET /api/token/:id`
   - Retorna `true` si el token está activo y tiene peticiones restantes

3. **Reducir peticiones del Token**
   - `PATCH /api/token/reduce/:id`
   - Reduce en 1 las peticiones restantes del token

#### Character (Protegido - 75%)

**Nota**: Todas las rutas requieren header `x-token-id` con un ID de token válido

1. **Crear Personaje**
   - `POST /api/character`
   - Body:
   ```json
   {
     "name": "Homero Simpson",
     "salary": 4500,
     "employee": true
   }
   ```

2. **Agregar Favorito**
   - `PATCH /api/character/:id/favorites/:locationId`
   - El personaje y la locación deben existir
   - No puede agregar el mismo favorito dos veces

3. **Calcular Impuestos**
   - `GET /api/character/:id/taxes`
   - Retorna `{ "taxDebt": 0 }` si no tiene propiedad
   - Fórmula: `COSTO_LOCATION * (1 + COEF)`
     - COEF = 0.08 si es empleado
     - COEF = 0.03 si no es empleado

#### Location (Protegido - 75%)

**Nota**: Todas las rutas requieren header `x-token-id` con un ID de token válido

1. **Crear Locación**
   - `POST /api/location`
   - Body:
   ```json
   {
     "name": "Casa Homer",
     "type": "Casa",
     "cost": 350000,
     "ownerId": 1
   }
   ```
   - El dueño debe existir y no puede tener otra propiedad

2. **Obtener Locaciones con Visitantes Favoritos**
   - `GET /api/location`
   - Retorna todas las locaciones con sus personajes que las marcaron como favoritas

## Guard de Autenticación (10%)

Todas las rutas de `Character` y `Location` están protegidas por `TokenGuard` que:
- Verifica que el header `x-token-id` esté presente
- Valida que el token esté activo y tenga peticiones restantes
- Reduce automáticamente las peticiones restantes después de cada llamada
- Retorna error 401 si el token es inválido o no tiene peticiones

## Ejemplos de Uso

### 1. Crear un Token
```bash
curl -X POST http://localhost:3000/api/token \
  -H "Content-Type: application/json" \
  -d '{"token": "mi-token-seguro-123"}'
```

Respuesta:
```json
{
  "id": "uuid-generado",
  "token": "mi-token-seguro-123",
  "active": true,
  "reqLeft": 10
}
```

### 2. Crear un Personaje (con token)
```bash
curl -X POST http://localhost:3000/api/character \
  -H "Content-Type: application/json" \
  -H "x-token-id: uuid-del-token" \
  -d '{
    "name": "Homero Simpson",
    "salary": 4500,
    "employee": true
  }'
```

### 3. Crear una Locación
```bash
curl -X POST http://localhost:3000/api/location \
  -H "Content-Type: application/json" \
  -H "x-token-id: uuid-del-token" \
  -d '{
    "name": "Casa Homer",
    "type": "Casa",
    "cost": 350000,
    "ownerId": 1
  }'
```

### 4. Agregar Favorito
```bash
curl -X PATCH http://localhost:3000/api/character/1/favorites/1 \
  -H "x-token-id: uuid-del-token"
```

### 5. Calcular Impuestos
```bash
curl -X GET http://localhost:3000/api/character/1/taxes \
  -H "x-token-id: uuid-del-token"
```

Respuesta (si es empleado y tiene una casa de $350,000):
```json
{
  "taxDebt": 378000
}
```

## Validaciones Implementadas

- ✅ Token debe ser único
- ✅ Token debe estar activo y tener peticiones restantes
- ✅ El dueño de una locación debe existir
- ✅ Un personaje no puede tener más de una propiedad
- ✅ El personaje y locación deben existir al agregar favoritos
- ✅ No se pueden duplicar favoritos
- ✅ Mensajes de error personalizados para cada validación

## Datos de Ejemplo

### Personajes
| ID | Name | Salary | Employee |
|----|------|--------|----------|
| 1 | Homero Simpson | 4500 | true |
| 2 | Moe Szyslak | 7500 | false |
| 3 | Krusty | 12000 | false |
| 4 | Barney Gomez | 2100 | false |
| 5 | Carl | 5500 | true |
| 6 | Abraham Simpson | 500 | false |

### Locaciones
| ID | Name | Type | Cost |
|----|------|------|------|
| 1 | Casa Homer | Casa | 350000 |
| 2 | Taberna | Entretenimiento | 1200000 |
| 3 | Estudios TV | Entretenimiento | 17000000 |

## Tecnologías Utilizadas

- NestJS 11
- TypeORM 0.3
- PostgreSQL 14
- Docker & Docker Compose
- Class Validator & Class Transformer
- TypeScript

## Estructura de Carpetas

```
src/
├── character/
│   ├── dto/
│   │   └── create-character.dto.ts
│   ├── entities/
│   │   └── character.entity.ts
│   ├── character.controller.ts
│   ├── character.service.ts
│   └── character.module.ts
├── location/
│   ├── dto/
│   │   └── create-location.dto.ts
│   ├── entities/
│   │   └── location.entity.ts
│   ├── location.controller.ts
│   ├── location.service.ts
│   └── location.module.ts
├── token/
│   ├── dto/
│   │   └── create-token.dto.ts
│   ├── entities/
│   │   └── token.entity.ts
│   ├── token.controller.ts
│   ├── token.service.ts
│   └── token.module.ts
├── guards/
│   └── token.guard.ts
├── app.module.ts
└── main.ts
```

## Comandos Útiles

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod

# Tests
npm run test
npm run test:e2e

# Linting
npm run lint

# Format
npm run format

# Docker
docker-compose up -d    # Iniciar BD
docker-compose down     # Detener BD
docker-compose logs     # Ver logs
```

## Autor

Desarrollado como proyecto del Parcial 2 - Impuestos en Springfield
