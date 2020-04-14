import { xhr } from './xhr-util';

function getUrlParts(url) {
  let a = document.createElement('a');
  a.href = url;

  return {
    href: a.href,
    host: a.host,
    hostname: a.hostname,
    port: a.port,
    pathname: a.pathname,
    protocol: a.protocol,
    hash: a.hash,
    search: a.search
  };
}

// TODO - Do this in a worker
function prefetchNextPageData(currentPage) {

  // Get all internal links on the page
  const anchors = Array.from(currentPage.querySelectorAll(`a[href^="/"]`))
    .map(anchor => getUrlParts(anchor.href).pathname.replace(/\//, ''))
    .filter(anchor => anchor.length);

  // Ensure paths to internal pages are unique
  const paths = new Set(anchors);

  // Fetch the next page's data ahead of time
  const requests = Array.from(paths).map(path => xhr(`${path}-data.json`));
  Promise.all(requests)
    .catch(error => {
      console.warn(`Failed to prefetch page data`, error);
    });
}

export {
  prefetchNextPageData
}