import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const ff = 12;
const gap = ff * 0.172;

const statements = [];

const rows = [
  ['title A\n tyyt', 'title B'],
  ['sum 1', ''],
  ['sum 2', ''],
];

const rows2 = [
  ['title A\n tyyt', 'title B'],
  ['sum 1', ''],
  ['sum 2', ''],
];

for (let i = 1; i <= 82; i++) {
  statements.push(i);

  rows.push([
    { text: `row ${i}`, id: 1 + '_' + i },
    {
      text: `row sdf dgfgdfgdfg dfgdfdfgfghfghfghfgh-------- ${
        statements[i - 1]
      }`,
    },
  ]);
};

for (let i = 1; i <= 50; i++) {
  rows2.push([
    { text: `row ${i}`, id: 2 + '_' + i },
    {
      text: `row sdf dgfgdfgdfg dfgdfdfgfghfghfghfgh-------- ${
        statements[i - 1]
      }`,
    },
  ]);
}
const pagesIndex = [[]];

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
    // if (currentNode.table) {
    //   const nr = currentNode.startPosition.pageNumber - 1;
    //   console.log(nr, currentNode, followingNodesOnPage.length);
    //   // if (nr>0) { 
    //   //   const t = []; t[nr] = 0;
    //   //   pagesIndex[2] = t;
    //   // }
    //   if (followingNodesOnPage.length <= 5) return true;
    // }
    if (currentNode.headlineLevel && followingNodesOnPage.length == currentNode.headlineLevel) {
      return true;
    }

    if (currentNode.id) {
      const page = currentNode.pageNumbers[0] - 1;
      const split = currentNode.id.split('_');

      const tab = pagesIndex[split[0]] ?? [];
      tab[page] = +split[1];
      pagesIndex[split[0]] = tab;
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
    { text: '\n\n\nHHHHHHHHHHHHHHH', fontSize: 14 },
    {
      fontSize: ff,
      table: {
        headerRows: 3,
        dontBreakRows: true,
        widths: [150, 400],
        body: rows2,
      }, 
      headlineLevel: 5
    },
  ],
};

// console.log('fontSize: ', ff, ff + gap, heightOfString(), ff * 2.74);

const pdfDocGenerator = pdfMake.createPdf(docDefinition);
pdfDocGenerator.getBuffer((dataUrl) => {
  // const targetElement = document.getElementById('app');
  // const iframe = document.createElement('iframe');
  // iframe.width = '100%';
  // iframe.height = '1000';
  // iframe.src = dataUrl;
  // targetElement.appendChild(iframe);

  console.table(pagesIndex);
  rows.splice(1, 2);

  pagesIndex[1].forEach((v, i) => {
    const s = pagesIndex[1][i - 1] ?? 0;
    const e = v;
    const sums = statements.slice(s, e).reduce((p, n) => (p += n), 0);
    rows.splice(v + 2 * i + 1, 0, ['sum 1', sums], ['sum 2', '']);
  });

  rows2.splice(1, 2);
  let ii = -1;
  pagesIndex[2]?.forEach((v, i) => {
    ii++;
    const s = pagesIndex[2][i - 1] ?? 0;
    const e = v;
    console.log(s, v, ii);
    const sums = statements.slice(s, e).reduce((p, n) => (p += n), 0);
    rows2.splice(v + 2 * ii + 1, 0, ['sum 1', sums], ['sum 2', '']);
  });

  docDefinition.content[0].table.headerRows = 1;
  docDefinition.content[2].table.headerRows = 1;
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
