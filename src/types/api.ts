// API Type Definitions

export interface EventoSismicoSinRevisionDTO {
  id: number;
  fechaHoraOcurrencia: string;
  valorMagnitud: number;
  coordenadas: string;
}

export interface DatosRegistradosDTO {
  clasificacion: string;
  origen: string;
  alcance: string;
  clasificacionRichter: string;
}

export interface VelocidadLongitudDeFrecuencia {
  longitud: number;
  frecuencia: number;
  velocidad: number;
}

export interface SismogramaDTO {
  estacion: string;
  datos: VelocidadLongitudDeFrecuencia[];
}

export const EstadoEnum = {
  CERRADO: "Cerrado",
  ANULADO: "Anulado",
  CONFIRMADO: "Confirmado",
  DERIVADO: "Derivado",
  RECHAZADO: "Rechazado",
  PTE_DE_CIERRE: "PteDeCierre",
  AUTO_CONFIRMADO: "AutoConfirmado",
  PTE_DE_REVISION: "PteDeRevision",
  AUTO_DETECTADO: "AutoDetectado",
  BLOQUEADO_EN_REVISION: "BloqueadoEnRevision"
} as const;

export type EstadoEnum = typeof EstadoEnum[keyof typeof EstadoEnum];

export interface EventoSismicoDTO {
  id: number;
  fechaHoraOcurrencia: string;
  coordenadas: string;
  valorMagnitud: number;
  estadoActual: EstadoEnum;
  estadoDescripcion: string;
  magnitudRichterDescripcion: string | null;
  magnitudRichterValor: number | null;
  clasificacion: string | null;
  origen: string | null;
  alcance: string | null;
  radioAlcanceKm: number | null;
  fechaUltimoCambioEstado: string | null;
}
