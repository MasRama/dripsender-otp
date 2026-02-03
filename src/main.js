import App from './App.svelte'
import compiledCss from './compiled.css?inline'

// Detect environment
const isDev = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
const API_BASE = isDev ? 'http://localhost:6544' : 'https://api.dripsender.id'

// Get key from script tag
const script = document.currentScript
const key = script?.getAttribute('data-id') || script?.getAttribute('data-key')

function initWidget() {
  if (!key) {
    console.error('[OTP Widget] Missing data-id attribute')
    return
  }

  // Fetch config and mount
  fetch(`${API_BASE}/api/otp/config/${key}`)
    .then(r => r.json())
    .then(config => {
      if (config.error) {
        console.error('[OTP Widget] Config error:', config.error)
        return
      }
      
      // Create container - MUST be fixed position to cover screen
      const container = document.createElement('div')
      container.id = 'otp-widget-container'
      container.style.cssText = 'position: fixed; inset: 0; z-index: 9999;'
      document.body.appendChild(container)
      
      const shadow = container.attachShadow({ mode: 'closed' })
      
      // Inject compiled CSS into Shadow DOM
      const style = document.createElement('style')
      style.textContent = compiledCss
      shadow.appendChild(style)
      
      // Mount point
      const mountPoint = document.createElement('div')
      mountPoint.style.cssText = 'width: 100%; height: 100%;'
      shadow.appendChild(mountPoint)
      
      // Mount Svelte app
      new App({
        target: mountPoint,
        props: {
          vp_url: config.r,  // request otp url
          votp_url: config.v, // verify otp url
          title: config.t,
          rememberHours: config.m || 0
        }
      })
    })
    .catch(err => {
      console.error('[OTP Widget] Failed to load config:', err)
    })
}

// Global prevention of form submissions (for Shadow DOM edge cases)
if (typeof window !== 'undefined') {
  // Block all click events that might cause navigation
  document.addEventListener('click', (e) => {
    const target = e.target
    if (target.tagName === 'A' && !target.getAttribute('href')?.startsWith('#')) {
      console.log('[OTP Widget] Blocked link click')
      e.preventDefault()
    }
  }, true)
  
  window.addEventListener('submit', (e) => {
    console.log('[OTP Widget] Blocked form submit')
    e.preventDefault()
    e.stopPropagation()
    return false
  }, true)
}

// Auto-initialize
initWidget()

export default {}
