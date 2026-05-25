// @ts-nocheck
import {
      getFirestore,
      collection,
      onSnapshot,
      doc,
      setDoc,
      updateDoc,
      increment,
      serverTimestamp
    } from "firebase/firestore";
import { getFirebaseClient } from "./admin/firebase-client";


    const TERESINA_CENTRO = [-5.08921, -42.80160];
    const DEFAULT_ZOOM = 14;

    let map;
    let L;
    let markersLayer;
    let userMarker;
    const eventMarkers = new Map();
    let db;
    let eventos = [];
    let filtroAtual = "todos";
    let periodoAtual = "hoje";
    let dataEscolhida = "";
    let buscaTexto = "";
    let somenteGratis = false;
    let eventoCompartilhadoId = null;

    let cleanupHomePage = null;
let eventController = null;
let unsubscribeEventos = null;

export function setupHomePage() {
  cleanupHomePage?.();
  eventController = new AbortController();
  iniciarHomePage();
  cleanupHomePage = () => {
    eventController?.abort();
    eventController = null;
    if (unsubscribeEventos) {
      unsubscribeEventos();
      unsubscribeEventos = null;
    }
    if (map) {
      map.remove();
      map = null;
    }
  };
  return cleanupHomePage;
}

async function iniciarHomePage() {
      L = await import("leaflet");
      if (!eventController) {
        return;
      }
      eventoCompartilhadoId = new URLSearchParams(window.location.search).get("evento");
      iniciarMapa();
      configurarFiltros();
      configurarPeriodos();
      configurarDataEscolhida();
      configurarBusca();
      configurarBotaoMapa();
      configurarBotaoLocalizacao();
      carregarEventos();
}

    function iniciarMapa() {
      map = L.map("map", { zoomControl: true }).setView(TERESINA_CENTRO, DEFAULT_ZOOM);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      markersLayer = L.layerGroup().addTo(map);
      centralizarNaLocalizacaoAtual();
    }

    function configurarBusca() {
      document.getElementById("bairroSearch").addEventListener("input", (event) => {
        buscaTexto = normalizarTexto(event.target.value);
        atualizarTela();
      });

      document.getElementById("gratisFilter").addEventListener("change", (event) => {
        somenteGratis = event.target.checked;
        atualizarTela();
      });
    }

    function configurarFiltros() {
      document.querySelectorAll(".filter-button").forEach((button) => {
        button.addEventListener("click", () => {
          filtroAtual = button.dataset.genero;
          document.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("active"));
          button.classList.add("active");
          atualizarTela();
        });
      });
    }

    function configurarPeriodos() {
      document.querySelectorAll(".date-button").forEach((button) => {
        if (!button.dataset.periodo) {
          return;
        }

        button.addEventListener("click", () => {
          periodoAtual = button.dataset.periodo;
          dataEscolhida = "";
          document.getElementById("customDateInput").value = "";
          document.querySelectorAll(".date-button").forEach((item) => item.classList.remove("active"));
          button.classList.add("active");
          atualizarTela();
        });
      });
    }

    function configurarDataEscolhida() {
      document.getElementById("customDateInput").addEventListener("change", (event) => {
        dataEscolhida = event.target.value;

        if (!dataEscolhida) {
          return;
        }

        periodoAtual = "data";
        document.querySelectorAll(".date-button").forEach((item) => item.classList.remove("active"));
        atualizarTela();
      });

      document.getElementById("clearDateButton").addEventListener("click", () => {
        dataEscolhida = "";
        periodoAtual = "hoje";
        document.getElementById("customDateInput").value = "";
        document.querySelectorAll(".date-button").forEach((item) => item.classList.remove("active"));
        document.querySelector('[data-periodo="hoje"]').classList.add("active");
        atualizarTela();
      });
    }

    function configurarBotaoLocalizacao() {
      document.getElementById("locationButton").addEventListener("click", centralizarNaLocalizacaoAtual);
    }

    function configurarBotaoMapa() {
      document.getElementById("mapNavButton")?.addEventListener("click", (event) => {
        event.preventDefault();
        rolarParaMapa();
        setTimeout(() => {
          map.invalidateSize();
        }, 260);
      });
    }

    function centralizarNaLocalizacaoAtual() {
      if (!navigator.geolocation) {
        mostrarMensagem("Seu navegador não oferece geolocalização. O mapa foi centralizado no Centro de Teresina.");
        map.setView(TERESINA_CENTRO, DEFAULT_ZOOM);
        return;
      }

      mostrarMensagem("Tentando acessar sua localização...");
      tentarGeolocalizacao(false, 15000)
        .catch(() => tentarGeolocalizacao(true, 20000))
        .catch(() => {
          mostrarMensagem("Não foi possível acessar sua localização. Verifique se a localização do aparelho/navegador está ativa. O mapa ficou no Centro de Teresina.");
          map.setView(TERESINA_CENTRO, DEFAULT_ZOOM);
        });
    }

    function tentarGeolocalizacao(enableHighAccuracy, timeout) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLatLng = [position.coords.latitude, position.coords.longitude];
            map.setView(userLatLng, DEFAULT_ZOOM);

            if (userMarker) {
              map.removeLayer(userMarker);
            }

            userMarker = L.circleMarker(userLatLng, {
              radius: 8,
              color: "#0f5e9c",
              fillColor: "#0f5e9c",
              fillOpacity: 0.85
            }).addTo(map).bindPopup("Você está aqui");

            esconderMensagem();
            resolve(position);
          },
          reject,
          {
            enableHighAccuracy,
            timeout,
            maximumAge: 300000
          }
        );
      });
    }

    function carregarEventos() {
      try {
        const firebase = getFirebaseClient();
        db = firebase.db;
        const eventosRef = collection(db, "eventos");

        unsubscribeEventos = onSnapshot(
          eventosRef,
          (snapshot) => {
            eventos = snapshot.docs.map((documento) => ({
              id: documento.id,
              ...documento.data()
            }));
            esconderMensagem();
            atualizarTela();
            registrarVisita();
          },
          (error) => {
            console.error("Erro ao carregar eventos:", error);
            mostrarMensagem("Não foi possível carregar os eventos agora. Confira a configuração do Firebase e tente novamente.");
            atualizarContador(0);
            renderizarLista([]);
          }
        );
      } catch (error) {
        console.error("Erro ao iniciar Firebase:", error);
        mostrarMensagem("Não foi possível conectar ao Firebase. Confira suas credenciais no início do script.");
        atualizarContador(0);
        renderizarLista([]);
      }
    }

    function atualizarTela() {
      const eventosFiltrados = filtrarEventos();
      adicionarMarcadores(eventosFiltrados);
      renderizarLista(eventosFiltrados);
      atualizarContador(eventosFiltrados.length);
      focarEventoCompartilhado();
    }

    function filtrarEventos() {
      const intervalo = obterIntervaloPeriodo();

      return eventos.filter((evento) => {
        if (evento.id === eventoCompartilhadoId) {
          return true;
        }

        const dataEvento = evento.dataEvento || obterDataHoje();
        const generoConfere = filtroAtual === "todos" || obterGenerosDoEvento(evento).includes(filtroAtual);
        const dataConfere = dataEscolhida
          ? dataEvento === dataEscolhida
          : periodoAtual === "todos" || (dataEvento >= intervalo.inicio && dataEvento <= intervalo.fim);
        const buscaConfere = eventoConfereBusca(evento);
        const gratisConfere = !somenteGratis || eventoEhGratis(evento);
        const statusConfere = normalizarStatus(evento.status) !== "cancelado";
        return dataConfere && generoConfere && buscaConfere && gratisConfere && statusConfere;
      }).sort(ordenarEventos);
    }

    function eventoConfereBusca(evento) {
      if (!buscaTexto) {
        return true;
      }

      const atracoes = obterAtracoesDoEvento(evento)
        .map((atracao) => `${atracao.banda || ""} ${formatarGenero(atracao.genero)} ${atracao.horario || ""}`)
        .join(" ");

      const textoEvento = [
        evento.estabelecimento,
        evento.banda,
        evento.genero,
        evento.bairro,
        evento.endereco,
        evento.valor,
        atracoes
      ].join(" ");

      return normalizarTexto(textoEvento).includes(buscaTexto);
    }

    function adicionarMarcadores(eventosFiltrados) {
      markersLayer.clearLayers();
      eventMarkers.clear();

      eventosFiltrados
        .filter(temCoordenadasValidas)
        .forEach((evento) => {
          const marker = L.circleMarker([Number(evento.latitude), Number(evento.longitude)], {
            radius: 9,
            color: "#1463ff",
            fillColor: evento.destaque ? "#ff6b35" : "#1463ff",
            fillOpacity: 0.9,
            weight: 3
          });
          marker.bindPopup(criarPopup(evento));
          marker.addTo(markersLayer);
          eventMarkers.set(evento.id, marker);
        });
    }

    function renderizarLista(eventosFiltrados) {
      const eventList = document.getElementById("eventList");
      eventList.innerHTML = "";

      if (eventosFiltrados.length === 0) {
        eventList.innerHTML = `<p class="empty-state">Nenhum evento encontrado para ${escaparHtml(obterRotuloPeriodo()).toLowerCase()} com esse filtro. Quando você cadastrar no admin, ele aparece aqui e no mapa em tempo real.</p>`;
        return;
      }

      eventosFiltrados.forEach((evento) => {
        const card = document.createElement("article");
        card.id = `evento-${evento.id}`;
        card.className = `event-card${evento.destaque ? " highlight" : ""}${normalizarStatus(evento.status) === "cancelado" ? " cancelled" : ""}`;
        const primeiraAtracao = obterAtracoesDoEvento(evento)[0] || {};
        card.innerHTML = `
          <div class="event-art">
            <span class="event-art-badge">${escaparHtml(obterSeloData(evento))}</span>
            <strong>${escaparHtml(primeiraAtracao.banda || evento.banda || evento.estabelecimento || "Música ao vivo")}</strong>
            <div>
              <small>${escaparHtml(formatarGenero(primeiraAtracao.genero || evento.genero))}</small>
              <em>${escaparHtml(evento.bairro || "Teresina")}</em>
            </div>
          </div>
          <div class="event-info">
            <h3>${escaparHtml(evento.estabelecimento || "Estabelecimento")}</h3>
            <div class="badge-row">${criarBadges(evento)}</div>
            <p class="event-meta"><strong>Data:</strong> ${escaparHtml(formatarData(evento.dataEvento))} · <strong>Horário:</strong> ${escaparHtml(obterHorario(evento))}</p>
            ${criarListaAtracoes(evento)}
            <p class="event-meta"><strong>Bairro:</strong> ${escaparHtml(evento.bairro || "-")}</p>
            <p class="event-meta"><strong>Couvert:</strong> ${eventoCobraCouvert(evento) ? "Sim" : "Não"} <strong>| Valor:</strong> ${escaparHtml(evento.valor || "Grátis")}</p>
            <div class="card-actions">
              <a class="action-link" href="${criarUrlRota(evento)}" target="_blank" rel="noopener">Como chegar</a>
              ${criarLinksContato(evento)}
              <button class="action-button secondary" type="button" data-share-id="${escaparHtml(evento.id)}">Compartilhar</button>
              <button class="action-button secondary" type="button" data-evento-id="${escaparHtml(evento.id)}">Ver no mapa</button>
            </div>
          </div>
        `;

        card.querySelector(".action-link").addEventListener("click", () => registrarMetrica(evento.id, "comoChegar"));
        card.querySelector("[data-share-id]").addEventListener("click", () => compartilharEvento(evento));
        card.querySelector("[data-evento-id]").addEventListener("click", () => {
          registrarMetrica(evento.id, "verNoMapa");
          focarEventoNoMapa(evento);
        });
        eventList.appendChild(card);
      });
    }

    function obterSeloData(evento) {
      const dataEvento = evento.dataEvento || "";
      const hoje = obterDataHoje();
      const amanha = new Date();
      amanha.setDate(amanha.getDate() + 1);
      const dataAmanha = formatarDataISO(amanha);

      if (dataEvento === hoje) {
        return "Hoje";
      }

      if (dataEvento === dataAmanha) {
        return "Amanhã";
      }

      return formatarData(dataEvento);
    }

    function focarEventoCompartilhado() {
      if (!eventoCompartilhadoId) {
        return;
      }

      const evento = eventos.find((item) => item.id === eventoCompartilhadoId);
      const card = document.getElementById(`evento-${eventoCompartilhadoId}`);

      if (!evento || !card) {
        return;
      }

      focarEventoNoMapa(evento);
      card.classList.add("shared-focus");
      setTimeout(() => {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 550);
      eventoCompartilhadoId = null;
    }

    function criarBadges(evento) {
      const badges = [];

      if (evento.destaque) {
        badges.push('<span class="badge hot">Destaque</span>');
      }

      if (eventoEhGratis(evento)) {
        badges.push('<span class="badge free">Grátis</span>');
      }

      if (normalizarStatus(evento.status) === "cancelado") {
        badges.push('<span class="badge cancelled">Cancelado</span>');
      }

      if (!temCoordenadasValidas(evento)) {
        badges.push('<span class="badge no-map">Sem pin no mapa</span>');
      }

      return badges.join("");
    }

    async function compartilharEvento(evento) {
      const url = `${window.location.origin}${window.location.pathname}?evento=${encodeURIComponent(evento.id)}`;
      const texto = `${evento.estabelecimento || "Evento"} - ${formatarAtracoesTexto(evento)} no ${evento.bairro || "bairro informado"}.`;

      try {
        if (navigator.share) {
          await navigator.share({
            title: "EventosThe",
            text: texto,
            url
          });
          registrarMetrica(evento.id, "compartilhar");
          return;
        }

        await navigator.clipboard.writeText(`${texto} ${url}`);
        registrarMetrica(evento.id, "compartilhar");
        mostrarMensagem("Link do evento copiado.");
      } catch (error) {
        if (error?.name !== "AbortError") {
          console.warn("Não foi possível compartilhar:", error);
          mostrarMensagem(`Copie o link do evento: ${url}`);
        }
      }
    }

    async function registrarMetrica(eventoId, nomeMetrica) {
      if (!db || !eventoId) {
        return;
      }

      try {
        await updateDoc(doc(db, "eventos", eventoId), {
          [`metricas.${nomeMetrica}`]: increment(1),
          "metricas.ultimoCliqueEm": serverTimestamp()
        });
      } catch (error) {
        console.warn("Não foi possível registrar métrica:", error);
      }
    }

    async function registrarVisita() {
      if (!db) {
        return;
      }

      const hoje = obterDataHoje();
      const chaveSessao = `eventosthe_visita_${hoje}`;

      if (sessionStorage.getItem(chaveSessao)) {
        return;
      }

      try {
        sessionStorage.setItem(chaveSessao, "1");
        await setDoc(doc(db, "metricas", "publico"), {
          visitasTotais: increment(1),
          [`visitasPorDia.${hoje}`]: increment(1),
          ultimaVisitaEm: serverTimestamp()
        }, { merge: true });
      } catch (error) {
        sessionStorage.removeItem(chaveSessao);
        console.warn("Não foi possível registrar visita:", error);
      }
    }

    function focarEventoNoMapa(evento) {
      if (!temCoordenadasValidas(evento)) {
        mostrarMensagem("Este evento ainda não tem coordenadas válidas para aparecer no mapa.");
        return;
      }

      map.setView([Number(evento.latitude), Number(evento.longitude)], 16);
      rolarParaMapa();
      setTimeout(() => {
        map.invalidateSize();
        eventMarkers.get(evento.id)?.openPopup();
      }, 360);
    }

    function rolarParaMapa() {
      const mapElement = document.getElementById("map");
      if (!mapElement) {
        return;
      }

      const topbarHeight = document.querySelector(".topbar")?.getBoundingClientRect().height || 0;
      const targetTop = mapElement.getBoundingClientRect().top + window.scrollY - topbarHeight - 8;
      window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
    }

    function criarPopup(evento) {
      return `
        <article class="popup-card">
          <h2>${escaparHtml(evento.estabelecimento || "Estabelecimento")}</h2>
          <p><strong>Atrações:</strong> ${escaparHtml(formatarAtracoesTexto(evento))}</p>
          <p><strong>Gêneros:</strong> ${escaparHtml(formatarGenerosDoEvento(evento))}</p>
          <p><strong>Bairro:</strong> ${escaparHtml(evento.bairro || "-")}</p>
          <p><strong>Endereço:</strong> ${escaparHtml(formatarEndereco(evento))}</p>
          <p><strong>Cobra couvert/entrada:</strong> ${eventoCobraCouvert(evento) ? "Sim" : "Não"}</p>
          <p><strong>Valor:</strong> ${escaparHtml(evento.valor || "Grátis")}</p>
          <p><strong>Horário:</strong> ${escaparHtml(obterHorario(evento))}</p>
          <p><strong>Paga 10%:</strong> ${evento.pagaDezPorCento ? "Sim" : "Não"}</p>
          <a href="${criarUrlRota(evento)}" target="_blank" rel="noopener">Como chegar</a>
          ${criarLinksContato(evento, true)}
        </article>
      `;
    }

    function criarLinksContato(evento, compacto = false) {
      const links = [
        {
          texto: "Instagram",
          url: criarUrlInstagram(evento.instagram)
        },
        {
          texto: "WhatsApp",
          url: criarUrlWhatsApp(evento.whatsapp)
        },
        {
          texto: "Ingressos",
          url: criarUrlVenda(evento.linkIngressos)
        }
      ].filter((link) => link.url);

      if (!links.length) {
        return "";
      }

      return links.map((link) => {
        const classe = compacto ? "" : ' class="action-link secondary"';
        return `<a${classe} href="${escaparHtml(link.url)}" target="_blank" rel="noopener">${escaparHtml(link.texto)}</a>`;
      }).join("");
    }

    function criarUrlInstagram(valor) {
      const texto = String(valor || "").trim();

      if (!texto) {
        return "";
      }

      if (/^https?:\/\//i.test(texto)) {
        return texto;
      }

      const usuario = texto.replace(/^@/, "").replace(/^instagram\.com\//i, "").replace(/^www\.instagram\.com\//i, "").split(/[/?#]/)[0];
      return usuario ? `https://instagram.com/${encodeURIComponent(usuario)}` : "";
    }

    function criarUrlWhatsApp(valor) {
      const numeros = String(valor || "").replace(/\D/g, "");

      if (!numeros) {
        return "";
      }

      const numeroComPais = numeros.length <= 11 ? `55${numeros}` : numeros;
      return `https://wa.me/${numeroComPais}`;
    }

    function criarUrlVenda(valor) {
      const texto = String(valor || "").trim();

      if (!texto) {
        return "";
      }

      if (/^https?:\/\//i.test(texto)) {
        return texto;
      }

      if (/^(wa\.me|api\.whatsapp\.com|www\.)/i.test(texto)) {
        return `https://${texto}`;
      }

      const numeros = texto.replace(/\D/g, "");
      if (numeros.length >= 10) {
        return criarUrlWhatsApp(numeros);
      }

      return `https://${texto}`;
    }

    function criarUrlRota(evento) {
      const latitude = Number(evento.latitude);
      const longitude = Number(evento.longitude);

      if (temCoordenadasValidas(evento)) {
        return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      }

      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(evento.endereco || evento.estabelecimento || "Teresina PI")}`;
    }

    function atualizarContador(total) {
      const eventCount = document.getElementById("eventCount");
      const generoTexto = filtroAtual === "todos" ? "todos os gêneros" : formatarGenero(filtroAtual);
      document.getElementById("listTitle").textContent = obterRotuloPeriodo();
      eventCount.textContent = total === 1 ? `1 evento em ${generoTexto}` : `${total} eventos em ${generoTexto}`;
    }

    function ordenarEventos(a, b) {
      const dataComparada = String(a.dataEvento || "").localeCompare(String(b.dataEvento || ""));
      if (dataComparada !== 0) {
        return dataComparada;
      }

      if (Boolean(a.destaque) !== Boolean(b.destaque)) {
        return a.destaque ? -1 : 1;
      }

      return obterHorario(a).localeCompare(obterHorario(b), "pt-BR");
    }

    function obterIntervaloPeriodo() {
      const hoje = new Date();
      const inicio = formatarDataISO(hoje);
      const fim = new Date(hoje);

      if (periodoAtual === "amanha") {
        fim.setDate(hoje.getDate() + 1);
        const amanha = formatarDataISO(fim);
        return { inicio: amanha, fim: amanha };
      }

      if (periodoAtual === "semana") {
        fim.setDate(hoje.getDate() + 7);
        return { inicio, fim: formatarDataISO(fim) };
      }

      return { inicio, fim: inicio };
    }

    function obterRotuloPeriodo() {
      const rotulos = {
        hoje: "Eventos de hoje",
        amanha: "Rolês de amanhã",
        semana: "Rolês desta semana",
        todos: "Todos os rolês",
        data: `Rolês de ${formatarData(dataEscolhida)}`
      };

      return rotulos[periodoAtual] || "Eventos";
    }

    function obterDataHoje() {
      return formatarDataISO(new Date());
    }

    function formatarDataISO(data) {
      const ano = data.getFullYear();
      const mes = String(data.getMonth() + 1).padStart(2, "0");
      const dia = String(data.getDate()).padStart(2, "0");
      return `${ano}-${mes}-${dia}`;
    }

    function formatarData(data) {
      if (!data) {
        return "-";
      }

      const [ano, mes, dia] = String(data).split("-");
      return dia && mes && ano ? `${dia}/${mes}/${ano}` : data;
    }

    function obterAtracoesDoEvento(evento) {
      if (Array.isArray(evento.atracoes) && evento.atracoes.length) {
        return evento.atracoes;
      }

      return [{
        banda: evento.banda || "",
        genero: evento.genero || "",
        horario: evento.horario || "",
        horarioInicio: evento.horarioInicio || ""
      }];
    }

    function obterGenerosDoEvento(evento) {
      return [...new Set(obterAtracoesDoEvento(evento).map((atracao) => normalizarGenero(atracao.genero)).filter(Boolean))];
    }

    function formatarGenerosDoEvento(evento) {
      return obterGenerosDoEvento(evento).map(formatarGenero).join(", ") || "-";
    }

    function criarListaAtracoes(evento) {
      const atracoes = obterAtracoesDoEvento(evento);
      return `
        <ul class="attraction-list">
          ${atracoes.map((atracao) => `
            <li>
              ${escaparHtml(atracao.banda || "Atração")}
              <span>${escaparHtml(formatarGenero(atracao.genero))} · ${escaparHtml(atracao.horario || atracao.horarioInicio || "-")}</span>
            </li>
          `).join("")}
        </ul>
      `;
    }

    function formatarAtracoesTexto(evento) {
      return obterAtracoesDoEvento(evento)
        .map((atracao) => `${atracao.banda || "Música ao vivo"} às ${atracao.horario || atracao.horarioInicio || "-"}`)
        .join(", ");
    }

    function obterHorario(evento) {
      const primeiraAtracao = obterAtracoesDoEvento(evento)[0];
      return primeiraAtracao?.horarioInicio || evento.horarioInicio || primeiraAtracao?.horario || evento.horario || "-";
    }

    function temCoordenadasValidas(evento) {
      const latitude = Number(evento.latitude);
      const longitude = Number(evento.longitude);
      return Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        latitude >= -6 &&
        latitude <= -4 &&
        longitude >= -44 &&
        longitude <= -41;
    }

    function formatarEndereco(evento) {
      const partes = [evento.endereco, evento.numero].filter(Boolean);
      return partes.length ? partes.join(", ") : "-";
    }

    function eventoEhGratis(evento) {
      return String(evento.valor || "").trim().toLowerCase().includes("grátis") ||
        String(evento.valor || "").trim().toLowerCase().includes("gratis") ||
        String(evento.valor || "").trim() === "0" ||
        String(evento.valor || "").trim().toLowerCase() === "r$ 0,00";
    }

    function eventoCobraCouvert(evento) {
      if (typeof evento.cobraCouvert === "boolean") {
        return evento.cobraCouvert;
      }

      return !eventoEhGratis(evento);
    }

    function normalizarStatus(status) {
      return String(status || "ativo").trim().toLowerCase();
    }

    function mostrarMensagem(texto) {
      const messageBox = document.getElementById("messageBox");
      messageBox.textContent = texto;
      messageBox.classList.add("show");
    }

    function esconderMensagem() {
      const messageBox = document.getElementById("messageBox");
      messageBox.textContent = "";
      messageBox.classList.remove("show");
    }

    function normalizarGenero(genero) {
      const valor = String(genero || "").trim().toLowerCase();
      return valor === "kpop" ? "k-pop" : valor;
    }

    function normalizarTexto(valor) {
      return String(valor || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    }

    function formatarGenero(genero) {
      const generos = {
        pagode: "Pagode",
        "forró": "Forró",
        forro: "Forró",
        sertanejo: "Sertanejo",
        rock: "Rock",
        mpb: "MPB",
        "k-pop": "K-pop",
        kpop: "K-pop"
      };

      return generos[normalizarGenero(genero)] || genero || "-";
    }

    function escaparHtml(valor) {
      return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

function getElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Elemento #${id} nao encontrado na home.`);
  }
  return element;
}
