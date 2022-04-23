const openInNewTab = (url: string) => {
  window.open && window.open(url, "_blank")?.focus();
};

export default openInNewTab;
