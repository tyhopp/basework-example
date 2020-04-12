import { routes } from '../routes.js';
import { xhr } from './xhr-util';
import { prefetchNextPageData } from './prefetch-util';

// TODO - Move this router into core Basework

(() => {
  const navigate = path => {
    const main = document.querySelector('main');

    // Check if is prerendering
    const params = new URLSearchParams(window.location.search);
    const prerenderRoute = params.get('prerender');
    const route = prerenderRoute
      ? prerenderRoute
      : routes[path] ? routes[path] : 'not-found';

    // Remove old template
    if (main.children.length) {
      Array.from(main.children).forEach(child => child.remove());
    }

    // Fetch bundle and render template
    import(/* webpackChunkName: "[request]", webpackInclude: /\.js$/ */ `../pages/${route}`)
      .then(() => {
        const page = document.createElement(`page-${route}`);
        main.appendChild(page);
        
        // TODO - Create caching mechanism, or decide to leave caching to browser
        
        xhr(`${route}-data.json`)
          .then(data => {
            try {
              const json = JSON.parse(data);
              if (page.setData && typeof page.setData === 'function') {
                page.setData(json);
              }
            } catch (error) {
              console.error('Failed to parse page data', error);
            }

            try {
              prefetchNextPageData(page);
            } catch (error) {
              console.warn('Failed to prefetch next page data', error);
            }
          })
          .catch(error => {
            console.error('Failed to fetch page data', error);
          });
      });
  }

  navigate(window.location.pathname);

  window.addEventListener('popstate', () => {
    navigate(window.location.pathname);
  });

  document.addEventListener('click', e => {
    const anchor = e.target.closest('a');
    if (anchor && anchor.target !== '_blank') {
      e.preventDefault();
      
      const url = anchor.href;
      const state = anchor.state ? { url, ...JSON.parse(anchor.state) } : { url };

      try {
        history.pushState(state, null, url);
        dispatchEvent(new PopStateEvent('popstate', { state }));
      } catch (e) {
        window.location.assign(url);
      }
    }
  });
})();