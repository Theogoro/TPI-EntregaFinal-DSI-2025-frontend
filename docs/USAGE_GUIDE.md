# 🚀 Guía Rápida de Uso

## Inicio Rápido

### 1. Instalación
```bash
npm install
npm run dev
```

### 2. Abrir en navegador
`http://localhost:5173`

---

## 📖 Cómo Usar la Aplicación

### Paso 1: Ver Eventos Pendientes
- La aplicación muestra automáticamente los eventos pendientes de revisión
- Usa las flechas `↑` `↓` para navegar
- Presiona `Enter` o haz clic en "Revisar"

### Paso 2: Confirmar Bloqueo
- Aparecerá un modal de confirmación
- Presiona `Y` o `Enter` para confirmar
- Presiona `N` o `Esc` para cancelar

### Paso 3: Ver Datos del Evento
- Se muestran automáticamente:
  - Información general (fecha, magnitud, coordenadas)
  - Datos registrados (clasificación, origen, alcance)
  - Sismogramas por estación
- Presiona `Enter` para continuar

### Paso 4: Pregunta sobre Mapa
- "¿Desea visualizar el mapa?"
- Solo funciona la opción `No` (presiona `N`)
- (Función no implementada según requisitos)

### Paso 5: Pregunta sobre Modificación
- "¿Desea modificar los datos?"
- Solo funciona la opción `No` (presiona `N`)
- (Función no implementada según requisitos)

### Paso 6: Seleccionar Acción
- Se muestran 3 opciones:
  1. **Confirmar Evento** (no implementado)
  2. **Rechazar Evento** ✅ (implementado)
  3. **Solicitar Revisión a Experto** (no implementado)
- Presiona `R` o `1` para rechazar

### Paso 7: Confirmar Rechazo
- Aparecerá un modal de confirmación
- Presiona `Y` o `Enter` para confirmar el rechazo
- El evento cambiará a estado "RECHAZADO"

### Paso 8: Fin del Caso de Uso
- Verás el mensaje: "✓ Fin Caso de Uso"
- Presiona `Enter` para volver a la lista

---

## ⌨️ Atajos de Teclado Completos

| Contexto | Tecla | Acción |
|----------|-------|--------|
| Lista de eventos | `↑` `↓` | Navegar |
| Lista de eventos | `Enter` | Seleccionar |
| Lista de eventos | `Ctrl+R` | Actualizar |
| Confirmación | `Y` o `Enter` | Confirmar |
| Confirmación | `N` o `Esc` | Cancelar |
| Detalles | `Enter` | Continuar |
| Detalles | `N` | Responder No |
| Acciones | `R` o `1` | Rechazar |

---

## 📸 Capturas de Flujo

### Vista 1: Lista de Eventos
```
┌─────────────────────────────────────────────┐
│  🔍 Eventos Sísmicos Pendientes de Revisión │
├─────────────────────────────────────────────┤
│  ID  │  Fecha/Hora  │  Magnitud  │  Coords  │
│   1  │  01/11 14:30 │    5.2     │ -32,-68  │
│   2  │  03/11 09:15 │    4.8     │ -31,-68  │
└─────────────────────────────────────────────┘
```

### Vista 2: Confirmación de Bloqueo
```
┌─────────────────────────────────────┐
│  🔒 Confirmar Bloqueo de Evento     │
├─────────────────────────────────────┤
│  ¿Desea bloquear el evento #1?      │
│                                     │
│  [✓ Bloquear (Y)]  [✗ Cancelar (N)]│
└─────────────────────────────────────┘
```

### Vista 3: Detalles del Evento
```
┌────────────────────────────────────────┐
│  📋 Detalles del Evento Sísmico        │
├────────────────────────────────────────┤
│  Información General                   │
│  • Magnitud: 5.2                       │
│  • Coordenadas: -32.8895,-68.8458      │
│                                        │
│  Datos Registrados                     │
│  • Clasificación: Tectónico            │
│  • Origen: Natural                     │
│                                        │
│  Sismogramas por Estación              │
│  📡 Estación Mendoza Centro            │
│  📡 Estación San Juan Norte            │
└────────────────────────────────────────┘
```

### Vista 4: Seleccionar Acción
```
┌────────────────────────────────────┐
│  ⚡ Seleccione una acción:          │
├────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │   1   Confirmar Evento      │   │
│  │       (No implementado)     │   │
│  └─────────────────────────────┘   │
│                                    │
│  ┌─────────────────────────────┐   │
│  │   2   Rechazar Evento       │   │
│  │       (Presione R o 1) ✓    │   │
│  └─────────────────────────────┘   │
└────────────────────────────────────┘
```

### Vista 5: Finalización
```
┌────────────────────────────────────┐
│           ✓                        │
│  Evento Rechazado Exitosamente     │
│                                    │
│  ✓ Fin Caso de Uso                 │
│                                    │
│  [Volver a la lista (Enter)]       │
└────────────────────────────────────┘
```

---

## 🎯 Flujo Completo en 30 Segundos

1. `npm run dev` → Iniciar app
2. `↓` → Navegar a evento
3. `Enter` → Seleccionar
4. `Y` → Confirmar bloqueo
5. `Enter` → Ver datos
6. `N` → No ver mapa
7. `N` → No modificar
8. `R` → Rechazar evento
9. `Y` → Confirmar rechazo
10. `Enter` → Volver a lista

**¡Listo! Caso de uso completado.**

---

## ⚠️ Problemas Comunes

### El backend no responde
```bash
# Verifica que esté corriendo en puerto 8080
curl http://localhost:8080/
```

### No aparecen eventos
- Verifica que existan eventos en estados:
  - `PTE_DE_REVISION`
  - `AUTO_DETECTADO`

### Error al bloquear evento
- Otro usuario puede haberlo bloqueado ya
- Intenta con otro evento

---

## 💡 Tips

- **Usa el teclado**: Es más rápido que el mouse
- **Ctrl+R**: Actualiza la lista en cualquier momento
- **Esc**: Cancela cualquier operación
- **Enter**: Siempre avanza al siguiente paso

---

## 📞 Soporte

Si encuentras problemas:
1. Revisa la consola del navegador (F12)
2. Verifica que el backend esté corriendo
3. Lee los mensajes de error en pantalla
4. Consulta `README_APP.md` para más detalles

---

**¡Disfruta usando el Sistema de Gestión de Eventos Sísmicos!** 🌍
