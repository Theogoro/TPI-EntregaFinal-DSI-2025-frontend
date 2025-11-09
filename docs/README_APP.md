# Sistema de Gestión de Eventos Sísmicos - Frontend

## 📋 Descripción

Aplicación React + TypeScript para la gestión y revisión manual de eventos sísmicos. Implementa el caso de uso #23: "Registrar resultado de revisión manual".

## 🚀 Características

- ✅ Búsqueda de eventos pendientes de revisión
- ✅ Bloqueo de eventos para revisión manual
- ✅ Visualización de datos sísmicos detallados
- ✅ Visualización de sismogramas por estación
- ✅ Rechazo de eventos sísmicos
- ✅ Navegación completa con teclado
- ✅ Interfaz amigable y moderna

## 🎯 Flujo de Trabajo (Caso de Uso #23)

1. **Listar Eventos Pendientes**: Muestra todos los eventos en estados `PTE_DE_REVISION` o `AUTO_DETECTADO`
2. **Seleccionar Evento**: El usuario selecciona un evento y confirma el bloqueo
3. **Mostrar Datos**: Visualiza información completa del evento (magnitud, coordenadas, clasificación, sismogramas)
4. **Preguntar por Mapa**: Opción de visualizar mapa (no implementada, solo opción "No" funciona)
5. **Preguntar por Modificación**: Opción de modificar datos (no implementada, solo opción "No" funciona)
6. **Seleccionar Acción**: 3 opciones disponibles (solo "Rechazar" está implementada)
7. **Confirmar y Finalizar**: Muestra mensaje "Fin Caso de Uso"

## ⌨️ Atajos de Teclado

### En Lista de Eventos
- `↑` / `↓` - Navegar entre eventos
- `Enter` - Seleccionar evento actual
- `Ctrl + R` - Actualizar lista

### En Confirmaciones
- `Y` / `Enter` - Confirmar
- `N` / `Esc` - Cancelar

### En Detalles del Evento
- `Enter` - Continuar al siguiente paso
- `N` - Responder "No" a preguntas
- `R` / `1` - Seleccionar "Rechazar evento"

## 🛠️ Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- Backend API corriendo en `http://localhost:8080`

### Pasos

1. **Instalar dependencias**:
```bash
npm install
```

2. **Iniciar servidor de desarrollo**:
```bash
npm run dev
```

3. **Abrir en navegador**:
La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
src/
├── types/
│   └── api.ts              # Definiciones de tipos TypeScript
├── services/
│   └── api.ts              # Cliente API para comunicación con backend
├── components/
│   ├── EventsList.tsx      # Lista de eventos pendientes
│   ├── EventsList.css
│   ├── EventDetails.tsx    # Detalles y revisión de evento
│   ├── EventDetails.css
│   ├── ConfirmationModal.tsx # Modal de confirmación reutilizable
│   └── ConfirmationModal.css
├── App.tsx                 # Componente principal
├── App.css
├── main.tsx               # Punto de entrada
└── index.css              # Estilos globales
```

## 🔌 API Endpoints Utilizados

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/eventos/eventos-sin-revision` | GET | Obtener eventos pendientes |
| `/api/eventos/tomar-evento` | POST | Bloquear evento para revisión |
| `/api/eventos/{id}/datos-registrados` | GET | Obtener clasificación y datos |
| `/api/eventos/{id}/sismogramas` | GET | Obtener sismogramas por estación |
| `/api/eventos/{id}/rechazar` | POST | Rechazar evento |

## 🎨 Características de UI/UX

- **Diseño Responsivo**: Funciona en desktop y tablets
- **Feedback Visual**: Estados de hover, selección y foco claramente visibles
- **Indicadores de Carga**: Spinners y mensajes de estado
- **Manejo de Errores**: Mensajes amigables para el usuario
- **Accesibilidad**: Navegación completa por teclado
- **Animaciones Suaves**: Transiciones y efectos visuales

## 🔧 Configuración

### Cambiar URL del Backend

Edita `src/services/api.ts`:

```typescript
const BASE_URL = 'http://tu-servidor:puerto';
```

## 📊 Estados de Eventos

- `PTE_DE_REVISION` - Pendiente de Revisión
- `AUTO_DETECTADO` - Auto Detectado
- `BLOQUEADO_EN_REVISION` - Bloqueado en Revisión
- `RECHAZADO` - Rechazado
- `CONFIRMADO` - Confirmado (no implementado)
- `DERIVADO` - Derivado (no implementado)

## ⚠️ Funcionalidades No Implementadas

Como se solicitó, las siguientes funciones muestran mensaje "No implementado":

- ✗ Visualización de mapa geográfico
- ✗ Modificación de datos del evento
- ✗ Confirmar evento
- ✗ Derivar a experto

Solo está implementada la funcionalidad de **Rechazar Evento**.

## 🐛 Solución de Problemas

### Error: No se pueden cargar eventos

1. Verifica que el backend esté corriendo en `http://localhost:8080`
2. Revisa la consola del navegador para errores CORS
3. Asegúrate de que haya eventos en estado `PTE_DE_REVISION` o `AUTO_DETECTADO`

### Error al bloquear evento

- El evento puede estar ya bloqueado por otro usuario
- Verifica que el evento esté en un estado válido para revisión

## 👨‍💻 Desarrollo

### Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Compilar para producción
npm run preview  # Vista previa de build de producción
npm run lint     # Linter de código
```

## 📝 Notas del Proyecto

- Proyecto académico para la materia DSI (Diseño de Sistemas de Información)
- Universidad Tecnológica Nacional (UTN)
- Caso de uso implementado: **#23 - Registrar resultado de revisión manual**
- Prioridad: **Alta**
- Complejidad: **Mediana**

## 🎓 Objetivos de Aprendizaje

- Implementación de arquitectura frontend limpia
- Integración con API REST
- Manejo de estado en React
- TypeScript para type safety
- UX/UI centrada en el usuario
- Accesibilidad y navegación por teclado

---

**Desarrollado con ❤️ para UTN DSI 2024**
