function theme({ callback }) {
  const preference = window.matchMedia('(prefers-color-scheme: dark)');

  const internalCallback = e => {
    const theme = e.matches ? 'dark' : 'light';
    callback(theme);
  }

  return {
    initial: preference.matches ? 'dark' : 'light',
    subscribe: () => {
      preference.addListener(internalCallback);
    },
    unsubscribe: () => {
      preference.removeListener(internalCallback);
    }
  }
}

export {
  theme
}