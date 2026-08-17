// src/components/roster/help/helpData.ts

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
    title: '🖨️ How to Print Your Roster',
    description: 'The Print button opens a print preview where you can print or save as PDF. The content automatically adjusts to fit the page.',
    steps: [
      'Click the "Print" button on the roster page',
      'A print preview window will open automatically',
      'Click "Print" or use Ctrl+P (Cmd+P on Mac)',
      'In the print dialog, change the orientation to **Landscape**',
      'For mobile users: Change Page Size to **ANSI F** and Orientation to **Landscape**',
      'Click "Print" or "Save as PDF" to complete',
    ],
    tips: [
      '💡 For best results, always use **Landscape** orientation',
      '📱 Mobile users: Download as PDF for better quality instead of printing',
      '🖥️ The content automatically adjusts to fit the page - no manual sizing needed!',
      '📄 Use "Save as PDF" to create a digital copy you can share',
    ],
    imagePlaceholder: '/images/print-screenshot-placeholder.png',
    buttonLabel: 'Print',
  },
  download: {
    id: 'download',
    title: '📥 How to Download Your Roster',
    description: 'The Download button opens a preview where you can download as HTML or PDF. The table automatically adjusts to show all content.',
    steps: [
      'Click the "Download" button on the roster page',
      'A preview window will appear showing your roster',
      'You will see two download options: HTML and PDF',
      'Choose the format that best suits your needs',
      'Click the corresponding button to download',
    ],
    tips: [
      '📄 **PDF** is perfect for sharing and printing (recommended)',
      '🌐 **HTML** works in ALL browsers and opens on any device',
      '📱 Mobile users: Switch to **Desktop View** in your browser for best quality',
      '✅ The table automatically adjusts to fit the preview - no manual sizing needed!',
      '💾 Both formats save directly to your device',
    ],
    imagePlaceholder: '/images/download-screenshot-placeholder.png',
    buttonLabel: 'Download',
  },
  html: {
    id: 'html',
    title: '📄 How to Download as HTML',
    description: 'HTML download creates a standalone web page that can be opened in any browser on any device.',
    steps: [
      'Click the "Download" button on the roster page',
      'In the preview window, click the "HTML" button',
      'The HTML file will download to your device',
      'Open the downloaded HTML file in any web browser (Chrome, Firefox, Safari, Edge, etc.)',
      'Use your browser\'s print function (Ctrl+P or Cmd+P) to print or save as PDF',
      'Select **Landscape** orientation in the print dialog',
      'Click "Save" to create your PDF',
    ],
    tips: [
      '🌐 HTML files work in ALL browsers - Chrome, Firefox, Safari, Edge',
      '📱 You can open HTML files on ANY device (computer, phone, tablet)',
      '📶 No internet connection needed to view the HTML file',
      '🖨️ Perfect if you want to save a copy and print later',
      '📄 HTML gives you the most flexibility for different devices',
    ],
    imagePlaceholder: '/images/html-screenshot-placeholder.png',
    buttonLabel: 'HTML',
  },
  pdf: {
    id: 'pdf',
    title: '📑 How to Download as PDF',
    description: 'PDF download creates a print-ready document that automatically adjusts to show all content. Just click and download!',
    steps: [
      'Click the "Download" button on the roster page',
      'In the preview window, click the "PDF" button',
      'The PDF file will automatically download to your device',
      'Open the PDF file with any PDF viewer (Adobe Acrobat, browser, etc.)',
      'Ready to share, print, or save!',
    ],
    tips: [
      '✅ **Zero settings needed** - Just click and download!',
      '📱 **Mobile users**: For best quality, switch browser to **Desktop View**',
      '🖨️ PDFs print perfectly with **Landscape** orientation',
      '📤 Perfect for sharing with colleagues or clients',
      '💾 The table automatically fits the page - no manual adjustments needed!',
      '📄 PDF is the most professional format for sharing',
    ],
    imagePlaceholder: '/images/pdf-screenshot-placeholder.png',
    buttonLabel: 'PDF',
  },
};

export const helpButtonIds = ['print', 'download', 'html', 'pdf'];