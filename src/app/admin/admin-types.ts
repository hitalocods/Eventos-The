export type AdminEvent = Record<string, any> & { id: string };

export type Business = Record<string, any> & { id: string };

export type Metrics = Record<string, any>;

export type Attraction = {
  banda?: string;
  genero?: string;
  horario?: string;
  horarioInicio?: string;
};

