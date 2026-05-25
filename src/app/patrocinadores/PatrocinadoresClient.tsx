"use client";

import { FormEvent, useState } from "react";
import { patrocinadoresStyles } from "./patrocinadores-styles";

const WHATSAPP_DESTINO = "5586999990000";

export function PatrocinadoresClient() {
  const [messageVisible, setMessageVisible] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nome = String(formData.get("nome") || "").trim();
    const contato = String(formData.get("contato") || "").trim();
    const plano = String(formData.get("plano") || "").trim();
    const objetivo = String(formData.get("objetivo") || "").trim();
    const observacao = String(formData.get("observacao") || "").trim();

    const mensagem = [
      "Oi! Quero patrocinar o EventosThe.",
      "",
      `Estabelecimento: ${nome}`,
      `Contato: ${contato}`,
      `Plano de interesse: ${plano}`,
      `Objetivo: ${objetivo}`,
      "",
      `Observacao: ${observacao || "-"}`
    ].join("\n");

    setMessageVisible(true);
    window.open(
      `https://wa.me/${WHATSAPP_DESTINO}?text=${encodeURIComponent(mensagem)}`,
      "_blank",
      "noopener"
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: patrocinadoresStyles }} />
      <header className="sponsor-topbar">
        <div className="sponsor-brand">
          <h1>Patrocinadores EventosThe</h1>
          <p>Planos para bares, casas de show e marcas locais</p>
        </div>
        <a className="sponsor-link dark" href="/">
          Ver eventos
        </a>
      </header>

      <main className="sponsor-page">
        <section className="sponsor-hero">
          <div className="sponsor-copy">
            <p className="sponsor-eyebrow">Midia local para musica ao vivo</p>
            <h2>Sua casa aparece onde o publico decide o role.</h2>
            <p>
              O EventosThe conecta pessoas que querem sair hoje com os lugares
              que tem musica, promocao, couvert, ingresso e agenda ativa em
              Teresina.
            </p>
            <div className="sponsor-actions" style={{ marginTop: 16 }}>
              <a className="sponsor-button primary" href="#contato">
                Quero patrocinar
              </a>
              <a className="sponsor-link" href="/">
                Ver mapa
              </a>
            </div>
          </div>
          <div className="sponsor-media">
            <img src="/preview.png" alt="Preview do EventosThe no mapa" />
          </div>
        </section>

        <section className="sponsor-grid" aria-label="Planos de patrocinio">
          <article className="sponsor-card">
            <h3>Presenca</h3>
            <div className="sponsor-price">R$ 49/mês</div>
            <p>Para estabelecimentos que querem manter agenda visivel.</p>
            <ul>
              <li>Eventos no mapa</li>
              <li>Link para rota e contato</li>
              <li>Listagem por data e genero</li>
            </ul>
          </article>

          <article className="sponsor-card featured">
            <h3>Destaque</h3>
            <div className="sponsor-price">R$ 99/mês</div>
            <p>Para casas que querem mais visibilidade nos dias fortes.</p>
            <ul>
              <li>Evento destacado na lista</li>
              <li>Pin com cor especial no mapa</li>
              <li>Prioridade na curadoria</li>
            </ul>
          </article>

          <article className="sponsor-card">
            <h3>Parceiro</h3>
            <div className="sponsor-price">Sob consulta</div>
            <p>Para marcas, produtores e campanhas sazonais.</p>
            <ul>
              <li>Campanhas por periodo</li>
              <li>Ativacao com eventos</li>
              <li>Relatorio comercial</li>
            </ul>
          </article>
        </section>

        <section className="sponsor-strip" aria-label="Beneficios">
          <div>
            <strong>Publico pronto para sair</strong>
            <span>Quem entra no mapa ja esta procurando programacao.</span>
          </div>
          <div>
            <strong>Dados de clique</strong>
            <span>Acompanhe rotas, compartilhamentos e interesse nos eventos.</span>
          </div>
          <div>
            <strong>Agenda organizada</strong>
            <span>Eventos, horarios, bandas e contato ficam em um so lugar.</span>
          </div>
        </section>

        <section className="sponsor-panel" id="contato">
          <h3>Fale com o comercial</h3>
          <p>
            Envie os dados do estabelecimento. A conversa continua no WhatsApp
            para confirmar valores, forma de pagamento e melhor plano.
          </p>

          <form className="sponsor-form" onSubmit={handleSubmit}>
            <p
              className={`sponsor-message${messageVisible ? " show" : ""}`}
              role="status"
            >
              Abrindo WhatsApp com sua solicitacao comercial.
            </p>

            <div className="sponsor-form-grid">
              <label>
                Estabelecimento
                <input name="nome" type="text" required />
              </label>

              <label>
                WhatsApp ou Instagram
                <input
                  name="contato"
                  type="text"
                  placeholder="@local ou 86999990000"
                  required
                />
              </label>

              <label>
                Plano
                <select name="plano" required defaultValue="">
                  <option value="" disabled>
                    Escolha um plano
                  </option>
                  <option>Presenca</option>
                  <option>Destaque</option>
                  <option>Parceiro</option>
                  <option>Ainda nao sei</option>
                </select>
              </label>

              <label>
                Objetivo
                <select name="objetivo" required defaultValue="">
                  <option value="" disabled>
                    O que voce quer melhorar?
                  </option>
                  <option>Divulgar eventos toda semana</option>
                  <option>Ganhar destaque em dias especificos</option>
                  <option>Vender ingressos ou reservas</option>
                  <option>Fazer campanha de marca</option>
                </select>
              </label>

              <label className="sponsor-span-2">
                Observacao
                <textarea
                  name="observacao"
                  placeholder="Ex: temos musica ao vivo de quinta a domingo, queremos aparecer nos filtros de pagode e forro..."
                />
              </label>
            </div>

            <div className="sponsor-actions">
              <button className="sponsor-button primary" type="submit">
                Enviar pelo WhatsApp
              </button>
              <a className="sponsor-link" href="/">
                Voltar para eventos
              </a>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}

