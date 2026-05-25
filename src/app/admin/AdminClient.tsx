'use client';

import { useEffect } from "react";
import { setupAdminDashboard } from "./admin-dashboard";
import { adminStyles } from "./admin-styles";

export function AdminClient() {
  useEffect(() => setupAdminDashboard(), []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: adminStyles }} />
      <header className="topbar">
          <h1>Admin - EventosThe</h1>
          <a href="/">Ver mapa</a>
        </header>
      
        <main className="container">
          <section className="panel" id="loginPanel">
            <h2>Acesso administrativo</h2>
            <p className="hint">Use o e-mail e senha cadastrados no Firebase Authentication. Esse painel alimenta o mapa em tempo real.</p>
            <p className="message error" id="loginMessage" role="alert"></p>
      
            <form id="loginForm">
              <div className="grid">
                <label>
                  E-mail
                  <input type="email" id="emailInput" autoComplete="email" required />
                </label>
                <label>
                  Senha
                  <input type="password" id="passwordInput" autoComplete="current-password" required />
                </label>
              </div>
              <div className="actions">
                <button type="submit" id="loginButton">Entrar</button>
              </div>
            </form>
          </section>
      
          <section className="panel hidden" id="adminPanel">
            <h2 id="formTitle">Cadastrar evento</h2>
            <p className="message" id="formMessage" role="status"></p>
      
            <form id="eventForm">
              <section className="form-section">
                <h3>Evento</h3>
                <div className="grid">
                  <label>
                    Data do evento
                    <input type="date" id="dataEvento" required />
                  </label>
      
                  <label>
                    Nome do estabelecimento
                    <input type="text" id="estabelecimento" required />
                  </label>
      
                  <div className="attractions-box">
                    <div className="attractions-header">
                      <h4>Atrações</h4>
                      <button type="button" className="secondary" id="addAttractionButton">Adicionar atração</button>
                    </div>
                    <div id="attractionsList"></div>
                  </div>
      
                  <label>
                    Valor
                    <input type="text" id="valor" placeholder="R$ 15,00 ou grátis" required />
                  </label>
      
                  <label>
                    Status
                    <select id="status" required>
                      <option value="ativo">Ativo</option>
                      <option value="cancelado">Cancelado</option>
                      <option value="encerrado">Encerrado</option>
                    </select>
                  </label>
                </div>
              </section>
      
              <section className="form-section">
                <h3>Local</h3>
                <div className="grid">
                  <label>
                    CEP
                    <input type="text" id="cep" inputMode="numeric" placeholder="64000-000" />
                  </label>
      
                  <label>
                    Número
                    <input type="text" id="numero" placeholder="123" />
                  </label>
      
                  <label>
                    Bairro
                    <input type="text" id="bairro" required />
                  </label>
      
                  <label>
                    Endereço completo
                    <input type="text" id="endereco" required />
                  </label>
      
                  <div className="inline-tools span-2">
                    <button type="button" className="secondary" id="cepButton">Buscar endereço pelo CEP</button>
                    <button type="button" className="secondary" id="coordsButton">Buscar coordenadas</button>
                    <button type="button" className="secondary" id="centerButton">Usar Centro de Teresina</button>
                  </div>
      
                  <details className="advanced-box">
                    <summary>Coordenadas avançadas</summary>
                    <div className="advanced-grid">
                      <label>
                        Latitude
                        <input type="number" id="latitude" step="any" placeholder="-5.08921" />
                      </label>
      
                      <label>
                        Longitude
                        <input type="number" id="longitude" step="any" placeholder="-42.80160" />
                      </label>
                    </div>
                  </details>
                </div>
              </section>
      
              <section className="form-section">
                <h3>Contato e venda</h3>
                <p className="hint">Campos opcionais. Use para levar o público ao Instagram do local, WhatsApp de informações ou página de ingressos.</p>
                <div className="grid">
                  <label>
                    Instagram do estabelecimento
                    <input type="text" id="instagram" placeholder="@eventosthe ou link do Instagram" />
                  </label>
      
                  <label>
                    WhatsApp para informações
                    <input type="tel" id="whatsapp" inputMode="tel" placeholder="86999990000" />
                  </label>
      
                  <label className="span-2">
                    Link de venda de ingresso
                    <input type="text" id="linkIngressos" placeholder="Link da página ou WhatsApp de vendas" />
                  </label>
                </div>
              </section>
      
              <label className="checkbox-label">
                <input type="checkbox" id="cobraCouvert" />
                Cobra couvert/entrada?
              </label>
      
              <label className="checkbox-label">
                <input type="checkbox" id="pagaDezPorCento" />
                Paga 10%?
              </label>
      
              <label className="checkbox-label">
                <input type="checkbox" id="destaque" />
                Evento em destaque?
              </label>
      
              <div className="actions">
                <button type="submit" id="saveButton">Salvar evento</button>
                <button type="button" className="secondary hidden" id="cancelEditButton">Cancelar edição</button>
                <button type="reset" className="ghost">Limpar</button>
                <button type="button" className="danger" id="logoutButton">Sair</button>
              </div>
            </form>
          </section>
      
          <section className="panel hidden" id="summaryPanel">
            <h2>Resumo da operação</h2>
            <div className="summary-grid" id="summaryGrid">
              <div className="summary-card"><strong>0</strong><span>Eventos hoje</span></div>
              <div className="summary-card"><strong>0</strong><span>Eventos amanhã</span></div>
              <div className="summary-card"><strong>0</strong><span>Destaques ativos</span></div>
              <div className="summary-card"><strong>0</strong><span>Eventos cancelados</span></div>
              <div className="summary-card"><strong>0</strong><span>Cliques em rotas</span></div>
              <div className="summary-card"><strong>0</strong><span>Compartilhamentos</span></div>
              <div className="summary-card"><strong>0</strong><span>Cliques no mapa</span></div>
              <div className="summary-card"><strong>0</strong><span>Eventos cadastrados</span></div>
            </div>
          </section>
      
          <section className="panel hidden" id="listPanel">
            <h2>Eventos cadastrados</h2>
            <p className="message error" id="listMessage" role="alert"></p>
            <div className="event-list" id="eventList">
              <p className="empty-state">Carregando eventos...</p>
            </div>
          </section>
      
          <section className="panel hidden" id="masterPanel">
            <h2>Admin master</h2>
            <p className="hint">Painel comercial privado para acompanhar visitas, planos e estabelecimentos.</p>
      
            <div className="summary-grid" id="businessSummary">
              <div className="summary-card"><strong>0</strong><span>Estabelecimentos ativos</span></div>
              <div className="summary-card"><strong>0</strong><span>Plano básico</span></div>
              <div className="summary-card"><strong>0</strong><span>Plano plus</span></div>
              <div className="summary-card"><strong>R$ 0</strong><span>Receita mensal prevista</span></div>
            </div>
      
            <form id="businessForm" style={{ marginTop: "14px" }}>
              <div className="grid">
                <label>
                  Estabelecimento
                  <input type="text" id="businessName" required />
                </label>
      
                <label>
                  Contato
                  <input type="text" id="businessContact" placeholder="WhatsApp, Instagram ou responsável" />
                </label>
      
                <label>
                  Plano
                  <select id="businessPlan" required>
                    <option value="basico">Básico - cliente cadastra eventos</option>
                    <option value="plus">Plus - EventosThe cadastra e dá destaque</option>
                  </select>
                </label>
      
                <label>
                  Valor mensal
                  <input type="number" id="businessValue" min="0" step="0.01" placeholder="0" />
                </label>
      
                <label>
                  Status
                  <select id="businessStatus" required>
                    <option value="ativo">Ativo</option>
                    <option value="prospect">Prospect</option>
                    <option value="pausado">Pausado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </label>
      
                <label className="checkbox-label">
                  <input type="checkbox" id="businessHighlight" />
                  Ganha destaque?
                </label>
              </div>
      
              <div className="actions">
                <button type="submit" id="businessSaveButton">Salvar estabelecimento</button>
                <button type="button" className="secondary hidden" id="cancelBusinessEditButton">Cancelar edição</button>
                <button type="reset" className="ghost">Limpar</button>
              </div>
            </form>
      
            <div className="event-list" id="businessList" style={{ marginTop: "14px" }}>
              <p className="empty-state">Nenhum estabelecimento cadastrado.</p>
            </div>
          </section>
        </main>
    </>
  );
}
