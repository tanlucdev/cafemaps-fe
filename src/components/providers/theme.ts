export const THEME_STORAGE_KEY = "cafe-maps-theme";
export type Theme = "light" | "dark";
type ThemeStorage = Pick<Storage, "getItem" | "setItem">;
const DARK_THEME_COLOR = "#24211D";
const LIGHT_THEME_COLOR = "#fdf6ec";

export function resolveTheme(value: string | null): Theme {
  return value === "dark" ? "dark" : "light";
}

export function readStoredTheme(getStorage: () => Pick<ThemeStorage, "getItem"> | null): Theme {
  try {
    return resolveTheme(getStorage()?.getItem(THEME_STORAGE_KEY) ?? null);
  } catch {
    return "light";
  }
}

export function persistTheme(theme: Theme, getStorage: () => Pick<ThemeStorage, "setItem"> | null) {
  try {
    getStorage()?.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable in private browsing modes.
  }
}

export function themeColor(theme: Theme) {
  return theme === "dark" ? DARK_THEME_COLOR : LIGHT_THEME_COLOR;
}

export const themeBootstrap = `(function(){var t='light';try{t=localStorage.getItem('${THEME_STORAGE_KEY}')==='dark'?'dark':'light'}catch(e){}var d=document.documentElement;d.classList.toggle('dark',t==='dark');d.dataset.theme=t;d.style.colorScheme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=t==='dark'?'${DARK_THEME_COLOR}':'${LIGHT_THEME_COLOR}'})();`;
