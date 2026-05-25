export function formatarData(data: unknown) {
  if (!data) {
    return "-";
  }

  const [ano, mes, dia] = String(data).split("-");
  return dia && mes && ano ? `${dia}/${mes}/${ano}` : String(data);
}

export function formatarGenero(genero: unknown) {
  const generos: Record<string, string> = {
    pagode: "Pagode",
    "forró": "Forró",
    forro: "Forró",
    sertanejo: "Sertanejo",
    rock: "Rock",
    mpb: "MPB",
    "k-pop": "K-pop",
    kpop: "K-pop"
  };

  const valor = String(genero || "").trim().toLowerCase();
  return generos[valor] || String(genero || "-");
}

export function formatarPlano(plano: unknown) {
  const planos: Record<string, string> = {
    basico: "Básico",
    plus: "Plus"
  };

  const valor = String(plano || "").trim().toLowerCase();
  return planos[valor] || String(plano || "-");
}

export function formatarMoeda(valor: unknown) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

export function formatarStatus(status: unknown) {
  const statusMap: Record<string, string> = {
    ativo: "Ativo",
    prospect: "Prospect",
    pausado: "Pausado",
    cancelado: "Cancelado",
    encerrado: "Encerrado"
  };

  const valor = String(status || "ativo").trim().toLowerCase();
  return statusMap[valor] || String(status || "Ativo");
}

export function normalizarStatus(status: unknown) {
  return String(status || "ativo").trim().toLowerCase();
}

export function converterHorarioTexto(horario: unknown) {
  const match = String(horario || "").match(/(\d{1,2})\D?(\d{2})?/);

  if (!match) {
    return "";
  }

  const hora = String(match[1]).padStart(2, "0");
  const minuto = String(match[2] || "00").padStart(2, "0");
  return `${hora}:${minuto}`;
}

export function formatarHorarioVisivel(horarioInicio: string) {
  if (!horarioInicio) {
    return "";
  }

  const [hora, minuto] = horarioInicio.split(":");
  return minuto === "00" ? `${Number(hora)}h` : `${hora}:${minuto}`;
}

export function formatarDataISO(data: Date) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

export function obterDataHoje() {
  return formatarDataISO(new Date());
}

export function obterDataRelativa(dias: number) {
  const data = new Date();
  data.setDate(data.getDate() + dias);
  return formatarDataISO(data);
}

export function limparCep(cep: unknown) {
  return String(cep || "").replace(/\D/g, "");
}

export function escaparHtml(valor: unknown) {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

