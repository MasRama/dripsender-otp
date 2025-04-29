# DripsenderOTP Widget

A customizable OTP verification widget for Dripsender.

## Installation

1. Include the script in your HTML file:
```html
<script type="module" src="path/to/dripsender-otp/dist/index.js"></script>
```

2. Add the widget element to your HTML:
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
