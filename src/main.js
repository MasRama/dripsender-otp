import './app.css'
import App from './App.svelte'

// Function to ensure DOM is ready before initializing
function initOtpWidget() {
  // CSS will be inlined into the JavaScript bundle
  const target = document.getElementById('otp-widget')
  if (!target) {
    console.error('OTP Widget element not found. Make sure to add an element with id="otp-widget"')
    return
  }
  
  const vp_url = target.getAttribute('reqotp')
  const votp_url = target.getAttribute('verifyotp')
  const title = target.getAttribute('title') || 'Verifikasi OTP'
  const notRegisteredMessage = target.getAttribute('not-registered-message') || 'Nomor HP tidak ditemukan'

  console.log('Initializing OTP Widget', vp_url, votp_url)
  const app = new App({
    target,
    props: {
      vp_url,
      votp_url,
      title,
      notRegisteredMessage
    }
  })

  return app
}

// Make sure DOM is ready before initializing
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initOtpWidget)
} else {
  initOtpWidget()
}

export default {} // Export empty object as default
