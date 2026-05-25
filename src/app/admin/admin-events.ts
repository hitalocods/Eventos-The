import { converterHorarioTexto, formatarGenero } from "./admin-format";
import type { AdminEvent, Attraction } from "./admin-types";

export function obterAtracoesDoEvento(evento: AdminEvent): Attraction[] {
  if (Array.isArray(evento.atracoes) && evento.atracoes.length) {
    return evento.atracoes;
  }

  return [
    {
      banda: evento.banda || "",
      genero: evento.genero || "pagode",
      horario: evento.horario || "",
      horarioInicio: evento.horarioInicio || converterHorarioTexto(evento.horario)
    }
  ];
}

export function formatarAtracoes(evento: AdminEvent) {
  return obterAtracoesDoEvento(evento)
    .map(
      (atracao) =>
        `${atracao.banda || "-"} (${formatarGenero(atracao.genero)} às ${
          atracao.horario || atracao.horarioInicio || "-"
        })`
    )
    .join(" · ");
}

export function formatarGenerosDoEvento(evento: AdminEvent) {
  const generos = obterAtracoesDoEvento(evento).map((atracao) =>
    formatarGenero(atracao.genero)
  );

  return [...new Set(generos)].join(", ") || "-";
}

export function formatarContatos(evento: AdminEvent) {
  const contatos = [];

  if (evento.instagram) {
    contatos.push("Instagram");
  }

  if (evento.whatsapp) {
    contatos.push("WhatsApp");
  }

  if (evento.linkIngressos) {
    contatos.push("Ingressos");
  }

  return contatos.join(", ") || "Não informado";
}

export function eventoCobraCouvert(evento: AdminEvent) {
  if (typeof evento.cobraCouvert === "boolean") {
    return evento.cobraCouvert;
  }

  return !eventoEhGratis(evento);
}

export function eventoEhGratis(evento: AdminEvent) {
  const valor = String(evento.valor || "").trim().toLowerCase();

  return (
    valor.includes("grátis") ||
    valor.includes("gratis") ||
    valor === "0" ||
    valor === "r$ 0,00"
  );
}

export function criarOpcoesGenero(valorSelecionado: unknown) {
  const generos = [
    ["pagode", "Pagode"],
    ["forró", "Forró"],
    ["sertanejo", "Sertanejo"],
    ["rock", "Rock"],
    ["mpb", "MPB"],
    ["k-pop", "K-pop"]
  ];

  return generos
    .map(([valor, rotulo]) => {
      const selected =
        String(valorSelecionado || "").trim().toLowerCase() === valor
          ? " selected"
          : "";
      return `<option value="${valor}"${selected}>${rotulo}</option>`;
    })
    .join("");
}

