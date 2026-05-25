import type { Auth, User } from "firebase/auth";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  type Firestore,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
  updateDoc
} from "firebase/firestore";
import { MASTER_EMAILS, TERESINA_CENTRO } from "./admin-config";
import { getElement } from "./admin-dom";
import {
  criarOpcoesGenero,
  eventoCobraCouvert,
  formatarAtracoes,
  formatarContatos,
  formatarGenerosDoEvento,
  obterAtracoesDoEvento
} from "./admin-events";
import {
  converterHorarioTexto,
  escaparHtml,
  formatarData,
  formatarHorarioVisivel,
  formatarMoeda,
  formatarPlano,
  formatarStatus,
  limparCep,
  normalizarStatus,
  obterDataHoje,
  obterDataRelativa
} from "./admin-format";
import type { AdminEvent, Business, Metrics } from "./admin-types";
import { getFirebaseClient } from "./firebase-client";

    let auth: Auth | null = null;
    let db: Firestore | null = null;
    let unsubscribeEventos: Unsubscribe | null = null;
    let unsubscribeMetricas: Unsubscribe | null = null;
    let unsubscribeEstabelecimentos: Unsubscribe | null = null;
    let eventosAtuais: AdminEvent[] = [];
    let metricasPublico: Metrics = {};
    let estabelecimentosAtuais: Business[] = [];
    let eventoEmEdicaoId: string | null = null;
    let estabelecimentoEmEdicaoId: string | null = null;
    let unsubscribeAuth: Unsubscribe | null = null;
    let eventController: AbortController | null = null;

    export function setupAdminDashboard() {
      eventController?.abort();
      eventController = new AbortController();
      preencherDataHoje();
      configurarFirebase();
      configurarLogin();
      configurarFormulario();
      configurarEndereco();
      configurarLogout();
      configurarAtracoes();
      configurarFormularioEstabelecimento();
      addListener(getElement("cancelEditButton"), "click", cancelarEdicao);
      addListener(getElement("cancelBusinessEditButton"), "click", cancelarEdicaoEstabelecimento);
    return () => {
      eventController?.abort();
      eventController = null;
      if (unsubscribeAuth) {
        unsubscribeAuth();
        unsubscribeAuth = null;
      }
      if (unsubscribeEventos) {
        unsubscribeEventos();
        unsubscribeEventos = null;
      }
      if (unsubscribeMetricas) {
        unsubscribeMetricas();
        unsubscribeMetricas = null;
      }
      if (unsubscribeEstabelecimentos) {
        unsubscribeEstabelecimentos();
        unsubscribeEstabelecimentos = null;
      }
    };
  }

    function configurarFirebase() {
      try {
        const firebase = getFirebaseClient();
        auth = firebase.auth;
        db = firebase.db;

        if (unsubscribeAuth) {
          unsubscribeAuth();
        }

        unsubscribeAuth = onAuthStateChanged(auth, (user) => {
          if (user) {
            abrirAdmin(user);
          } else {
            fecharAdmin();
          }
        });
      } catch (error) {
        console.error("Erro ao iniciar Firebase:", error);
        mostrarMensagem("loginMessage", "Não foi possível conectar ao Firebase. Confira suas credenciais no início do script.", "error");
      }
    }

    function configurarLogin() {
      addListener(getElement("loginForm"), "submit", async (event) => {
        event.preventDefault();

        if (!auth) {
          mostrarMensagem("loginMessage", "Firebase Auth não está conectado. Confira suas credenciais.", "error");
          return;
        }

        const email = pegarValor("emailInput");
        const senha = getElement("passwordInput").value;
        const loginButton = getElement("loginButton");

        try {
          loginButton.disabled = true;
          await signInWithEmailAndPassword(auth, email, senha);
          esconderMensagem("loginMessage");
        } catch (error) {
          console.error("Erro ao entrar:", error);
          mostrarMensagem("loginMessage", "Não foi possível entrar. Confira e-mail, senha e se o provedor E-mail/senha está ativo no Firebase.", "error");
        } finally {
          loginButton.disabled = false;
        }
      });
    }

    function configurarFormulario() {
      addListener(getElement("eventForm"), "submit", async (event) => {
        event.preventDefault();
        await salvarEvento();
      });
    }

    function configurarFormularioEstabelecimento() {
      addListener(getElement("businessForm"), "submit", async (event) => {
        event.preventDefault();
        await salvarEstabelecimento();
      });
    }

    function configurarAtracoes() {
      addListener(getElement("addAttractionButton"), "click", () => adicionarCampoAtracao());
      adicionarCampoAtracao();
    }

    function configurarEndereco() {
      addListener(getElement("cepButton"), "click", buscarEnderecoPorCep);
      addListener(getElement("coordsButton"), "click", buscarCoordenadas);
      addListener(getElement("centerButton"), "click", () => {
        setarCoordenadas(TERESINA_CENTRO[0], TERESINA_CENTRO[1]);
        mostrarMensagem("formMessage", "Usei o Centro de Teresina como pin temporário. Depois você pode ajustar em Coordenadas avançadas.", "success");
      });

      addListener(getElement("cep"), "blur", () => {
        const cep = limparCep(pegarValor("cep"));

        if (cep.length === 8) {
          buscarEnderecoPorCep();
        }
      });
    }

    function configurarLogout() {
      addListener(getElement("logoutButton"), "click", async () => {
        if (auth) {
          await signOut(auth);
        }
      });
    }

    function abrirAdmin(user: User) {
      const master = ehAdminMaster(user);
      getElement("loginPanel").classList.add("hidden");
      getElement("adminPanel").classList.toggle("hidden", master);
      getElement("summaryPanel").classList.remove("hidden");
      getElement("listPanel").classList.toggle("hidden", master);
      carregarEventos();
      carregarMetricasPublicas();

      if (master) {
        getElement("masterPanel").classList.remove("hidden");
        carregarEstabelecimentos();
      } else {
        getElement("masterPanel").classList.add("hidden");
      }
    }

    function fecharAdmin() {
      getElement("loginPanel").classList.remove("hidden");
      getElement("adminPanel").classList.add("hidden");
      getElement("summaryPanel").classList.add("hidden");
      getElement("listPanel").classList.add("hidden");
      getElement("masterPanel").classList.add("hidden");
      cancelarEdicao();
      cancelarEdicaoEstabelecimento();

      if (unsubscribeEventos) {
        unsubscribeEventos();
        unsubscribeEventos = null;
      }

      if (unsubscribeMetricas) {
        unsubscribeMetricas();
        unsubscribeMetricas = null;
      }

      if (unsubscribeEstabelecimentos) {
        unsubscribeEstabelecimentos();
        unsubscribeEstabelecimentos = null;
      }
    }

    function ehAdminMaster(user: User) {
      return MASTER_EMAILS.includes(String(user?.email || "").toLowerCase());
    }

    async function salvarEvento() {
      if (!db) {
        mostrarMensagem("formMessage", "Firebase não está conectado. Confira suas credenciais.", "error");
        return;
      }

      const coordenadasOk = await garantirCoordenadas();

      if (!coordenadasOk) {
        mostrarMensagem("formMessage", "Não consegui encontrar coordenadas para esse endereço. Use 'Usar Centro de Teresina' como temporário ou ajuste em 'Coordenadas avançadas'.", "error");
        return;
      }

      const latitude = lerCoordenada("latitude");
      const longitude = lerCoordenada("longitude");

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        mostrarMensagem("formMessage", "Coordenadas inválidas. Use 'Usar Centro de Teresina' como temporário ou ajuste em 'Coordenadas avançadas'.", "error");
        return;
      }

      if (!coordenadasEmTeresina(latitude, longitude)) {
        mostrarMensagem("formMessage", "As coordenadas encontradas ficaram fora de Teresina. Use 'Usar Centro de Teresina' como temporário ou ajuste em 'Coordenadas avançadas'.", "error");
        return;
      }

      const atracoes = obterAtracoesDoFormulario();

      if (atracoes.length === 0) {
        mostrarMensagem("formMessage", "Cadastre pelo menos uma atração com banda, gênero e horário.", "error");
        return;
      }

      const atracaoPrincipal = atracoes[0];

      const evento = {
        dataEvento: pegarValor("dataEvento"),
        estabelecimento: pegarValor("estabelecimento"),
        banda: atracaoPrincipal.banda,
        genero: atracaoPrincipal.genero,
        atracoes,
        cep: pegarValor("cep"),
        numero: pegarValor("numero"),
        bairro: pegarValor("bairro"),
        endereco: pegarValor("endereco"),
        latitude,
        longitude,
        valor: pegarValor("valor"),
        horario: atracaoPrincipal.horario,
        horarioInicio: atracaoPrincipal.horarioInicio,
        instagram: pegarValor("instagram"),
        whatsapp: pegarValor("whatsapp"),
        linkIngressos: pegarValor("linkIngressos"),
        status: pegarValor("status"),
        destaque: getElement("destaque").checked,
        cobraCouvert: getElement("cobraCouvert").checked,
        pagaDezPorCento: getElement("pagaDezPorCento").checked,
        atualizadoEm: serverTimestamp()
      };

      const saveButton = getElement("saveButton");

      try {
        saveButton.disabled = true;

        if (eventoEmEdicaoId) {
          await updateDoc(doc(db, "eventos", eventoEmEdicaoId), evento);
          mostrarMensagem("formMessage", "Evento atualizado com sucesso", "success");
        } else {
          await addDoc(collection(db, "eventos"), {
            ...evento,
            criadoEm: serverTimestamp()
          });
          mostrarMensagem("formMessage", "Evento cadastrado com sucesso", "success");
        }

        cancelarEdicao();
      } catch (error) {
        console.error("Erro ao salvar evento:", error);
        mostrarMensagem("formMessage", "Não foi possível salvar o evento. Confira a conexão e as regras do Firestore.", "error");
      } finally {
        saveButton.disabled = false;
      }
    }

    function carregarEventos() {
      if (!db || unsubscribeEventos) {
        return;
      }

      const eventosRef = collection(db, "eventos");

      unsubscribeEventos = onSnapshot(
        eventosRef,
        (snapshot) => {
          const eventos = snapshot.docs.map((documento) => ({
            id: documento.id,
            ...documento.data()
          }));
          eventosAtuais = eventos;
          esconderMensagem("listMessage");
          renderizarResumo(eventosAtuais);
          renderizarLista(ordenarEventos(eventos));
        },
        (error) => {
          console.error("Erro ao carregar eventos:", error);
          mostrarMensagem("listMessage", "Não foi possível carregar a lista de eventos.", "error");
        }
      );
    }

    function carregarMetricasPublicas() {
      if (!db || unsubscribeMetricas) {
        return;
      }

      unsubscribeMetricas = onSnapshot(
        doc(db, "metricas", "publico"),
        (snapshot) => {
          metricasPublico = snapshot.exists() ? snapshot.data() : {};
          renderizarResumo(eventosAtuais);
        },
        (error) => {
          console.warn("Não foi possível carregar métricas públicas:", error);
        }
      );
    }

    function carregarEstabelecimentos() {
      if (!db || unsubscribeEstabelecimentos) {
        return;
      }

      unsubscribeEstabelecimentos = onSnapshot(
        collection(db, "estabelecimentos"),
        (snapshot) => {
          estabelecimentosAtuais = snapshot.docs.map((documento) => ({
            id: documento.id,
            ...documento.data()
          }));
          renderizarResumoComercial();
          renderizarListaEstabelecimentos();
        },
        (error) => {
          console.warn("Não foi possível carregar estabelecimentos:", error);
        }
      );
    }

    function renderizarResumo(eventos: AdminEvent[]) {
      const hoje = obterDataHoje();
      const amanha = obterDataRelativa(1);

      const resumo = {
        hoje: eventos.filter((evento) => evento.dataEvento === hoje && normalizarStatus(evento.status) !== "cancelado").length,
        amanha: eventos.filter((evento) => evento.dataEvento === amanha && normalizarStatus(evento.status) !== "cancelado").length,
        destaques: eventos.filter((evento) => evento.destaque && normalizarStatus(evento.status) !== "cancelado").length,
        cancelados: eventos.filter((evento) => normalizarStatus(evento.status) === "cancelado").length,
        rotas: somarMetricas(eventos, "comoChegar"),
        shares: somarMetricas(eventos, "compartilhar"),
        mapa: somarMetricas(eventos, "verNoMapa"),
        visitasHoje: Number(metricasPublico.visitasPorDia?.[hoje] || 0),
        visitas: Number(metricasPublico.visitasTotais || 0),
        total: eventos.length
      };

      getElement("summaryGrid").innerHTML = `
        <div class="summary-card"><strong>${resumo.hoje}</strong><span>Eventos hoje</span></div>
        <div class="summary-card"><strong>${resumo.amanha}</strong><span>Eventos amanhã</span></div>
        <div class="summary-card"><strong>${resumo.destaques}</strong><span>Destaques ativos</span></div>
        <div class="summary-card"><strong>${resumo.cancelados}</strong><span>Eventos cancelados</span></div>
        <div class="summary-card"><strong>${resumo.rotas}</strong><span>Cliques em rotas</span></div>
        <div class="summary-card"><strong>${resumo.shares}</strong><span>Compartilhamentos</span></div>
        <div class="summary-card"><strong>${resumo.mapa}</strong><span>Cliques no mapa</span></div>
        <div class="summary-card"><strong>${resumo.visitasHoje}</strong><span>Visitas hoje</span></div>
        <div class="summary-card"><strong>${resumo.visitas}</strong><span>Pessoas que usaram</span></div>
        <div class="summary-card"><strong>${resumo.total}</strong><span>Eventos cadastrados</span></div>
      `;
    }

    function somarMetricas(eventos: AdminEvent[], metrica: string) {
      return eventos.reduce((total, evento) => total + Number(evento.metricas?.[metrica] || 0), 0);
    }

    function renderizarResumoComercial() {
      const ativos = estabelecimentosAtuais.filter((item) => normalizarStatus(item.status) === "ativo");
      const basico = ativos.filter((item) => item.plano === "basico").length;
      const plus = ativos.filter((item) => item.plano === "plus").length;
      const receita = ativos.reduce((total, item) => total + Number(item.valorMensal || 0), 0);

      getElement("businessSummary").innerHTML = `
        <div class="summary-card"><strong>${ativos.length}</strong><span>Estabelecimentos ativos</span></div>
        <div class="summary-card"><strong>${basico}</strong><span>Plano básico</span></div>
        <div class="summary-card"><strong>${plus}</strong><span>Plano plus</span></div>
        <div class="summary-card"><strong>${formatarMoeda(receita)}</strong><span>Receita mensal prevista</span></div>
      `;
    }

    function renderizarListaEstabelecimentos() {
      const businessList = getElement("businessList");
      businessList.innerHTML = "";

      if (estabelecimentosAtuais.length === 0) {
        businessList.innerHTML = '<p class="empty-state">Nenhum estabelecimento cadastrado.</p>';
        return;
      }

      estabelecimentosAtuais
        .slice()
        .sort((a, b) => String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR"))
        .forEach((estabelecimento) => {
          const item = document.createElement("article");
          item.className = "event-item";
          item.innerHTML = `
            <div>
              <h3>${escaparHtml(estabelecimento.nome || "Estabelecimento")}</h3>
              <p><strong>Plano:</strong> ${escaparHtml(formatarPlano(estabelecimento.plano))} · <strong>Status:</strong> ${escaparHtml(formatarStatus(estabelecimento.status))}</p>
              <p><strong>Valor mensal:</strong> ${escaparHtml(formatarMoeda(estabelecimento.valorMensal || 0))} · <strong>Destaque:</strong> ${estabelecimento.destaque ? "Sim" : "Não"}</p>
              <p><strong>Contato:</strong> ${escaparHtml(estabelecimento.contato || "-")}</p>
            </div>
          `;

          const actions = document.createElement("div");
          actions.className = "row-actions";

          const editButton = document.createElement("button");
          editButton.type = "button";
          editButton.className = "secondary";
          editButton.textContent = "Editar";
          addListener(editButton, "click", () => editarEstabelecimento(estabelecimento));

          const deleteButton = document.createElement("button");
          deleteButton.type = "button";
          deleteButton.className = "danger";
          deleteButton.textContent = "Excluir";
          addListener(deleteButton, "click", () => excluirEstabelecimento(estabelecimento.id, deleteButton));

          actions.append(editButton, deleteButton);
          item.append(actions);
          businessList.appendChild(item);
        });
    }

    function renderizarLista(eventos: AdminEvent[]) {
      const eventList = getElement("eventList");
      eventList.innerHTML = "";

      if (eventos.length === 0) {
        eventList.innerHTML = '<p class="empty-state">Nenhum evento cadastrado ainda.</p>';
        return;
      }

      eventos.forEach((evento) => {
        const item = document.createElement("article");
        item.className = "event-item";

        const info = document.createElement("div");
        info.innerHTML = `
          <h3>${escaparHtml(evento.estabelecimento || "Estabelecimento")}</h3>
          <p><strong>Data:</strong> ${escaparHtml(formatarData(evento.dataEvento))} · <strong>Horário:</strong> ${escaparHtml(evento.horario || "-")}</p>
          <p><strong>Status:</strong> ${escaparHtml(formatarStatus(evento.status))}${evento.destaque ? " · <strong>Destaque</strong>" : ""}</p>
          <p><strong>Atrações:</strong> ${escaparHtml(formatarAtracoes(evento))}</p>
          <p><strong>Gêneros:</strong> ${escaparHtml(formatarGenerosDoEvento(evento))}</p>
          <p><strong>Bairro:</strong> ${escaparHtml(evento.bairro || "-")} · <strong>Couvert/entrada:</strong> ${eventoCobraCouvert(evento) ? "Sim" : "Não"} · <strong>Valor:</strong> ${escaparHtml(evento.valor || "-")}</p>
          <p><strong>Contato:</strong> ${escaparHtml(formatarContatos(evento))}</p>
          <div class="metrics-row">
            <span class="metric-pill">Rotas: ${Number(evento.metricas?.comoChegar || 0)}</span>
            <span class="metric-pill">Shares: ${Number(evento.metricas?.compartilhar || 0)}</span>
            <span class="metric-pill">Mapa: ${Number(evento.metricas?.verNoMapa || 0)}</span>
          </div>
        `;

        const actions = document.createElement("div");
        actions.className = "row-actions";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "secondary";
        editButton.textContent = "Editar";
        addListener(editButton, "click", () => editarEvento(evento));

        const duplicateButton = document.createElement("button");
        duplicateButton.type = "button";
        duplicateButton.className = "ghost";
        duplicateButton.textContent = "Duplicar";
        addListener(duplicateButton, "click", () => duplicarEvento(evento));

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "danger";
        deleteButton.textContent = "Excluir";
        addListener(deleteButton, "click", () => excluirEvento(evento.id, deleteButton));

        actions.append(editButton, duplicateButton, deleteButton);
        item.append(info, actions);
        eventList.appendChild(item);
      });
    }

    function ordenarEventos(eventos: AdminEvent[]) {
      return eventos.sort((a, b) => {
        const dataComparada = String(b.dataEvento || "").localeCompare(String(a.dataEvento || ""));
        if (dataComparada !== 0) {
          return dataComparada;
        }

        return String(a.horario || "").localeCompare(String(b.horario || ""), "pt-BR");
      });
    }

    function editarEvento(evento: AdminEvent) {
      eventoEmEdicaoId = evento.id;
      getElement("formTitle").textContent = "Editar evento";
      getElement("saveButton").textContent = "Atualizar evento";
      getElement("cancelEditButton").classList.remove("hidden");

      setarValor("dataEvento", evento.dataEvento || obterDataHoje());
      setarValor("estabelecimento", evento.estabelecimento);
      preencherAtracoes(obterAtracoesDoEvento(evento));
      setarValor("cep", evento.cep);
      setarValor("numero", evento.numero);
      setarValor("bairro", evento.bairro);
      setarValor("endereco", evento.endereco);
      setarValor("latitude", evento.latitude);
      setarValor("longitude", evento.longitude);
      setarValor("valor", evento.valor);
      setarValor("instagram", evento.instagram);
      setarValor("whatsapp", evento.whatsapp);
      setarValor("linkIngressos", evento.linkIngressos);
      setarValor("status", evento.status || "ativo");
      getElement("destaque").checked = Boolean(evento.destaque);
      getElement("cobraCouvert").checked = eventoCobraCouvert(evento);
      getElement("pagaDezPorCento").checked = Boolean(evento.pagaDezPorCento);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function duplicarEvento(evento: AdminEvent) {
      eventoEmEdicaoId = null;
      getElement("formTitle").textContent = "Duplicar evento";
      getElement("saveButton").textContent = "Salvar cópia";
      getElement("cancelEditButton").classList.remove("hidden");

      setarValor("dataEvento", evento.dataEvento || obterDataHoje());
      setarValor("estabelecimento", evento.estabelecimento);
      preencherAtracoes(obterAtracoesDoEvento(evento));
      setarValor("cep", evento.cep);
      setarValor("numero", evento.numero);
      setarValor("bairro", evento.bairro);
      setarValor("endereco", evento.endereco);
      setarValor("latitude", evento.latitude);
      setarValor("longitude", evento.longitude);
      setarValor("valor", evento.valor);
      setarValor("instagram", evento.instagram);
      setarValor("whatsapp", evento.whatsapp);
      setarValor("linkIngressos", evento.linkIngressos);
      setarValor("status", evento.status || "ativo");
      getElement("pagaDezPorCento").checked = Boolean(evento.pagaDezPorCento);
      getElement("cobraCouvert").checked = eventoCobraCouvert(evento);
      getElement("destaque").checked = Boolean(evento.destaque);
      mostrarMensagem("formMessage", "Cópia carregada. Ajuste a data ou horário e salve como novo evento.", "success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function cancelarEdicao() {
      eventoEmEdicaoId = null;
      getElement("eventForm").reset();
      getElement("formTitle").textContent = "Cadastrar evento";
      getElement("saveButton").textContent = "Salvar evento";
      getElement("cancelEditButton").classList.add("hidden");
      preencherDataHoje();
      preencherAtracoes([{ banda: "", genero: "pagode", horario: "", horarioInicio: "" }]);
    }

    async function excluirEvento(id: string, button: HTMLButtonElement) {
      if (!db) {
        mostrarMensagem("listMessage", "Firebase não está conectado. Confira suas credenciais.", "error");
        return;
      }

      if (!window.confirm("Deseja excluir este evento?")) {
        return;
      }

      try {
        button.disabled = true;
        await deleteDoc(doc(db, "eventos", id));
      } catch (error) {
        console.error("Erro ao excluir evento:", error);
        mostrarMensagem("listMessage", "Não foi possível excluir o evento.", "error");
        button.disabled = false;
      }
    }

    async function salvarEstabelecimento() {
      if (!db) {
        return;
      }

      const estabelecimento = {
        nome: pegarValor("businessName"),
        contato: pegarValor("businessContact"),
        plano: pegarValor("businessPlan"),
        valorMensal: Number(pegarValor("businessValue") || 0),
        status: pegarValor("businessStatus"),
        destaque: getElement("businessHighlight").checked,
        atualizadoEm: serverTimestamp()
      };

      const saveButton = getElement("businessSaveButton");

      try {
        saveButton.disabled = true;

        if (estabelecimentoEmEdicaoId) {
          await updateDoc(doc(db, "estabelecimentos", estabelecimentoEmEdicaoId), estabelecimento);
        } else {
          await addDoc(collection(db, "estabelecimentos"), {
            ...estabelecimento,
            criadoEm: serverTimestamp()
          });
        }

        cancelarEdicaoEstabelecimento();
      } catch (error) {
        console.error("Erro ao salvar estabelecimento:", error);
        window.alert("Não foi possível salvar o estabelecimento. Confira suas regras do Firestore.");
      } finally {
        saveButton.disabled = false;
      }
    }

    function editarEstabelecimento(estabelecimento: Business) {
      estabelecimentoEmEdicaoId = estabelecimento.id;
      setarValor("businessName", estabelecimento.nome);
      setarValor("businessContact", estabelecimento.contato);
      setarValor("businessPlan", estabelecimento.plano || "basico");
      setarValor("businessValue", estabelecimento.valorMensal || 0);
      setarValor("businessStatus", estabelecimento.status || "ativo");
      getElement("businessHighlight").checked = Boolean(estabelecimento.destaque);
      getElement("businessSaveButton").textContent = "Atualizar estabelecimento";
      getElement("cancelBusinessEditButton").classList.remove("hidden");
      getElement("masterPanel").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function cancelarEdicaoEstabelecimento() {
      estabelecimentoEmEdicaoId = null;
      getElement("businessForm").reset();
      getElement("businessSaveButton").textContent = "Salvar estabelecimento";
      getElement("cancelBusinessEditButton").classList.add("hidden");
    }

    async function excluirEstabelecimento(id: string, button: HTMLButtonElement) {
      if (!db || !window.confirm("Deseja excluir este estabelecimento?")) {
        return;
      }

      try {
        button.disabled = true;
        await deleteDoc(doc(db, "estabelecimentos", id));
      } catch (error) {
        console.error("Erro ao excluir estabelecimento:", error);
        window.alert("Não foi possível excluir o estabelecimento.");
        button.disabled = false;
      }
    }

    function adicionarCampoAtracao(atracao: Record<string, any> = {}) {
      const attractionsList = getElement("attractionsList");
      const row = document.createElement("div");
      row.className = "attraction-row";
      row.innerHTML = `
        <label>
          Banda/artista
          <input type="text" class="attraction-band" value="${escaparHtml(atracao.banda || "")}" placeholder="Ex: Samblack" required>
        </label>
        <label>
          Gênero
          <select class="attraction-genre" required>
            ${criarOpcoesGenero(atracao.genero || "pagode")}
          </select>
        </label>
        <label>
          Horário
          <input type="time" class="attraction-time" value="${escaparHtml(atracao.horarioInicio || converterHorarioTexto(atracao.horario) || "")}" required>
        </label>
        <button type="button" class="danger remove-attraction-button" aria-label="Remover atração">X</button>
      `;

      const removeButton = row.querySelector<HTMLButtonElement>(".remove-attraction-button");
      if (!removeButton) {
        throw new Error("Botao de remocao de atracao nao encontrado.");
      }

      addListener(removeButton, "click", () => {
        if (document.querySelectorAll(".attraction-row").length === 1) {
          mostrarMensagem("formMessage", "O evento precisa ter pelo menos uma atração.", "error");
          return;
        }

        row.remove();
      });

      attractionsList.appendChild(row);
    }

    function preencherAtracoes(atracoes: Record<string, any>[]) {
      const attractionsList = getElement("attractionsList");
      attractionsList.innerHTML = "";
      const lista = atracoes.length ? atracoes : [{ banda: "", genero: "pagode", horario: "", horarioInicio: "" }];
      lista.forEach((atracao) => adicionarCampoAtracao(atracao));
    }

    function obterAtracoesDoFormulario() {
      return Array.from(document.querySelectorAll(".attraction-row"))
        .map((row) => {
          const banda = row.querySelector<HTMLInputElement>(".attraction-band")?.value.trim() || "";
          const genero = row.querySelector<HTMLSelectElement>(".attraction-genre")?.value.trim() || "";
          const horarioInicio = row.querySelector<HTMLInputElement>(".attraction-time")?.value.trim() || "";
          return {
            banda,
            genero,
            horario: formatarHorarioVisivel(horarioInicio),
            horarioInicio
          };
        })
        .filter((atracao) => atracao.banda && atracao.genero && atracao.horarioInicio);
    }









    async function buscarEnderecoPorCep() {
      const cep = limparCep(pegarValor("cep"));

      if (cep.length !== 8) {
        mostrarMensagem("formMessage", "Informe um CEP com 8 números.", "error");
        return;
      }

      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (!response.ok || data.erro) {
          mostrarMensagem("formMessage", "CEP não encontrado.", "error");
          return;
        }

        setarValor("cep", data.cep || cep);
        setarValor("endereco", data.logradouro || pegarValor("endereco"));
        setarValor("bairro", data.bairro || pegarValor("bairro"));
        mostrarMensagem("formMessage", "Endereço preenchido pelo CEP. Confira o número e busque as coordenadas.", "success");
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        mostrarMensagem("formMessage", "Não foi possível consultar o CEP agora.", "error");
      }
    }

    async function buscarCoordenadas() {
      const consulta = [
        pegarValor("endereco"),
        pegarValor("numero"),
        pegarValor("bairro"),
        "Teresina",
        "PI",
        "Brasil",
        pegarValor("cep")
      ].filter(Boolean).join(", ");

      if (!pegarValor("endereco") || !pegarValor("bairro")) {
        mostrarMensagem("formMessage", "Preencha endereço e bairro antes de buscar coordenadas.", "error");
        return;
      }

      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&q=${encodeURIComponent(consulta)}`;
        const response = await fetch(url);
        const results = await response.json();

        if (!response.ok || !results.length) {
          mostrarMensagem("formMessage", "Não encontrei coordenadas para esse endereço. Ajuste manualmente latitude e longitude.", "error");
          return;
        }

        const latitude = Number(results[0].lat);
        const longitude = Number(results[0].lon);

        if (!coordenadasEmTeresina(latitude, longitude)) {
          mostrarMensagem("formMessage", "A busca retornou um local fora de Teresina. Use o Centro de Teresina como temporário ou ajuste em Coordenadas avançadas.", "error");
          return;
        }

        setarValor("latitude", latitude.toFixed(6));
        setarValor("longitude", longitude.toFixed(6));
        mostrarMensagem("formMessage", "Coordenadas encontradas. Confira no mapa depois de salvar.", "success");
      } catch (error) {
        console.error("Erro ao buscar coordenadas:", error);
        mostrarMensagem("formMessage", "Não foi possível buscar coordenadas agora.", "error");
      }
    }

    async function garantirCoordenadas() {
      const latitude = lerCoordenada("latitude");
      const longitude = lerCoordenada("longitude");

      if (Number.isFinite(latitude) && Number.isFinite(longitude) && coordenadasEmTeresina(latitude, longitude)) {
        return true;
      }

      await buscarCoordenadas();

      const novaLatitude = lerCoordenada("latitude");
      const novaLongitude = lerCoordenada("longitude");
      return Number.isFinite(novaLatitude) &&
        Number.isFinite(novaLongitude) &&
        coordenadasEmTeresina(novaLatitude, novaLongitude);
    }

    function lerCoordenada(id: string) {
      const valor = getElement(id).value.trim().replace(",", ".");
      return valor === "" ? Number.NaN : Number(valor);
    }

    function setarCoordenadas(latitude: number, longitude: number) {
      setarValor("latitude", Number(latitude).toFixed(6));
      setarValor("longitude", Number(longitude).toFixed(6));
    }

    function coordenadasEmTeresina(latitude: number, longitude: number) {
      return latitude >= -6 &&
        latitude <= -4 &&
        longitude >= -44 &&
        longitude <= -41;
    }

    function preencherDataHoje() {
      getElement("dataEvento").value = obterDataHoje();
    }




    function pegarValor(id: string) {
      return getElement(id).value.trim();
    }

    function setarValor(id: string, valor: unknown) {
      getElement(id).value = valor ?? "";
    }


    function mostrarMensagem(id: string, texto: string, tipo: "success" | "error") {
      const elemento = getElement(id);
      elemento.textContent = texto;
      elemento.className = `message ${tipo} show`;
    }

    function esconderMensagem(id: string) {
      const elemento = getElement(id);
      elemento.textContent = "";
      elemento.className = "message";
    }










function addListener<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  type: K,
  listener: (event: HTMLElementEventMap[K]) => void | Promise<void>
) {
  element.addEventListener(type, listener, { signal: eventController?.signal });
}
