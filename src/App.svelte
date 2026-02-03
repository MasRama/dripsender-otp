<script>
  import { onMount } from 'svelte';

  // State variables
  export let title = 'Verifikasi OTP';
  export let vp_url = '';
  export let votp_url = '';
  export let notRegisteredMessage = 'Nomor HP tidak ditemukan';
  export let rememberHours = 0;  // 0 = disabled
  let phoneNumber = '';
  let otpDigits = ['', '', '', '', ''];
  let otpNumber = otpDigits.length;
  let showOtpInput = false;
  let isLoading = false;
  let errorMessage = '';
  let successMessage = '';
  let showModal = true;
  let activeInput = 0;
  let securityEnabled = false;

  // Check remembered device
  const STORAGE_KEY = 'otp_verified_' + location.hostname
  const EXPIRY_KEY = 'otp_expiry_' + location.hostname
  
  if (rememberHours > 0) {
    const verified = localStorage.getItem(STORAGE_KEY)
    const expiry = parseInt(localStorage.getItem(EXPIRY_KEY) || '0')
    if (verified === 'true' && Date.now() < expiry) {
      showModal = false
    }
  }

  // Security functions to disable right-click and keyboard shortcuts
  function disableSecurity() {
    if (securityEnabled) {
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('keydown', blockKeyboardShortcuts);
      document.body.classList.remove('no-select');
      securityEnabled = false;
    }
  }

  function enableSecurity() {
    if (!securityEnabled) {
      document.addEventListener('contextmenu', blockContextMenu);
      document.addEventListener('keydown', blockKeyboardShortcuts);
      document.body.classList.add('no-select');
      securityEnabled = true;
    }
  }

  function blockContextMenu(e) {
    if (showModal) {
      e.preventDefault();
      return false;
    }
  }

  function blockKeyboardShortcuts(e) {
    if (showModal) {
      // Block Ctrl+A (Select All)
      if (e.ctrlKey && e.keyCode === 65) {
        e.preventDefault();
        return false;
      }
      
      // Block Ctrl+C (Copy)
      if (e.ctrlKey && e.keyCode === 67) {
        e.preventDefault();
        return false;
      }
      
      // Block Ctrl+Shift+I, F12 (Inspect Element)
      if ((e.ctrlKey && e.shiftKey && e.keyCode === 73) || e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      
      // Block Ctrl+Shift+C (Inspector's element selector)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
        return false;
      }
      
      // Block Ctrl+U (View Source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
      }
    }
  }

  // Watch for modal visibility changes
  $: {
    if (showModal) {
      enableSecurity();
    } else {
      disableSecurity();
    }
  }

  onMount(() => {
    if (showModal) {
      enableSecurity();
    }
    
    return () => {
      disableSecurity();
    };
  });

  // Handle phone number submission
  async function handlePhoneSubmit() {
    if (!phoneNumber) {
      errorMessage = 'Silakan masukkan nomor HP';
      shakeElement('phone-container');
      return;
    }
    
    errorMessage = '';
    isLoading = true;
    
    // Simulate API call to send OTP
    const res = await fetch(vp_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber
        })
      });

      const data = await res.json();

      if(data.exists)
      {
        isLoading = false;
      showOtpInput = true;
      successMessage = `Kode OTP telah dikirim ke ${phoneNumber}`;
        // Focus first OTP input after transition
        setTimeout(() => {
        document.getElementById('otp-0')?.focus();
      }, 300);
      }else{
        isLoading = false;
        errorMessage = notRegisteredMessage;
        shakeElement('phone-container');
      }
  }

  // Handle OTP input
  function handleOtpInput(index, event) {
    const value = event.target.value;
    
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      event.target.value = otpDigits[index];
      return;
    }
    
    // Update the current digit
    otpDigits[index] = value.slice(-1);
    
    // Auto-focus to next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
      activeInput = index + 1;
    }
    
    // Check if all digits are filled
    if (otpDigits.every(digit => digit !== '') && index === 5) {
      verifyOtp();
    }
  }

  // Handle backspace in OTP input
  function handleKeyDown(index, event) {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
      activeInput = index - 1;
    }
  }

  // Handle focus on OTP input
  function handleFocus(index) {
    activeInput = index;
  }

  // Verify OTP
  async function verifyOtp() {
    const otp = otpDigits.join('');
    
    if (otp.length !== otpDigits.length) {
      errorMessage = 'Silakan masukkan kode OTP ' + otpDigits.length + ' digit';
      shakeElement('otp-container');
      return;
    }
    
    errorMessage = '';
    isLoading = true;
    
    // Simulate API call to verify OTP
    const res = await fetch(votp_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phoneNumber,
        otp: otp
      })
    });

    const data = await res.json();

    if(data.status == "success")
    {
      isLoading = false;
      successMessage = 'Verifikasi berhasil!';
      
      // Add success animation
      const container = document.querySelector('.modal-content');
      if (container) {
        container.classList.add('success-animation');
      }

      // Matikan fitur keamanan sebelum menutup modal
      disableSecurity();
      showModal = false; 
      
      // Save remembered device if enabled
      if (rememberHours > 0) {
        const durationMs = rememberHours * 60 * 60 * 1000
        localStorage.setItem(STORAGE_KEY, 'true')
        localStorage.setItem(EXPIRY_KEY, (Date.now() + durationMs).toString())
      }
    }else{
      isLoading = false;
      errorMessage = 'Kode OTP tidak valid';
      shakeElement('otp-container');
    }
  }

  // Handle paste event for OTP
  function handlePaste(event) {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text');
    
    if (!/^\d+$/.test(pastedData)) return;
    
    const digits = pastedData.slice(0, otpNumber).split('');
    
    digits.forEach((digit, index) => {
      if (index < otpNumber) {
        otpDigits[index] = digit;
      }
    });
    
    // Focus last filled input or next empty one
    const lastIndex = Math.min(digits.length, 5);
    document.getElementById(`otp-${lastIndex}`)?.focus();
    activeInput = lastIndex;
    
    if (digits.length === otpNumber) {
      verifyOtp();
    }
  }

  // Add shake animation to element
  function shakeElement(id) {
    const element = document.getElementById(id);
    if (element) {
      element.classList.add('shake');
      setTimeout(() => {
        element.classList.remove('shake');
      }, 500);
    }
  }
</script>

{#if showModal}
<div class="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
  <div class="modal-content relative w-full max-w-md transform transition-all duration-300 ease-in-out scale-100 translate-y-0 {securityEnabled ? 'secure-otp' : ''}">
    <div class="bg-gradient-to-br from-blue-500 to-purple-600 p-1 rounded-2xl shadow-2xl">
      <div class="bg-white p-8 rounded-2xl">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
          <div class="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
        </div>
        
        {#if !showOtpInput}
          <!-- Phone Number Input -->
          <div class="mb-6" id="phone-container">
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">Nomor HP</label>
            <div class="relative">
              <input
                type="tel"
                id="phone"
                bind:value={phoneNumber}
                placeholder="Masukkan nomor HP Anda"
                class="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-200" style="color: #111827 !important;"
              />
            </div>
          </div>
          
          <button
            type="button"
            on:click={handlePhoneSubmit}
            disabled={isLoading}
            class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-1 disabled:opacity-70 disabled:transform-none"
          >
            {#if isLoading}
              <div class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengirim...
              </div>
            {:else}
              Kirim Kode OTP
            {/if}
          </button>
        {:else}
          <!-- OTP Input -->
          <div class="mb-6" id="otp-container">
            <label class="block text-sm font-medium text-gray-700 mb-2">Masukkan Kode OTP</label>
            <p class="text-xs text-gray-500 mb-4">Kode OTP telah dikirim ke nomor {phoneNumber}</p>
            
            <div class="flex justify-between mb-6">
              {#each otpDigits as digit, index}
                <div class="relative">
                  <input
                    type="text"
                    id="otp-{index}"
                    maxlength="1"
                    inputmode="numeric"
                    value={digit}
                    on:input={(e) => handleOtpInput(index, e)}
                    on:keydown={(e) => handleKeyDown(index, e)}
                    on:paste={handlePaste}
                    on:focus={() => handleFocus(index)}
                    class="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-200" style="color: #111827 !important;"
                  />
                  <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-full transition-all duration-200 {activeInput === index ? 'bg-blue-500' : 'bg-transparent'}"></div>
                </div>
              {/each}
            </div>
            
            <div class="flex justify-between text-sm">
              <button
                type="button"
                on:click={() => { showOtpInput = false; successMessage = ''; }}
                class="text-blue-600 hover:text-blue-800 hover:underline transition-colors flex items-center"
                aria-label="Ubah Nomor HP"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                </svg>
                Ubah Nomor HP
              </button>
              
              <button
                type="button"
                on:click={() => {
                  successMessage = '';
                  handlePhoneSubmit();
                }}
                class="text-blue-600 hover:text-blue-800 hover:underline transition-colors flex items-center"
                aria-label="Kirim Ulang Kode"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                </svg>
                Kirim Ulang Kode
              </button>
            </div>
          </div>
          
          <button
            type="button"
            on:click={verifyOtp}
            disabled={isLoading || otpDigits.some(digit => digit === '')}
            class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-1 disabled:opacity-70 disabled:transform-none"
          >
            {#if isLoading}
              <div class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memverifikasi...
              </div>
            {:else}
              Verifikasi
            {/if}
          </button>
        {/if}
        
        <!-- Error and Success Messages -->
        {#if errorMessage}
          <div class="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        {/if}
        
        {#if successMessage}
          <div class="mt-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>{successMessage}</span>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
{/if}
<style>
  :global(body) {
    margin: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f9fafb;
  }
  
  /* Disable text selection for body when security is enabled */
  :global(body.no-select) {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
  
  /* Disable text selection for OTP inputs when security is enabled */
  :global(.secure-otp) {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
 
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
  

  @keyframes success-pulse {
    0%, 100% { transform: scale(1); box-shadow: 0 0 0 rgba(79, 209, 197, 0); }
    50% { transform: scale(1.03); box-shadow: 0 0 20px rgba(79, 209, 197, 0.5); }
  }
  
  input[type="text"], input[type="tel"] {
    transition: border-color 0.2s ease;
  }
  
  button {
    position: relative;
    overflow: hidden;
  }
  
  button::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%);
    transform-origin: 50% 50%;
  }
  
  @keyframes ripple {
    0% {
      transform: scale(0, 0);
      opacity: 0.5;
    }
    100% {
      transform: scale(20, 20);
      opacity: 0;
    }
  }
  
  button:focus:not(:active)::after {
    animation: ripple 1s ease-out;
  }
</style>