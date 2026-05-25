export function getElement<T extends HTMLElement = any>(id: string) {
  const element = document.getElementById(id);

  if (!element) {
    throw new Error(`Elemento #${id} nao encontrado no admin.`);
  }

  return element as T;
}

export function getInput(id: string) {
  return getElement<HTMLInputElement>(id);
}

export function getSelect(id: string) {
  return getElement<HTMLSelectElement>(id);
}

export function getForm(id: string) {
  return getElement<HTMLFormElement>(id);
}

export function getButton(id: string) {
  return getElement<HTMLButtonElement>(id);
}
