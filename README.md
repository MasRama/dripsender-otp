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
<!-- Import JavaScript -->
<script type="module" src="https://cdn.jsdelivr.net/npm/dripsender-otp-widget@latest/dist/assets/main.js"></script>
<!-- Import CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/dripsender-otp-widget@latest/dist/assets/style.css">
```

#### Unpkg
```html
<!-- Import JavaScript -->
<script type="module" src="https://unpkg.com/dripsender-otp-widget/dist/assets/main.js"></script>
<!-- Import CSS -->
<link rel="stylesheet" href="https://unpkg.com/dripsender-otp-widget/dist/assets/style.css">
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
