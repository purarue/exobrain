---
Title: CSS/JS Frameworks
---

* CSS Frameworks
  * Obvious mention of [Bootstrap](https://getbootstrap.com/)
  * [Tailwind](https://tailwindcss.com/) - more utility focused
* JavaScript
  * Bundling:
    * [`babel`](https://babeljs.io/) - transcompile JS to older version of JS. (ES6 -> back)
    * [`webpack`](https://webpack.js.org/) - bundler
    * [`parcel`](https://parceljs.org/) - fatser, webpack alternative (less supported though)
  * Frameworks
    * [`React`](https://reactjs.org/) (Largest community support, which is nice)
      * [`Next.js`](https://nextjs.org/) - React based, (can handle frontend/backend). Isn't as mature, but nice for basic routing on SSGs.
      * Tools:
        * [`react-router`](https://reactrouter.com/)
        * [`clsx`](https://github.com/lukeed/clsx/) (shorthand for ternary class names/styling)
        * [`react-loading-skeleton`](https://github.com/dvtng/react-loading-skeleton) - grey bars while loading page content
    * [`Svelte`](https://svelte.dev/) - compiled from its own JSX-like language, handles basic state for animation/interactivity nicely without complex state management
    * [`jQuery`](https://jquery.com/) - mainly for animation/basic requests, but `fetch`/`CSS3` could probably replace this
    * [`Vue.js`](https://vuejs.org/) - feel like the compile step doesn't do as much as it should, would rather use `Svelte`