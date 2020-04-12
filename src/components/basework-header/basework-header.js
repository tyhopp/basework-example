import template from './basework-header.html';
import './basework-header.css';

class BaseworkHeader extends HTMLElement {
  constructor() {
    super();
    this._setCurrentNav = this._setCurrentNav.bind(this);
  }

  connectedCallback() {
    if (!this._initialized) {
      if (!this.children.length) { // TODO - Figure out why double links appended in prod
        this.appendChild(document.getTemplate(template));
      }
      this._setCurrentNav();
      this._setListeners(true);
      this._initialized = true;
    }
  }

  disconnectedCallback() {
    this._setListeners(false);
  }

  _setCurrentNav() {
    const navs = this.querySelectorAll('.basework-header-nav');
    Array.from(navs).forEach(nav => {
      const isCurrentRoute = nav.href === window.location.href;
      nav.classList[isCurrentRoute ? 'add' : 'remove']('basework-header-nav--current');
    });
  }

  _setListeners(flag) {
    const fnName = flag ? 'addEventListener' : 'removeEventListener';
    window[fnName]('popstate', this._setCurrentNav);
  }
}

customElements.define('basework-header', BaseworkHeader);