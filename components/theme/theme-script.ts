/**
 * Inline script run before paint to avoid theme flash.
 * Mirrors logic in ThemeProvider (localStorage + prefers-color-scheme).
 */
export const themeInitScript = `(function(){try{var k='dev-atlas-theme';var t=localStorage.getItem(k);if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}var r=document.documentElement;r.classList.toggle('dark',t==='dark');r.style.colorScheme=t}catch(e){}})();`;
