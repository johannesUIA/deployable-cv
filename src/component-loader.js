// Simple ES module component loader
// Finds elements with `data-include` and fetches the HTML fragment into them.
// After all includes are loaded, dispatches a `components:loaded` event on window.

async function loadIncludes() {
  const includes = Array.from(document.querySelectorAll('[data-include]'));
  await Promise.all(includes.map(async (el) => {
    const url = el.getAttribute('data-include');
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
      const text = await res.text();
      el.innerHTML = text;

      // Execute any inline scripts included in the fragment
      const scripts = Array.from(el.querySelectorAll('script'));
      for (const s of scripts) {
        const newScript = document.createElement('script');
        if (s.src) {
          newScript.src = s.src;
          newScript.async = false;
        } else {
          newScript.textContent = s.textContent;
        }
        s.parentNode.replaceChild(newScript, s);
      }
    } catch (err) {
      console.error(err);
      el.innerHTML = `<!-- Error loading ${url} -->`;
    }
  }));

  // Notify that components are loaded
  window.dispatchEvent(new Event('components:loaded'));
}

// Run on DOMContentLoaded to ensure placeholders exist
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadIncludes);
} else {
  loadIncludes();
}

export default loadIncludes;
