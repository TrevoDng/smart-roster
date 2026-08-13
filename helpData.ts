export interface HelpContent {
  id: string;
  title: string;
  description: string;
  steps: string[];
  tips?: string[];
  imagePlaceholder: string;
  buttonLabel: string;
}

export const helpContents: Record<string, HelpContent> = {
  print: {
    id: 'print',
    title: '🖨️ How to Use the Print Button',
    description: 'The Print button allows you to print the current roster or save it as a PDF.',
    steps: [
      'Click the "Print" button on the roster page',
      'A new window will open with the roster preview',
      'Click "Print" in the preview window',
      'In the print dialog, select your printer or "Save as PDF"',
      'Choose your preferred paper size (ANSI F, A4, etc.)',
      'Select Landscape orientation for best results',
      'Click "Print" or "Save" to complete',
    ],
    tips: [
      'Use "Save as PDF" to create a digital copy',
      'Select Landscape orientation for wide rosters',
      'Preview the document before printing',
    ],
    imagePlaceholder: '/images/print-screenshot-placeholder.png',
    buttonLabel: 'Print',
  },
  download: {
    id: 'download',
    title: '📥 How to Use the Download Button',
    description: 'The Download button opens a preview where you can choose to download as HTML or PDF.',
    steps: [
      'Click the "Download" button on the roster page',
      'A preview window will appear showing your roster',
      'You will see two download options: HTML and PDF',
      'Choose the format that best suits your needs',
      'Click the corresponding button to download',
    ],
    tips: [
      'HTML download is more compatible across devices',
      'PDF download creates a print-ready document',
      'Preview the roster before downloading',
    ],
    imagePlaceholder: '/images/download-screenshot-placeholder.png',
    buttonLabel: 'Download',
  },
  html: {
    id: 'html',
    title: '📄 How to Download as HTML',
    description: 'HTML download creates a standalone web page that can be opened in any browser.',
    steps: [
      'Click the "Download" button on the roster page',
      'In the preview window, click the "HTML" button',
      'The HTML file will download to your device',
      'Open the downloaded HTML file in any web browser',
      'Use your browser\'s print function (Ctrl+P or Cmd+P)',
      'Select "Save as PDF" in the print dialog',
      'Choose your preferred paper size and orientation',
      'Click "Save" to create your PDF',
    ],
    tips: [
      'HTML files work in ALL browsers (Chrome, Firefox, Safari, Edge)',
      'You can open HTML files on any device (computer, phone, tablet)',
      'No internet connection needed to view the HTML file',
    ],
    imagePlaceholder: '/images/html-screenshot-placeholder.png',
    buttonLabel: 'HTML',
  },
  pdf: {
    id: 'pdf',
    title: '📑 How to Download as PDF',
    description: 'PDF download automatically opens a new window with the roster ready for printing.',
    steps: [
      'Click the "Download" button on the roster page',
      'In the preview window, click the "PDF" button',
      'A new tab/window will open with your roster',
      'The print dialog will automatically appear',
      'Select "Save as PDF" as your destination',
      'Choose your paper size (ANSI F is recommended for wide rosters)',
      'Select Landscape orientation',
      'Adjust any other settings as needed',
      'Click "Save" to download your PDF',
    ],
    tips: [
      'PDF is perfect for sharing and printing',
      'ANSI F paper size works best for wide rosters',
      'Landscape orientation gives the best layout',
      'You can adjust page size in the print dialog',
    ],
    imagePlaceholder: '/images/pdf-screenshot-placeholder.png',
    buttonLabel: 'PDF',
  },
};

export const helpButtonIds = ['print', 'download', 'html', 'pdf'];
