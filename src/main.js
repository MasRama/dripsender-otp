import './app.css'
import App from './App.svelte'

// CSS will be inlined into the JavaScript bundle

const target = document.getElementById('otp-widget')
const vp_url = target.getAttribute('reqotp')
const votp_url = target.getAttribute('verifyotp')
const title = target.getAttribute('title') || 'Verifikasi OTP'

console.log(vp_url, votp_url)
const app = new App({
  target,
  props: {
    vp_url,
    votp_url,
    title
  }

})

export default app
