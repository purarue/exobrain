const attach = async () => {
  // this changes the 'Exobrain' title in the top left to 'Editor'
  // if my server is running on port 12593, and the current page is an article
  //
  // get slug from article if it exists
  const slugEl = document.querySelector("article[data-slug]");
  if (!slugEl) {
    return;
  }
  // get the data attr from the article
  const slug = slugEl.getAttribute("data-slug");
  if (!slug) {
    return;
  }
  // check if server is up
  const resp = await fetch(`http://localhost:12593/ping`).catch(() => {});
  if (!resp) {
    return;
  }
  if (resp.status !== 200) {
    return;
  }

  // change the top-left button to open in editor
  const title = document.querySelector("nav h2");
  title.innerText = "Editor";
  title.addEventListener("click", () =>
    fetch(`http://localhost:12593/launch?file=${slug}`),
  );
  title.style.cursor = "pointer";
  title.style.textDecoration = "underline";
  title.role = "button";
};

// NOTE: disabled this for now because on certain browsers it asks the user
// for permission before sending a request to localhost, which is not something
// I want to do. may re-enable this by having me set something in localstorage
// using a userscript or something in the future (or just not have it)
//
// attach()
