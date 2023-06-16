import { queryAssignedElementContent } from './query-assigned-element-content.js';

class DecoElement extends HTMLElement {
  @queryAssignedElementContent({
    slotName: 'list',
    contentSelector: 'li',
  })
  accessor listElements!: Array<HTMLLIElement>;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `<slot name="list"></slot>`;

    this.listElements.forEach(listElement =>
      listElement.addEventListener('click', e => {
        (e.target as HTMLLIElement).classList.toggle('active');
      })
    );
  }
}

customElements.define('deco-element', DecoElement);
