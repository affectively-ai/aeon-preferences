export function sanitizeCss(css: string | undefined | null): string | undefined {
  if (!css) {
    return css as any;
  }

  // Remove any attempts to break out of a <style> block
  let sanitized = css.replace(/<\/style>/gi, '');
  sanitized = sanitized.replace(/<style[^>]*>/gi, '');
  
  // Remove attempts to inject scripts via old IE expressions or bindings
  sanitized = sanitized.replace(/expression\s*\(/gi, '');
  sanitized = sanitized.replace(/-moz-binding/gi, '');
  
  // Remove javascript: and vbscript: URIs
  sanitized = sanitized.replace(/url\s*\(\s*['"]?(javascript|vbscript):/gi, 'url(');
  
  return sanitized;
}
