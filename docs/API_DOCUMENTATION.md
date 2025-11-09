# Seismic Events Management API - Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Examples](#examples)

---

## Overview

This REST API manages seismic events, allowing users to:
- List seismic events pending review
- Take control of an event for manual review
- Retrieve recorded seismic data
- Generate seismograms by station
- Reject events
- List all events with detailed information

**Technology Stack:**
- Java Spring Boot
- SQLite Database
- REST API with JSON responses

---

## Base URL

```
http://localhost:8080
```

**Default Port:** `8080`

---

## Authentication

⚠️ **Current Status:** The API is running in **MOCK mode** without real authentication.

- A mock user "Analista de sismos" is automatically created in the database
- Sessions are managed internally without requiring login
- In production, this should be replaced with Spring Security (JWT, OAuth2, etc.)

---

## Endpoints

### 1. Health Check

**GET** `/`

Simple endpoint to verify the API is running.

**Response:**
```
200 OK
Content-Type: text/plain

"Greetings from Spring Boot!"
```

---

### 2. List All Events

**GET** `/api/eventos/`

Returns a list of all seismic events with complete details including state.

**Response:**
```json
200 OK
Content-Type: application/json

[
  {
    "id": 1,
    "fechaHoraOcurrencia": "2024-11-01T14:30:00",
    "coordenadas": "-32.8895,-68.8458",
    "valorMagnitud": 5.2,
    "estadoActual": "PTE_DE_REVISION",
    "estadoDescripcion": "PteDeRevision",
    "clasificacion": "Tectónico",
    "origen": "Natural",
    "alcance": "Regional",
    "radioAlcanceKm": 1000.0,
    "fechaUltimoCambioEstado": "2024-11-01T14:35:00"
  }
]
```

**Use Case:** Display all events in a dashboard or main listing.

---

### 3. List Events Pending Review

**GET** `/api/eventos/eventos-sin-revision`

Returns seismic events that require manual review (states: `PTE_DE_REVISION` or `AUTO_DETECTADO`).

**Response:**
```json
200 OK
Content-Type: application/json

[
  {
    "id": 1,
    "fechaHoraOcurrencia": "2024-11-01T14:30:00",
    "valorMagnitud": 5.2,
    "coordenadas": "-32.8895,-68.8458"
  },
  {
    "id": 2,
    "fechaHoraOcurrencia": "2024-11-03T09:15:00",
    "valorMagnitud": 4.8,
    "coordenadas": "-31.5375,-68.5364"
  }
]
```

**Use Case:** Show analysts which events need their attention.

---

### 4. Take Event for Review

**POST** `/api/eventos/tomar-evento`

Locks an event for manual review by the current user, changing its state to `BLOQUEADO_EN_REVISION`.

**Request Body:**
```json
{
  "eventoId": 1
}
```

**Responses:**

**Success:**
```
201 Created
```

**Error - Invalid Event:**
```
400 Bad Request
```

**Possible Errors:**
- Event ID doesn't exist
- Event is already locked by another user
- Event is not in a reviewable state

**Use Case:** Analyst clicks "Review Event" button to start working on it.

---

### 5. Get Registered Data

**GET** `/api/eventos/{eventoId}/datos-registrados`

Retrieves the classification, origin, and scope data for a specific seismic event.

**Path Parameters:**
- `eventoId` (Long): ID of the seismic event

**Response:**
```json
200 OK
Content-Type: application/json

{
  "clasificacion": "Tectónico",
  "origen": "Natural",
  "alcance": "Regional"
}
```

**Error Response:**
```
400 Bad Request
```

**Use Case:** Display basic classification details when reviewing an event.

---

### 6. Get Seismograms by Station

**GET** `/api/eventos/{eventoId}/sismogramas`

Retrieves seismographic data grouped by station for visualization.

**Path Parameters:**
- `eventoId` (Long): ID of the seismic event

**Response:**
```json
200 OK
Content-Type: application/json

[
  {
    "estacion": "Estación Mendoza Centro",
    "datos": [
      {
        "longitud": 15.0,
        "frecuencia": 100.0,
        "velocidad": 1.4
      },
      {
        "longitud": 15.5,
        "frecuencia": 103.0,
        "velocidad": 2.6
      }
    ]
  },
  {
    "estacion": "Estación San Juan Norte",
    "datos": [
      {
        "longitud": 12.0,
        "frecuencia": 200.0,
        "velocidad": 1.35
      }
    ]
  }
]
```

**Error Response:**
```
400 Bad Request
```

**Use Case:** Generate seismogram charts/graphs for visualization in the frontend.

---

### 7. Reject Event

**POST** `/api/eventos/{eventoId}/rechazar`

Rejects a seismic event, changing its state to `RECHAZADO`.

**Path Parameters:**
- `eventoId` (Long): ID of the seismic event to reject

**Responses:**

**Success:**
```
200 OK
```

**Error:**
```
400 Bad Request
```

**Possible Errors:**
- Event ID doesn't exist
- Event cannot be rejected in its current state

**Use Case:** Analyst determines an event is a false positive or not significant enough for review.

---

## Data Models

### EventoSismicoDTO (Complete)

Full event details with state information.

```typescript
interface EventoSismicoDTO {
  id: number;
  fechaHoraOcurrencia: string; // ISO 8601 datetime
  coordenadas: string; // Format: "latitude,longitude"
  valorMagnitud: number; // Richter scale
  estadoActual: EstadoEnum;
  estadoDescripcion: string;
  clasificacion: string | null;
  origen: string | null;
  alcance: string | null;
  radioAlcanceKm: number | null;
  fechaUltimoCambioEstado: string | null; // ISO 8601 datetime
}
```

### EventoSismicoSinRevisionDTO (Simplified)

Basic event information for listing.

```typescript
interface EventoSismicoSinRevisionDTO {
  id: number;
  fechaHoraOcurrencia: string; // ISO 8601 datetime
  valorMagnitud: number;
  coordenadas: string;
}
```

### DatosRegistradosDTO

Classification and characteristics of a seismic event.

```typescript
interface DatosRegistradosDTO {
  clasificacion: string;
  origen: string;
  alcance: string;
}
```

### SismogramaDTO

Seismographic data grouped by station.

```typescript
interface SismogramaDTO {
  estacion: string;
  datos: VelocidadLongitudDeFrecuencia[];
}
```

### VelocidadLongitudDeFrecuencia

Individual seismic measurement data point.

```typescript
interface VelocidadLongitudDeFrecuencia {
  longitud: number;   // Wave length
  frecuencia: number; // Wave frequency
  velocidad: number;  // Wave velocity
}
```

### EstadoEnum

Possible states for a seismic event.

```typescript
enum EstadoEnum {
  CERRADO = "Cerrado",                          // Closed
  ANULADO = "Anulado",                          // Cancelled
  CONFIRMADO = "Confirmado",                    // Confirmed
  DERIVADO = "Derivado",                        // Forwarded
  RECHAZADO = "Rechazado",                      // Rejected
  PTE_DE_CIERRE = "PteDeCierre",               // Pending Closure
  AUTO_CONFIRMADO = "AutoConfirmado",           // Auto-confirmed
  PTE_DE_REVISION = "PteDeRevision",           // Pending Review
  AUTO_DETECTADO = "AutoDetectado",             // Auto-detected
  BLOQUEADO_EN_REVISION = "BloqueadoEnRevision" // Locked for Review
}
```

**State Flow:**
```
AUTO_DETECTADO → (review needed)
    ↓
PTE_DE_REVISION → (analyst takes event)
    ↓
BLOQUEADO_EN_REVISION → (analyst reviews)
    ↓
    ├─→ CONFIRMADO (approved)
    ├─→ RECHAZADO (rejected)
    └─→ DERIVADO (forwarded to specialist)
```

---

## Error Handling

### HTTP Status Codes

| Status Code | Meaning | When it occurs |
|-------------|---------|----------------|
| `200 OK` | Success | Request processed successfully |
| `201 Created` | Created | Resource created (e.g., event locked) |
| `400 Bad Request` | Client Error | Invalid request data or business rule violation |
| `500 Internal Server Error` | Server Error | Unexpected server error |

### Error Response Format

When a `400 Bad Request` occurs, the API returns an empty body. The error is indicated by the HTTP status code only.

**Recommendation for Frontend:**
Display user-friendly error messages based on the context:

```javascript
// Example error handling
try {
  const response = await fetch('/api/eventos/tomar-evento', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventoId: 1 })
  });
  
  if (!response.ok) {
    if (response.status === 400) {
      alert('Unable to take event. It may already be locked or in an invalid state.');
    } else {
      alert('An unexpected error occurred.');
    }
  }
} catch (error) {
  console.error('Network error:', error);
}
```

---

## Examples

### Example 1: Complete Event Review Workflow

```javascript
// 1. Get events pending review
const response = await fetch('http://localhost:8080/api/eventos/eventos-sin-revision');
const events = await response.json();

// Display events to user, user selects event with ID 1

// 2. Take the event for review
await fetch('http://localhost:8080/api/eventos/tomar-evento', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ eventoId: 1 })
});

// 3. Get registered data
const dataResponse = await fetch('http://localhost:8080/api/eventos/1/datos-registrados');
const registeredData = await dataResponse.json();
console.log(`Classification: ${registeredData.clasificacion}`);

// 4. Get seismograms for visualization
const seismogramResponse = await fetch('http://localhost:8080/api/eventos/1/sismogramas');
const seismograms = await seismogramResponse.json();

// Generate charts for each station
seismograms.forEach(station => {
  console.log(`Station: ${station.estacion}`);
  station.datos.forEach(point => {
    console.log(`  Velocity: ${point.velocidad}, Frequency: ${point.frecuencia}`);
  });
});

// 5. User decides to reject the event
await fetch('http://localhost:8080/api/eventos/1/rechazar', {
  method: 'POST'
});
```

### Example 2: Display All Events Dashboard

```javascript
// Fetch all events
const response = await fetch('http://localhost:8080/api/eventos/');
const allEvents = await response.json();

// Group by state
const pendingReview = allEvents.filter(e => 
  e.estadoActual === 'PTE_DE_REVISION' || 
  e.estadoActual === 'AUTO_DETECTADO'
);

const confirmed = allEvents.filter(e => e.estadoActual === 'CONFIRMADO');
const rejected = allEvents.filter(e => e.estadoActual === 'RECHAZADO');

console.log(`Pending Review: ${pendingReview.length}`);
console.log(`Confirmed: ${confirmed.length}`);
console.log(`Rejected: ${rejected.length}`);
```

### Example 3: React Component Example

```jsx
import React, { useState, useEffect } from 'react';

function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/eventos/eventos-sin-revision');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const takeEvent = async (eventoId) => {
    try {
      const response = await fetch('http://localhost:8080/api/eventos/tomar-evento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventoId })
      });
      
      if (response.ok) {
        alert('Event taken successfully!');
        fetchEvents(); // Refresh list
      } else {
        alert('Failed to take event');
      }
    } catch (error) {
      console.error('Error taking event:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Events Pending Review</h1>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            <strong>Magnitude:</strong> {event.valorMagnitud} | 
            <strong> Location:</strong> {event.coordenadas} | 
            <strong> Time:</strong> {new Date(event.fechaHoraOcurrencia).toLocaleString()}
            <button onClick={() => takeEvent(event.id)}>Review</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventsList;
```

---

## CORS Configuration

⚠️ **Important:** If you're developing a frontend on a different port (e.g., React on `localhost:3000`), you'll need to configure CORS in the Spring Boot application.

Add to `application.properties`:
```properties
# Allow all origins (development only)
spring.web.cors.allowed-origins=*
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE
spring.web.cors.allowed-headers=*
```

Or configure it programmatically in Java:
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```

---

## Notes for Frontend Developers

### Date Handling
- All dates are in ISO 8601 format: `"2024-11-01T14:30:00"`
- Use `new Date()` in JavaScript or `dayjs`/`date-fns` for parsing
- Consider timezone differences if deploying to production

### Coordinates Format
- Format: `"latitude,longitude"` (string)
- Example: `"-32.8895,-68.8458"`
- Split by comma to get individual values for mapping

### State Colors (UI Suggestion)
```css
.state-PTE_DE_REVISION { color: orange; }
.state-AUTO_DETECTADO { color: blue; }
.state-BLOQUEADO_EN_REVISION { color: red; }
.state-CONFIRMADO { color: green; }
.state-RECHAZADO { color: gray; }
```

### Seismogram Visualization
The `sismogramas` endpoint provides data perfect for:
- Line charts (velocity over time)
- Frequency analysis graphs
- Multi-line comparison between stations

Recommended libraries:
- Chart.js
- D3.js
- Recharts (React)
- Apache ECharts

---

## Database Information

**Type:** SQLite  
**File:** `mydb.sqlite` (created in project root)  
**Auto-initialization:** YES - Sample data is automatically loaded on first run

### Sample Data Included:
- 5 seismic events with different states
- 4 seismic stations (Mendoza, San Juan, La Rioja, Catamarca)
- 5 seismographs
- Multiple temporal series with detailed samples
- Classification catalogs (Tectonic, Volcanic, Collapse)
- Origin types (Natural, Artificial)
- Scope types (Local, Regional, Teleseismic)

---

## Support & Contact

For questions or issues:
- Check the server logs in the terminal
- Verify the API is running: `curl http://localhost:8080/`
- Review this documentation for proper endpoint usage

**Happy Coding! 🚀**
