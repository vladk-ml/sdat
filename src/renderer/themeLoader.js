/**
 * Theme loader for SeekerAug (VS Code-style)
 * Loads a theme JSON file and injects its colors as CSS variables on the document root.
 */

export async function loadAndApplyTheme(themeName = "dark") {
  try {
    const res = await fetch(`themes/${themeName}.json`);
    if (!res.ok) throw new Error("Theme not found");
    const theme = await res.json();
    Object.entries(theme).forEach(([key, value]) => {
      const cssVar = "--" + key.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
      document.documentElement.style.setProperty(cssVar, value);
      if (document.body) document.body.style.setProperty(cssVar, value);
      const root = document.getElementById("root");
      if (root) root.style.setProperty(cssVar, value);
    });
  } catch (err) {
    // Fallback: set a minimal dark theme
    document.documentElement.style.setProperty("--background-primary", "#1E1E1E");
    document.documentElement.style.setProperty("--foreground-primary", "#CCCCCC");
    document.documentElement.style.setProperty("--accent-primary", "#0078D4");
    document.documentElement.style.setProperty("--border-color", "#474747");
  }
}
