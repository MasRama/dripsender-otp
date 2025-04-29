# DripsenderOTP Widget

A customizable OTP verification widget for Dripsender.

## Installation

### Using npm

```bash
npm install dripsender-otp-widget
```

### Using CDN

#### JSDelivr (Recommended)
```html
<!-- Add the widget element BEFORE importing the script -->
<div id="otp-widget" reqotp="YOUR_REQUEST_OTP_ENDPOINT" verifyotp="YOUR_VERIFY_OTP_ENDPOINT"></div>

<!-- Then import the script (CSS is inlined in the JavaScript bundle) -->
<script type="module" src="https://cdn.jsdelivr.net/npm/dripsender-otp-widget@latest/dist/assets/main.js"></script>
```

#### Unpkg
```html
<!-- Add the widget element BEFORE importing the script -->
<div id="otp-widget" reqotp="YOUR_REQUEST_OTP_ENDPOINT" verifyotp="YOUR_VERIFY_OTP_ENDPOINT"></div>

<!-- Then import the script (CSS is inlined in the JavaScript bundle) -->
<script type="module" src="https://unpkg.com/dripsender-otp-widget/dist/assets/main.js"></script>
```

### HTML Setup

Add the widget element to your HTML:

```html
<div 
  id="otp-widget"
  reqotp="YOUR_REQUEST_OTP_ENDPOINT" 
  verifyotp="YOUR_VERIFY_OTP_ENDPOINT"
  title="Your Custom Title"
></div>
```

## Customization Options

The widget can be customized using the following attributes:

| Attribute | Description | Default |
|-----------|-------------|---------|
| `reqotp` | API endpoint URL for requesting OTP | Required |
| `verifyotp` | API endpoint URL for verifying OTP | Required |
| `title` | Custom title for the verification modal | "Verifikasi OTP" |

## Troubleshooting

If the CSS is not loading properly when using the CDN version:

1. Make sure the widget element is added to the DOM **before** the script is loaded
2. Try adding the script at the end of your body tag
3. For HTML Playground environments, you may need to ensure the script is loaded after the DOM is fully loaded

## Development

To start the development server:

```bash
npm install
npm run dev
```

## Building

To build for production:

```bash
npm run build
```

## License

MIT