import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const docDefinition = {
  pageSize: 'A4',
  pageOrientation: 'landscape',
  // pageOrientation: 'portreit',
  pageMargins: [40, 70, 40, 60],
  content: [
    {
      table: {
        body: [
          ['Column 1', 'Column 2', 'Column 3'],
          ['One value goes here', 'Another one here', 'OK?'],
        ],
        headerRows: 1,
        widths: [534, 100, 100],
      },
    },
    {
      table: {
        body: [
          ['Column 1', 'Column 2', 'Column 3'],
          ['One value goes here', 'Another one here', 'OK?'],
        ],
        headerRows: 1,
        widths: ['*', 100, 100],
      },
    },
  ],
};

const pdfDocGenerator = pdfMake.createPdf(docDefinition);
pdfDocGenerator.getDataUrl((dataUrl) => {
  const targetElement = document.getElementById('app');
  const iframe = document.createElement('iframe');
  iframe.width = '100%';
  iframe.height = '1000';
  iframe.src = dataUrl;
  targetElement.appendChild(iframe);
});
