import { xhr } from './xhr-util';
import { prefetchNextPageData } from './prefetch-util';

(() => {
  const removePages = () => {
    const main = document.querySelector('main');
    if (main.children.length) {
      Array.from(main.children).forEach(child => child.remove());
    }
  }

  const createPage = page => {
    const main = document.querySelector('main');
    const pageElem = document.createElement(`page-${page}`);
    main.appendChild(pageElem);
    return pageElem;
  }

  const setPageData = (pageElem, data) => {
    try {
      const json = JSON.parse(data);
      if (pageElem.setData && typeof pageElem.setData === 'function') {
        pageElem.setData(json)
          .then(() => {
            dispatchEvent(new CustomEvent('basework-complete', { bubbles: true }));
          });
      }
    } catch (error) {
      console.error('Failed to parse page data', error);
    }
  }

  const prerenderNextPages = (page, shouldPrerender) => {
    if (shouldPrerender) {
      try {
        prefetchNextPageData(page);
      } catch (error) {
        console.warn('Failed to prefetch next page data', error);
      }
    }
  }

  const navigate = path => {

    // Start page resolution
    let page = path === '/' ? 'index' : path.substr(1);

    // Check if is prerendering
    const params = new URLSearchParams(window.location.search);
    const isPrerendering = !!params.get('prerender');
    const prerenderRoute = params.get('prerender');
    if (prerenderRoute) {
      page = prerenderRoute;
    }

    // Remove old template
    removePages();

    // Fetch bundle and render template
    import(/* webpackChunkName: "[request]", webpackInclude: /\.js$/ */ `../pages/${page}`).then(() => {
      const pageElem = createPage(page);
      xhr(`${page}-data.json`)
        .then(data => {
          setPageData(pageElem, data);
          prerenderNextPages(pageElem, !isPrerendering);
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