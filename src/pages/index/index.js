import template from './index.html';
import './index.css';
const importCard = import(/* webpackChunkName: "basework-card" */'components/basework-card/basework-card.js');

class Index extends HTMLElement {

  connectedCallback() {
    if (!this._initialized) {
      this.appendChild(document.getTemplate(template));
      this._cards = this.querySelector('.index-cards');
      this._initialized = true;
    }
  }

  // TODO - Consider a better interface for this
  prefetch() { 
    // Showcase that we can fetch actual data during the prefetch build step
    return fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(data => { // Trim data and add some markdown to showcase transform step
        const mockData = data.slice(0, 3).map(item => {
          item.title = `A card title`;
          item.body = 'A list of items that *was markdown* but was transformed into **html** by Basework:\n- Item 1\n- Item 2\n- Item 3';
          return item;
        });
        return mockData;
      })
      .then(data => {
        const transformations = {
          'markdown-to-html': ['data.body']
        }
        return { transformations, data }
      });
  }

  setData({ data }) {
    importCard.then(() => {
      data.forEach(({ title, body }) => {
        const card = document.createElement('basework-card');
        this._cards.appendChild(card);
        card.setData({ title, body });
      });
    });
  }
}

customElements.define('page-index', Index);