import './app.css'
import App from './App.svelte'

// Create a function to inject the CSS if loaded via CDN
function injectStylesheet() {
  const cssPath = import.meta.url.replace('main.js', 'style.css');
  
  // Check if stylesheet already exists
  const existingLink = document.querySelector(`link[href="${cssPath}"]`);
  if (!existingLink) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssPath;
    document.head.appendChild(link);
  }
}

// Try to inject the CSS
try {
  injectStylesheet();
} catch (e) {
  console.warn('Could not auto-inject CSS. Make sure to include the CSS file manually.');
}

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
