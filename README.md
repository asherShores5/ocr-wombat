# ocr-wombat

Simple OCR tool that extracts text from images in seconds. Paste a screenshot, get the text — no fuss.

Built with React, TypeScript, and Tailwind CSS. Uses the [OCR.space](https://ocr.space/) free API under the hood.

## Features

- Paste any screenshot directly into the app (Ctrl+V)
- Instant text extraction via OCR.space API
- One-click copy of extracted text to clipboard
- Clean dark UI

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Radix UI / shadcn-style components
- OCR.space free API

## Getting Started

```bash
cd ocr-web-app
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

## Usage

1. Copy any image or screenshot to your clipboard
2. Click the paste zone and press **Ctrl+V**
3. The extracted text appears below automatically
4. Hit **Copy** to grab the text to your clipboard

## Notes

The OCR.space API key is hardcoded in `src/components/ui/OCRTool.tsx`. For production use, move it to an environment variable (`.env`) and reference it via `import.meta.env.VITE_OCR_API_KEY`.

## License

See [LICENSE](./LICENSE).
