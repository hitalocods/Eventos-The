export const patrocinadoresStyles = `
:root {
  --navy: #08245c;
  --blue: #1463ff;
  --orange: #ff6b35;
  --pink: #e83e8c;
  --yellow: #ffd166;
  --ink: #111827;
  --muted: #667085;
  --line: #e6e0d2;
  --paper: #fffdf8;
  --card: #ffffff;
  --soft: #f4efe4;
  --shadow: 0 14px 34px rgba(17, 24, 39, 0.1);
}

* {
  box-sizing: border-box;
}

html,
body {
  min-height: 100%;
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  color: var(--ink);
  background: linear-gradient(180deg, #fff9ec 0%, #f7f3ea 42%, #edf4ff 100%);
}

.sponsor-topbar {
  min-height: 64px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  background: var(--navy);
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 8px 22px rgba(8, 36, 92, 0.22);
}

.sponsor-brand h1 {
  margin: 0;
  font-size: 1.12rem;
  line-height: 1.1;
}

.sponsor-brand p {
  margin: 4px 0 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.84rem;
}

.sponsor-link,
.sponsor-button {
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 13px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #fff;
  color: var(--navy);
  font: inherit;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
}

.sponsor-link.dark {
  border-color: rgba(255, 255, 255, 0.32);
  background: transparent;
  color: #fff;
}

.sponsor-button.primary {
  border: 0;
  background: linear-gradient(135deg, var(--orange), var(--pink));
  color: #fff;
  box-shadow: 0 8px 20px rgba(232, 62, 140, 0.22);
}

.sponsor-page {
  width: min(1040px, 100%);
  margin: 0 auto;
  padding: 18px 14px 36px;
}

.sponsor-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(300px, 0.72fr);
  gap: 16px;
  align-items: stretch;
  margin-bottom: 16px;
}

.sponsor-copy {
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--card);
  box-shadow: var(--shadow);
}

.sponsor-eyebrow {
  width: fit-content;
  margin: 0 0 9px;
  padding: 5px 9px;
  border: 1px solid #f0d39a;
  border-radius: 999px;
  background: #fff4d8;
  color: #7a4a00;
  font-size: 0.78rem;
  font-weight: 700;
}

.sponsor-copy h2 {
  max-width: 760px;
  margin: 0;
  color: var(--navy);
  font-size: clamp(1.95rem, 5vw, 3.3rem);
  line-height: 1;
  letter-spacing: 0;
}

.sponsor-copy p {
  max-width: 700px;
  margin: 12px 0 0;
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.5;
}

.sponsor-media {
  min-height: 300px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--line);
  background: var(--soft);
  box-shadow: var(--shadow);
}

.sponsor-media img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.sponsor-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin: 16px 0;
}

.sponsor-card,
.sponsor-panel {
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--card);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.sponsor-card {
  padding: 15px;
}

.sponsor-card.featured {
  border-color: rgba(255, 107, 53, 0.52);
  box-shadow: 0 18px 42px rgba(255, 107, 53, 0.16);
}

.sponsor-card h3,
.sponsor-panel h3 {
  margin: 0;
  color: var(--navy);
  font-size: 1.08rem;
  line-height: 1.15;
}

.sponsor-price {
  margin: 10px 0;
  color: var(--blue);
  font-size: 1.65rem;
  font-weight: 800;
}

.sponsor-card p,
.sponsor-card li,
.sponsor-panel p {
  color: var(--muted);
  line-height: 1.42;
}

.sponsor-card ul {
  margin: 0;
  padding-left: 18px;
}

.sponsor-strip {
  margin: 16px 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.sponsor-strip div {
  padding: 13px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.72);
}

.sponsor-strip strong {
  display: block;
  color: var(--navy);
  font-size: 0.92rem;
  margin-bottom: 4px;
}

.sponsor-strip span {
  color: var(--muted);
  font-size: 0.88rem;
  line-height: 1.35;
}

.sponsor-panel {
  padding: 16px;
  position: relative;
}

.sponsor-panel::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 5px;
  background: linear-gradient(90deg, var(--orange), var(--pink), var(--blue));
}

.sponsor-panel h3 {
  margin-top: 6px;
}

.sponsor-form {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.sponsor-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.sponsor-form label {
  display: grid;
  gap: 6px;
  color: var(--navy);
  font-weight: 700;
}

.sponsor-form input,
.sponsor-form select,
.sponsor-form textarea {
  width: 100%;
  min-height: 46px;
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
  color: var(--ink);
  font: inherit;
}

.sponsor-form textarea {
  min-height: 116px;
  resize: vertical;
}

.sponsor-form input:focus,
.sponsor-form select:focus,
.sponsor-form textarea:focus {
  border-color: var(--blue);
  outline: 3px solid rgba(20, 99, 255, 0.16);
}

.sponsor-span-2 {
  grid-column: 1 / -1;
}

.sponsor-message {
  display: none;
  margin: 0;
  padding: 12px;
  border-radius: 8px;
  background: #ecfdf3;
  border: 1px solid #abefc6;
  color: #027a48;
  line-height: 1.35;
}

.sponsor-message.show {
  display: block;
}

.sponsor-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

@media (max-width: 840px) {
  .sponsor-hero,
  .sponsor-grid,
  .sponsor-strip,
  .sponsor-form-grid {
    grid-template-columns: 1fr;
  }

  .sponsor-span-2 {
    grid-column: auto;
  }
}

@media (max-width: 520px) {
  .sponsor-topbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .sponsor-link,
  .sponsor-button {
    width: 100%;
  }
}
`;

