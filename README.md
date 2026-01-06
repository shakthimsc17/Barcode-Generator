# Barcode Generator App

A simple and robust barcode generator application that works on both desktop and mobile devices. Create, manage, and print barcode labels with ease.

## Features

- **Dashboard Form**: Clear interface with fields for Item Name, Item Code, Number of Labels, Header, and multiple custom lines
- **Live Preview**: Real-time preview of barcode design in the bottom right corner
- **Multiple Lines**: Add and remove custom lines dynamically
- **Barcode List Management**: View all created barcodes with delete functionality
- **A4 Print Layout**: Automatically arranges labels on A4 sheets for regular printers
- **PDF Export**: Generate PDF files for later printing
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- React 18+ with TypeScript
- Vite for fast development and builds
- JsBarcode for Code128 barcode generation
- jsPDF for PDF generation
- Tailwind CSS for styling

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Usage

1. Fill in the form fields:
   - Company Name / Header
   - Item Name (required)
   - Item Code (required)
   - Number of Labels
   - MRP and Sale Price
   - Additional lines (optional)

2. Preview your barcode in real-time

3. Click "Add to List" to save the barcode

4. Use "Print Labels" to print directly or "Export PDF" to generate a PDF file

## Barcode Design

The barcode label includes:
- Company name/header at the top
- Item name
- Barcode image
- Custom lines (if added)
- MRP and Sale Price on the same line at the bottom

## Deployment

This app is ready to deploy to Vercel, Netlify, or any static hosting service.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up with GitHub
3. Click "New Project" and import your repository
4. Vercel will auto-detect the Vite configuration
5. Click "Deploy" - your app will be live in minutes!

### Build for Production

```bash
npm run build
```

The `dist` folder contains the production-ready files.

## License

MIT

