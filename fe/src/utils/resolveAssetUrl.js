export function getBackendBaseUrl() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost/api'
  try {
    const url = new URL(apiUrl)
    // strip trailing /api if present
    const withoutApi = url.pathname.endsWith('/api')
      ? `${url.origin}${url.pathname.slice(0, -4)}`
      : `${url.origin}${url.pathname}`
    return withoutApi.replace(/\/+$/, '')
  } catch {
    return 'http://127.0.0.1:8000'
  }
}

export function resolveAssetUrl(path) {
  if (!path) return ''
  // If already absolute (http or https or data), return as-is
  if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:')) return path
  // If root-relative like /images/..., prefix backend base
  if (path.startsWith('/')) return `${getBackendBaseUrl()}${path}`
  // Otherwise return as-is (relative within FE public)
  return path
}

export function absolutizeHtmlImageSrc(html) {
  if (!html) return html
  // Replace src="/something" with src="http://backend/something"
  const base = getBackendBaseUrl()
  return html.replace(
    /(<img[^>]+src=["'])(\/[^"'>]+)(["'][^>]*>)/gi,
    (_m, p1, src, p3) => `${p1}${base}${src}${p3}`
  )
}


