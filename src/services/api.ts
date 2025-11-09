// API Service
import type {
  EventoSismicoSinRevisionDTO,
  DatosRegistradosDTO,
  SismogramaDTO,
} from '../types/api';

// Use empty string in development (proxy handles it), or env variable for production
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const api = {
  // 1. List events pending review
  getEventosSinRevision: async (): Promise<EventoSismicoSinRevisionDTO[]> => {
    const response = await fetch(`${BASE_URL}/api/eventos/sin-revision`);
    if (!response.ok) {
      throw new Error('Failed to fetch events pending review');
    }
    return response.json();
  },

  // 2. Take event for review
  tomarEvento: async (eventoId: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/eventos/tomar-evento`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ eventoId }),
    });
    if (!response.ok) {
      throw new Error('Failed to take event for review');
    }
  },

  // 3. Get registered data
  getDatosRegistrados: async (eventoId: number): Promise<DatosRegistradosDTO> => {
    const response = await fetch(`${BASE_URL}/api/eventos/${eventoId}/datos-registrados`);
    if (!response.ok) {
      throw new Error('Failed to fetch registered data');
    }
    return response.json();
  },

  // 4. Get seismograms by station
  getSismogramas: async (eventoId: number): Promise<SismogramaDTO[]> => {
    const response = await fetch(`${BASE_URL}/api/eventos/${eventoId}/sismogramas`);
    if (!response.ok) {
      throw new Error('Failed to fetch seismograms');
    }
    return response.json();
  },

  // 5. Reject event
  rechazarEvento: async (eventoId: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/eventos/${eventoId}/rechazar`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to reject event');
    }
  },
};
