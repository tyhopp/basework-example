(() => {
  document.getTemplate = template => document.createRange().createContextualFragment(template).firstElementChild.content;
})();