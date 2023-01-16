import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const ff = 12;
const gap = ff * 0.172;

const rows = [
  ['title A\n tyyt', 'title B'],
  ['sum 1', ''],
  ['sum 2', ''],
];
for (let i = 1; i <= 80; i++) {
  rows.push([
    { text: `row ${i}`, id: i },
    { text: `row sdf dgfgdfgdfg dfgdfdfgfghfghfghfghdfggd ${i}` },
  ]);
}
const pagesIndex = [];

const docDefinition = {
  pageSize: 'A4',
  pageOrientation: 'landscape',
  // pageOrientation: 'portreit',
  pageMargins: [40, 70, 40, 60],
  pageBreakBefore: function (
    currentNode,
    followingNodesOnPage,
    nodesOnNextPage,
    previousNodesOnPage
  ) {
    if (currentNode.id) {
      console.log(currentNode.id, currentNode.pageNumbers);
      const page = currentNode.pageNumbers[0] - 1;
      pagesIndex[page] = currentNode.id;
    }
    return false;
  },
  content: [
    {
      fontSize: ff,
      table: {
        headerRows: 3,
        dontBreakRows: true,
        widths: [50, 100],
        body: rows,
      },
    },
  ],
};

console.log('fontSize: ', ff, ff + gap, heightOfString(), ff * 2.74);

const pdfDocGenerator = pdfMake.createPdf(docDefinition);
pdfDocGenerator.getBuffer((dataUrl) => {
  // const targetElement = document.getElementById('app');
  // const iframe = document.createElement('iframe');
  // iframe.width = '100%';
  // iframe.height = '1000';
  // iframe.src = dataUrl;
  // targetElement.appendChild(iframe);

  console.log(pagesIndex);
  rows.splice(1, 2);
  const sums = [];
  pagesIndex.forEach((v, i) => {
    const s = rows
      .slice((pagesIndex[i - 1] ?? 0) + 2 * i + 1, v +  2 * i + 1)
      .shift()[0]['id'];
    const e = rows.slice((pagesIndex[i - 1] ?? 0) + 2 * i + 1, v + 2 * i + 1).pop()[0]['id'];
    sums[i] = s + ' : ' + e;
    rows.splice(
      pagesIndex[i] + 2 * i + 1,
      0,
      ['sum 1', sums[i]],
      ['sum 2', '']
    );
  });

  docDefinition.content[0].table.headerRows = 1;
  const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  pdfDocGenerator.getDataUrl((dataUrl) => {
    const targetElement = document.getElementById('app');
    const iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.height = '1000';
    iframe.src = dataUrl;
    targetElement.appendChild(iframe);
  });
});

function heightOfString(
  text: string = 'QWERTY12',
  option = { width: 400, fontSize: 8 }
): number {
  const widthPx = Math.round(option.width * 2.74);
  const fontSizePx = Math.round(option.fontSize * 2.74);
  const span = getDocumentElementOfTextBlockOverflowWrap(widthPx, fontSizePx);

  span.innerText = text;
  const rowHeight = span.offsetHeight;
  span.remove();

  return rowHeight - 1;
}

function getDocumentElementOfTextBlockOverflowWrap(
  columnWidthPx: number,
  fontSizePx: number
): HTMLSpanElement {
  const span = document.createElement('span');
  span.style.position = 'fixed';
  span.style.visibility = 'hidden';
  span.style.fontFamily = 'Ubuntu';
  span.style.overflowWrap = 'break-word';
  span.style.padding = '6px 6px 6px 8px';
  span.style.border = 'solid 2px';
  span.style.lineHeight = 'normal';
  span.style.width = `${columnWidthPx}px`;
  span.style.fontSize = `${fontSizePx}px`;
  document.body.appendChild(span);
  return span;
}
