import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const ff = 8;
const gap= ff*0.172;

const docDefinition = {
  pageSize: 'A4',
  pageOrientation: 'landscape',
  // pageOrientation: 'portreit',
  pageMargins: [40, 70, 40, 60],
  content: [
    {
      fontSize: ff,
      table: {
				body: [
					[{
            fontSize: ff,
            table: {
              body: [
                ['row 1', 'column B'],
                ['row 1\n row 2', 'column B'],
                ['row 1\n row 2\n row 3', 'column B'],
                ['row 7', 'column B'],
                ['row 8', 'column B'],
                ['row 1', 'column B'],
                ['row 1', 'column B'],
                ['row 1', 'column B'],
                ['row 1', 'column B'],
                ['row 1', 'column B'],
                ['row 1', 'column B'],
                ['row 1', 'column B'],
                ['row 1', 'column B'],
                ['row 1', 'column B'],
                ['row 1', 'column B'],
                ['row 1', 'column B'],
                ['row 1', 'column B'],
                ['row 1', 'column B'],
                ['row 1', 'column B'],
                ['row 1', 'column B'],
                ['row 1', 'column B'],
                ['row 1', 'column B'],
                ['row 1', 'column B'],
                ['row 27', 'column B'],
                ['row 27', 'column B'],
                ['row 27', 'column B'],
                ['row 27', 'column B'],
                ['row 27', 'column B'],
                ['row 32', 'column B']
              ]
            }
          },
          {
            fontSize: ff,
            table: {
              heights: [(ff+gap)*1,(ff+gap)*2,(ff+gap)*3],
              body: [
                ['row 1', 'column B'],
                ['row 2', 'column B'],
                ['row 3', 'column B']
              ]
            }
          }]
				]
			}
    },
    {text: 'Column/row spans', pageBreak: 'before'},
    {
      fontSize: 8,
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
      fontSize: 8,
      table: {
        body: [
          ['Column 1', 'Column 2', 'Column 3'],
          ['One value goes here', 'Another one here', 'OK?'],
        ],
        headerRows: 1,
        widths: ['*', 100, 100],
      },
    }
  ],
};

console.log('fontSize: ', ff, (ff+gap), heightOfString(), ff * 2.74);

const pdfDocGenerator = pdfMake.createPdf(docDefinition);
pdfDocGenerator.getDataUrl((dataUrl) => {
  const targetElement = document.getElementById('app');
  const iframe = document.createElement('iframe');
  iframe.width = '100%';
  iframe.height = '1000';
  iframe.src = dataUrl;
  targetElement.appendChild(iframe);
});

function heightOfString(text: string = 'QWERTY12', option = { width : 400, fontSize: 8 }): number {
  const widthPx = Math.round(option.width * 2.74);
  const fontSizePx = Math.round(option.fontSize * 2.74);
  const span = getDocumentElementOfTextBlockOverflowWrap(widthPx, fontSizePx);

  span.innerText = text;
  const rowHeight = span.offsetHeight;
  span.remove();

  return rowHeight - 1;
}

function getDocumentElementOfTextBlockOverflowWrap(columnWidthPx: number, fontSizePx: number): HTMLSpanElement {
  const span = document.createElement('span');
  span.style.position = 'fixed';
  span.style.visibility = 'hidden';
  span.style.fontFamily = 'Ubuntu';
  span.style.overflowWrap = 'break-word';
  span.style.padding = '6px 6px 6px 8px';
  span.style.border = 'solid 2px';
  span.style.lineHeight = 'normal';
  span.style.width = `${ columnWidthPx }px`;
  span.style.fontSize = `${ fontSizePx }px`;
  document.body.appendChild(span);
  return span;
}