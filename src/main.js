import './app.css'
import App from './App.svelte'

const target = document.getElementById('otp-widget')
const vp_url = target.getAttribute('vp_url')
const votp_url = target.getAttribute('votp_url')

console.log(vp_url, votp_url)
const app = new App({
  target,
  props: {
    vp_url,
    votp_url
  }

})

export default app
