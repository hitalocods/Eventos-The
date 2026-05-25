"use client";

import { useEffect } from "react";
import { setupHomePage } from "./home-dashboard";
import { homeStyles } from "./home-styles";

export function HomeClient() {
  useEffect(() => setupHomePage(), []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: homeStyles }} />
      <header className="topbar">
        <div className="brand">
          <h1>EventosThe</h1>
          <p>Rolês com música ao vivo em Teresina</p>
        </div>
        <button
          className="icon-button"
          id="locationButton"
          type="button"
          aria-label="Centralizar na minha localização"
        >
          ⌖
        </button>
      </header>

      <main>
        <div id="map" aria-label="Mapa com eventos de música ao vivo" />

        <section className="date-tabs" aria-label="Filtros por data">
          <button className="date-button active" type="button" data-periodo="hoje">
            Hoje
          </button>
          <button className="date-button" type="button" data-periodo="amanha">
            Amanhã
          </button>
          <button className="date-button" type="button" data-periodo="semana">
            Esta semana
          </button>
          <button className="date-button" type="button" data-periodo="todos">
            Todos
          </button>
        </section>

        <section className="date-picker-row" aria-label="Escolher data específica">
          <label>
            Data
            <input type="date" id="customDateInput" />
          </label>
          <button className="date-button" type="button" id="clearDateButton">
            Limpar filtros
          </button>
        </section>

        <section className="filters" aria-label="Filtros por gênero musical">
          <button className="filter-button active" type="button" data-genero="todos">
            Todos
          </button>
          <button className="filter-button" type="button" data-genero="pagode">
            Pagode
          </button>
          <button className="filter-button" type="button" data-genero="forró">
            Forró
          </button>
          <button className="filter-button" type="button" data-genero="sertanejo">
            Sertanejo
          </button>
          <button className="filter-button" type="button" data-genero="rock">
            Rock
          </button>
          <button className="filter-button" type="button" data-genero="mpb">
            MPB
          </button>
          <button className="filter-button" type="button" data-genero="k-pop">
            K-pop
          </button>
        </section>

        <section className="quick-search" aria-label="Busca rápida">
          <input
            type="search"
            id="bairroSearch"
            placeholder="Buscar banda, local ou bairro"
          />
          <label>
            <input type="checkbox" id="gratisFilter" />
            Grátis
          </label>
        </section>

        <section className="content">
          <div className="message" id="messageBox" role="status" />
          <div className="section-title">
            <h2 id="listTitle">Rolês de hoje</h2>
            <span className="event-count" id="eventCount">
              Carregando eventos...
            </span>
          </div>
          <div className="event-list" id="eventList" />
        </section>
      </main>

      <a className="ambassador-link" href="/patrocinadores">
        Patrocinadores
      </a>
      <a className="admin-link" href="/admin">
        Admin
      </a>

      <nav className="bottom-nav" aria-label="Navegação principal">
        <a className="active" href="/">
          Explorar
        </a>
        <a href="#map" id="mapNavButton">
          Mapa
        </a>
        <a href="/patrocinadores">
          Patrocinadores
        </a>
        <a href="/admin">
          Admin
        </a>
      </nav>
    </>
  );
}
