export const homeStyles = `
:root {
  --blue: #5262ff;
  --blue-strong: #3147ff;
  --purple: #9d2cff;
  --pink: #ff39b6;
  --orange: #ff7048;
  --bg: #050912;
  --panel: #090e18;
  --panel-2: #101622;
  --surface: rgba(14, 20, 32, 0.88);
  --surface-strong: rgba(20, 27, 42, 0.96);
  --text: #f7f8ff;
  --muted: #9ca3b5;
  --muted-2: #6f7789;
  --border: rgba(255, 255, 255, 0.12);
  --border-strong: rgba(255, 255, 255, 0.18);
  --shadow: 0 22px 60px rgba(0, 0, 0, 0.38);
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  min-height: 100%;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  color: var(--text);
  background:
    radial-gradient(circle at 18% 0%, rgba(82, 98, 255, 0.28), transparent 34vw),
    radial-gradient(circle at 88% 8%, rgba(255, 57, 182, 0.24), transparent 36vw),
    linear-gradient(180deg, #050816 0%, var(--bg) 52%, #03050a 100%);
}

body {
  padding-bottom: 104px;
}

button,
input {
  font: inherit;
}

.topbar {
  min-height: 96px;
  padding: 16px 20px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  background:
    radial-gradient(circle at 92% 28%, rgba(255, 112, 72, 0.78), transparent 13%),
    linear-gradient(135deg, #0b183b 0%, #0922b8 48%, #ff3b9f 100%);
  color: #fff;
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 800;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
}

.brand h1 {
  margin: 0;
  font-size: clamp(1.6rem, 4vw, 2.05rem);
  line-height: 1;
  letter-spacing: 0;
}

.brand p {
  margin: 7px 0 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: clamp(0.88rem, 2.4vw, 1rem);
}

.icon-button {
  width: 56px;
  height: 56px;
  border: 0;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--orange), var(--pink));
  color: #fff;
  box-shadow: 0 18px 42px rgba(255, 57, 182, 0.28);
  font-size: 1.35rem;
  font-weight: 800;
  cursor: pointer;
  flex: 0 0 auto;
}

#map {
  height: 24vh;
  min-height: 190px;
  width: 100%;
  margin-top: -6px;
  background: #070b14;
  border-bottom: 1px solid var(--border);
  filter: saturate(0.7) brightness(0.72) contrast(1.2);
}

.leaflet-container {
  background: #070b14;
}

.date-tabs,
.date-picker-row,
.filters,
.quick-search {
  width: min(1280px, 100%);
  margin: 0 auto;
  padding-inline: 20px;
  background: transparent;
}

.date-tabs {
  padding-top: 22px;
  display: flex;
  gap: 14px;
  overflow-x: auto;
  scrollbar-width: none;
}

.filters {
  padding-top: 18px;
  display: flex;
  gap: 14px;
  overflow-x: auto;
  scrollbar-width: none;
}

.date-tabs::-webkit-scrollbar,
.filters::-webkit-scrollbar {
  display: none;
}

.date-picker-row {
  padding-top: 16px;
  display: grid;
  grid-template-columns: 1fr minmax(180px, 0.82fr);
  gap: 14px;
}

.quick-search {
  padding-top: 18px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 14px;
}

.date-picker-row label,
.quick-search input,
.quick-search label,
.filter-button,
.date-button {
  min-height: 44px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: rgba(9, 14, 24, 0.76);
  color: var(--muted);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(18px);
}

.date-picker-row label {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 18px;
  font-weight: 700;
  white-space: nowrap;
}

.date-picker-row input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--text);
  font-weight: 800;
  outline: 0;
}

.date-picker-row label::before {
  content: "";
  display: none;
}

.quick-search input {
  width: 100%;
  padding: 0 22px;
  color: var(--text);
  outline: 0;
}

.quick-search input::placeholder {
  color: var(--muted);
}

.quick-search label {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 0 18px;
  font-weight: 700;
  white-space: nowrap;
}

.quick-search input[type="checkbox"] {
  width: 24px;
  height: 24px;
  min-height: 24px;
  accent-color: var(--pink);
}

.filter-button,
.date-button {
  min-width: max-content;
  padding: 0 16px;
  font-size: 0.92rem;
  font-weight: 800;
  white-space: nowrap;
  cursor: pointer;
  flex: 0 0 auto;
}

.filter-button.active,
.date-button.active {
  border-color: transparent;
  background: linear-gradient(135deg, var(--orange), var(--pink), var(--purple));
  color: #fff;
  box-shadow: 0 14px 34px rgba(255, 57, 182, 0.24);
}

.filter-button.active {
  border-color: rgba(125, 97, 255, 0.78);
  background: rgba(26, 19, 68, 0.86);
  color: #b7a7ff;
}

.content {
  width: min(1280px, 100%);
  margin: 0 auto;
  padding: 28px 20px 22px;
}

.message {
  display: none;
  margin-bottom: 14px;
  padding: 14px 16px;
  border: 1px solid rgba(255, 176, 83, 0.34);
  border-radius: 16px;
  background: rgba(255, 176, 83, 0.1);
  color: #ffd19a;
  line-height: 1.35;
}

.message.show {
  display: block;
}

.section-title {
  margin: 0 0 16px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.section-title h2 {
  margin: 0;
  color: var(--text);
  font-size: clamp(1.65rem, 5vw, 2.2rem);
  letter-spacing: 0;
}

.section-title h2::before {
  content: "〽";
  margin-right: 10px;
  color: var(--pink);
}

.event-count {
  color: var(--muted);
  font-size: 1rem;
  white-space: nowrap;
}

.event-list {
  display: grid;
  gap: 18px;
}

.event-card {
  display: grid;
  grid-template-columns: minmax(180px, 0.78fr) minmax(0, 1.18fr);
  gap: 22px;
  padding: 22px;
  border: 1px solid var(--border-strong);
  border-radius: 28px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)),
    var(--surface);
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
}

.event-card.highlight {
  border-color: rgba(255, 176, 83, 0.5);
}

.event-card.shared-focus {
  outline: 4px solid rgba(255, 57, 182, 0.72);
  outline-offset: 3px;
}

.event-card.cancelled {
  opacity: 0.64;
}

.event-art {
  min-height: 230px;
  border-radius: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #fff;
  background:
    linear-gradient(180deg, rgba(5, 8, 18, 0.1), rgba(5, 8, 18, 0.52)),
    radial-gradient(circle at 30% 20%, rgba(255, 112, 72, 0.88), transparent 24%),
    radial-gradient(circle at 82% 16%, rgba(82, 98, 255, 0.82), transparent 28%),
    linear-gradient(145deg, #2b0c1f, #06133a 55%, #13051c);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.event-art strong {
  font-size: clamp(1.8rem, 6vw, 2.45rem);
  line-height: 0.95;
  text-transform: uppercase;
  text-shadow: 0 5px 24px rgba(0, 0, 0, 0.48);
}

.event-art small,
.event-art em {
  display: block;
  font-style: normal;
  font-weight: 800;
}

.event-art small {
  opacity: 0.86;
  text-transform: uppercase;
}

.event-art em {
  margin-top: 8px;
}

.event-art-badge {
  width: fit-content;
  padding: 7px 12px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--orange), var(--pink));
  font-size: 0.82rem;
  font-weight: 900;
}

.event-info {
  min-width: 0;
}

.badge-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 0 0 10px;
}

.badge {
  min-height: 30px;
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
  border-radius: 9px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.08);
  color: var(--muted);
  font-size: 0.86rem;
  font-weight: 800;
}

.badge.hot {
  border-color: rgba(255, 176, 83, 0.44);
  color: #ffd166;
}

.badge.free {
  border-color: rgba(15, 159, 122, 0.4);
  color: #6ee7b7;
}

.badge.cancelled {
  border-color: rgba(255, 90, 90, 0.42);
  color: #ff9b9b;
}

.badge.no-map {
  color: #c5cad8;
}

.event-card h3 {
  margin: 0 0 10px;
  color: var(--text);
  font-size: clamp(1.55rem, 4vw, 2rem);
  letter-spacing: 0;
}

.event-meta {
  margin: 8px 0;
  color: var(--muted);
  line-height: 1.45;
  font-size: 1rem;
}

.event-meta strong {
  color: #dfe3ef;
}

.attraction-list {
  margin: 12px 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}

.attraction-list li {
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text);
  font-weight: 800;
  line-height: 1.25;
}

.attraction-list span {
  display: block;
  margin-top: 4px;
  color: var(--muted);
  font-size: 0.9rem;
  font-weight: 400;
}

.card-actions {
  margin-top: 18px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-link,
.action-button {
  min-height: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  border-radius: 14px;
  border: 0;
  background: linear-gradient(135deg, var(--blue-strong), var(--purple), var(--pink));
  color: #fff;
  text-decoration: none;
  font: inherit;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 12px 28px rgba(82, 98, 255, 0.24);
}

.action-link.secondary,
.action-button.secondary {
  background: transparent;
  color: #d3d7e5;
  border: 1px solid var(--border-strong);
  box-shadow: none;
}

.empty-state {
  margin: 0;
  padding: 18px;
  border: 1px dashed var(--border-strong);
  border-radius: 22px;
  color: var(--muted);
  background: rgba(255, 255, 255, 0.04);
  line-height: 1.4;
}

.admin-link,
.ambassador-link {
  display: none;
}

.bottom-nav {
  position: fixed;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  width: min(760px, calc(100% - 32px));
  z-index: 950;
  min-height: 76px;
  padding: 8px 12px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
  border: 1px solid var(--border);
  border-radius: 24px;
  background: rgba(8, 12, 22, 0.92);
  box-shadow: 0 -18px 50px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(22px);
}

.bottom-nav a {
  min-width: 0;
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  color: var(--muted-2);
  text-decoration: none;
  font-weight: 700;
  text-align: center;
  font-size: 0.88rem;
  line-height: 1.1;
}

.bottom-nav a.active {
  color: #8f7cff;
  background: rgba(82, 98, 255, 0.1);
}

.popup-card {
  min-width: 220px;
  max-width: 280px;
  color: #111827;
  line-height: 1.35;
}

.popup-card h2 {
  margin: 0 0 8px;
  color: #08245c;
  font-size: 1.05rem;
  letter-spacing: 0;
}

.popup-card p {
  margin: 5px 0;
  font-size: 0.95rem;
}

.popup-card a {
  min-height: 38px;
  margin-top: 8px;
  display: inline-flex;
  align-items: center;
  padding: 0 11px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--orange), var(--pink));
  color: #fff;
  text-decoration: none;
  font-weight: 700;
}

@media (max-width: 760px) {
  .topbar {
    min-height: 88px;
    align-items: flex-end;
    border-bottom-left-radius: 18px;
    border-bottom-right-radius: 18px;
    padding: 14px 16px 12px;
    gap: 12px;
  }

  .brand h1 {
    font-size: 1.55rem;
  }

  .brand p {
    margin-top: 5px;
    max-width: 220px;
    font-size: 0.84rem;
    line-height: 1.18;
  }

  .icon-button {
    width: 46px;
    height: 46px;
    border-radius: 14px;
    font-size: 1.12rem;
  }

  #map {
    height: 160px;
    min-height: 160px;
  }

  .date-tabs,
  .date-picker-row,
  .filters,
  .quick-search {
    padding-inline: 18px;
  }

  .date-tabs {
    padding-top: 12px;
    display: flex;
    gap: 8px;
    overflow-x: auto;
  }

  .date-tabs .date-button {
    min-width: max-content;
    min-height: 40px;
    padding-inline: 13px;
    font-size: 0.84rem;
  }

  .date-picker-row {
    padding-top: 12px;
    grid-template-columns: minmax(0, 1fr) minmax(112px, 0.62fr);
    gap: 10px;
  }

  .quick-search {
    padding-top: 12px;
    grid-template-columns: minmax(0, 1fr) minmax(92px, auto);
    gap: 10px;
  }

  .filters {
    padding-top: 12px;
    gap: 9px;
  }

  .date-picker-row label,
  .quick-search input,
  .quick-search label,
  .filter-button,
  .date-button {
    min-height: 42px;
    border-radius: 13px;
  }

  .date-picker-row label {
    gap: 8px;
    padding: 0 10px;
    font-size: 0.92rem;
  }

  .date-picker-row label::before {
    content: "";
    display: none;
  }

  .date-picker-row input {
    font-size: 0.95rem;
  }

  #clearDateButton {
    padding-inline: 10px;
    font-size: 0.82rem;
    line-height: 1.05;
  }

  .quick-search input {
    padding: 0 16px;
    font-size: 0.95rem;
  }

  .quick-search label {
    justify-content: center;
    padding: 0 12px;
    font-size: 0.95rem;
  }

  .filter-button {
    min-height: 40px;
    padding: 0 14px;
    font-size: 0.86rem;
  }

  .content {
    padding: 20px 18px 18px;
  }

  .event-card {
    grid-template-columns: 1fr;
    gap: 18px;
    padding: 20px;
  }

  .event-art {
    min-height: 210px;
  }

  .section-title {
    align-items: flex-start;
    flex-direction: column;
  }

  .event-count {
    white-space: normal;
  }

  .bottom-nav {
    left: 0;
    right: 0;
    bottom: 0;
    width: auto;
    transform: none;
    min-height: 70px;
    padding: 8px 10px max(8px, env(safe-area-inset-bottom));
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 4px;
    border-left: 0;
    border-right: 0;
    border-bottom: 0;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .bottom-nav a {
    min-height: 52px;
    border-radius: 16px;
    font-size: 0.78rem;
    line-height: 1.1;
  }
}

@media (max-width: 430px) {
  .topbar {
    padding: 18px 18px 16px;
  }

  .filters {
    flex-wrap: nowrap;
  }

  .date-tabs {
    gap: 7px;
  }

  .date-tabs .date-button {
    font-size: 0.82rem;
    padding-inline: 12px;
  }

  .card-actions > * {
    flex: 1 1 100%;
  }
}
`;
