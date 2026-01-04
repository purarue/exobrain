// this is loaded in the header of the site,
// it sets up the search bar using stork
(() => {
  const wrapper = document.querySelector(".stork-wrapper-dark");
  if (!wrapper) {
    console.error("Stork wrapper not found");
    return;
  }
  const storkUrl = wrapper.dataset.indexUrl;
  if (typeof storkUrl !== "string") {
    console.error("Stork URL not found");
  }
  stork.register("search", storkUrl);
  const si = document.querySelector(".stork-input");
  const toggleSearch = () => {
    if (wrapper.classList.contains("hide")) {
      wrapper.classList.remove("hide");
      si.focus();
    } else {
      wrapper.classList.add("hide");
    }
  };
  document
    .querySelector(".search-icon")
    .addEventListener("click", toggleSearch);
  // check the URL for 'search' GET arg
  // if its there, open the search bar
  const params = new URLSearchParams(window.location.search);
  if (params.get("search") !== null) {
    toggleSearch();
  }
  // if user hits Ctrl+K, open the search bar
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey && e.key === "k") || e.key === "/") {
      toggleSearch();
      e.preventDefault();
    }
  });
})();
