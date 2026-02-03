import App from './App.svelte'

// CSS will be injected by build process - this is a placeholder
// In production, CSS_CONTENT will be replaced with actual CSS string
const WIDGET_CSS = `/*CSS_PLACEHOLDER*/`

/**
 * OTP Widget with Shadow DOM
 * Supports 3 integration modes:
 * 
 * 1. ONE LINE (Script tag attributes):
 *    <script src="otp-widget.js" data-reqotp="URL" data-verifyotp="URL"></script>
 * 
 * 2. Custom Element:
 *    <otp-widget reqotp="URL" verifyotp="URL"></otp-widget>
 * 
 * 3. Legacy (div with id):
 *    <div id="otp-widget" reqotp="URL" verifyotp="URL"></div>
 */

class OtpWidgetManager {
  constructor() {
    this.widgets = new Map()
  }

  createShadowContainer(targetId = null) {
    // Create container element
    const container = document.createElement('div')
    container.id = targetId || `otp-widget-${Date.now()}`
    
    // Attach shadow root (closed for security)
    const shadowRoot = container.attachShadow({ mode: 'closed' })
    
    // Create inner container for Svelte
    const innerContainer = document.createElement('div')
    innerContainer.style.cssText = 'position: fixed; inset: 0; z-index: 9999;'
    
    // Inject styles
    if (WIDGET_CSS && WIDGET_CSS !== '/*CSS_PLACEHOLDER*/') {
      const style = document.createElement('style')
      style.textContent = WIDGET_CSS
      shadowRoot.appendChild(style)
    }
    
    // Also inject Tailwind CDN as fallback (optional)
    const tailwindLink = document.createElement('link')
    tailwindLink.rel = 'stylesheet'
    tailwindLink.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@3/dist/tailwind.min.css'
    shadowRoot.appendChild(tailwindLink)
    
    shadowRoot.appendChild(innerContainer)
    
    return { container, shadowRoot, innerContainer }
  }

  mount(targetElement, props) {
    // Clear target
    targetElement.innerHTML = ''
    
    const { shadowRoot, innerContainer } = this.createShadowContainer()
    targetElement.appendChild(shadowRoot.host || targetElement)
    
    // Mount Svelte app
    const app = new App({
      target: innerContainer,
      props
    })
    
    this.widgets.set(targetElement.id || Date.now(), { app, shadowRoot })
    
    return app
  }

  init() {
    const manager = this
    
    // Mode 1: Script tag with data attributes (ONE LINE!)
    const scriptTag = document.currentScript || 
                      document.querySelector('script[data-reqotp][data-verifyotp]')
    
    if (scriptTag) {
      const props = {
        vp_url: scriptTag.getAttribute('data-reqotp'),
        votp_url: scriptTag.getAttribute('data-verifyotp'),
        title: scriptTag.getAttribute('data-title') || 'Verifikasi OTP',
        notRegisteredMessage: scriptTag.getAttribute('data-not-registered-message') || 
                              'Nomor HP tidak ditemukan'
      }
      
      if (props.vp_url && props.votp_url) {
        console.log('[OTP Widget] One-line integration detected')
        const container = document.createElement('div')
        document.body.appendChild(container)
        return this.mount(container, props)
      }
    }
    
    // Mode 2: Custom <otp-widget> elements
    document.querySelectorAll('otp-widget').forEach((el, index) => {
      const props = {
        vp_url: el.getAttribute('reqotp'),
        votp_url: el.getAttribute('verifyotp'),
        title: el.getAttribute('title') || 'Verifikasi OTP',
        notRegisteredMessage: el.getAttribute('not-registered-message') || 
                              'Nomor HP tidak ditemukan'
      }
      
      if (props.vp_url && props.votp_url) {
        console.log(`[OTP Widget] Custom element #${index + 1} detected`)
        const wrapper = document.createElement('div')
        el.parentNode.insertBefore(wrapper, el)
        el.remove()
        this.mount(wrapper, props)
      }
    })
    
    // Mode 3: Legacy div#otp-widget
    const legacyDiv = document.getElementById('otp-widget')
    if (legacyDiv) {
      console.log('[OTP Widget] Legacy integration detected')
      const props = {
        vp_url: legacyDiv.getAttribute('reqotp'),
        votp_url: legacyDiv.getAttribute('verifyotp'),
        title: legacyDiv.getAttribute('title') || 'Verifikasi OTP',
        notRegisteredMessage: legacyDiv.getAttribute('not-registered-message') || 
                              'Nomor HP tidak ditemukan'
      }
      return this.mount(legacyDiv, props)
    }
  }
}

// Auto-initialize
const widgetManager = new OtpWidgetManager()

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => widgetManager.init())
} else {
  widgetManager.init()
}

export default widgetManager
