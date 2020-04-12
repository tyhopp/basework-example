import template from './basework-card.html';
import './basework-card.css';

class BaseworkCard extends HTMLElement {

  connectedCallback() {
    if (!this._initialized) {
      this.appendChild(document.getTemplate(template));
      this._title = this.querySelector('.basework-card-title');
      this._body = this.querySelector('.basework-card-body');
      this._initialized = true;
    }
  }

  setData({ title, body } = {}) {
    this._title.textContent = title;
    this._body.innerHTML = body;
  }
}

customElements.define('basework-card', BaseworkCard);