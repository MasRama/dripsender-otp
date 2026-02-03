import App from './App.svelte'
import styles from './app.css?inline'

// Function to create shadow DOM and mount widget
function createShadowWidget(target, props) {
  // Create shadow root
  const shadowRoot = target.attachShadow({ mode: 'closed' })
  
  // Create container inside shadow
  const container = document.createElement('div')
  container.id = 'otp-widget-container'
  
  // Inject CSS into shadow DOM
  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  
  shadowRoot.appendChild(styleSheet)
  shadowRoot.appendChild(container)
  
  // Mount Svelte app to container inside shadow
  const app = new App({
    target: container,
    props
  })
  
  return { app, shadowRoot }
}

// Auto-initialization modes
function initOtpWidget() {
  // Mode 1: Legacy div#otp-widget
  const legacyTarget = document.getElementById('otp-widget')
  if (legacyTarget) {
    const vp_url = legacyTarget.getAttribute('reqotp')
    const votp_url = legacyTarget.getAttribute('verifyotp')
    const title = legacyTarget.getAttribute('title') || 'Verifikasi OTP'
    const notRegisteredMessage = legacyTarget.getAttribute('not-registered-message') || 'Nomor HP tidak ditemukan'
    
    console.log('[OTP Widget] Initializing in Shadow DOM mode (legacy)', vp_url, votp_url)
    
    // Clear target and create shadow
    legacyTarget.innerHTML = ''
    createShadowWidget(legacyTarget, { vp_url, votp_url, title, notRegisteredMessage })
    return
  }
  
  // Mode 2: Auto-detect from script tag attributes (ONE LINE INTEGRATION)
  const currentScript = document.currentScript || document.querySelector('script[data-reqotp]')
  if (currentScript) {
    const vp_url = currentScript.getAttribute('data-reqotp')
    const votp_url = currentScript.getAttribute('data-verifyotp')
    const title = currentScript.getAttribute('data-title') || 'Verifikasi OTP'
    const notRegisteredMessage = currentScript.getAttribute('data-not-registered-message') || 'Nomor HP tidak ditemukan'
    
    if (vp_url && votp_url) {
      console.log('[OTP Widget] Initializing in Shadow DOM mode (script auto)', vp_url, votp_url)
      
      // Create widget container
      const widget = document.createElement('div')
      widget.id = 'otp-widget-auto'
      document.body.appendChild(widget)
      
      createShadowWidget(widget, { vp_url, votp_url, title, notRegisteredMessage })
      return
    }
  }
  
  // Mode 3: <otp-widget> custom element (Web Component style)
  const customTargets = document.querySelectorAll('otp-widget')
  customTargets.forEach((target, index) => {
    const vp_url = target.getAttribute('reqotp')
    const votp_url = target.getAttribute('verifyotp')
    const title = target.getAttribute('title') || 'Verifikasi OTP'
    const notRegisteredMessage = target.getAttribute('not-registered-message') || 'Nomor HP tidak ditemukan'
    
    if (vp_url && votp_url) {
      console.log(`[OTP Widget] Initializing custom element #${index + 1}`, vp_url, votp_url)
      
      // Replace <otp-widget> with div and mount
      const div = document.createElement('div')
      div.id = `otp-widget-${index}`
      target.parentNode.replaceChild(div, target)
      
      createShadowWidget(div, { vp_url, votp_url, title, notRegisteredMessage })
    }
  })
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initOtpWidget)
} else {
  initOtpWidget()
}

export default {}
