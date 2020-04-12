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
  const anchors = Array.from(currentPage.querySelectorAll(`a[href^="/"]`));
  const paths = new Set(anchors.map(anchor => getUrlParts(anchor.href).pathname.replace(/\//, '')));
  const requests = Array.from(paths).map(path => xhr(`${path}-data.json`));
  Promise.all(requests)
    .catch(error => {
      console.warn(`Failed to prefetch page data`, error);
    });
}

export {
  prefetchNextPageData
}