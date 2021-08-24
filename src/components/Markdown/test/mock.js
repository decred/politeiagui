export const maliciousBodyText =
  "![clickforxss](javascript:alert('XSS'))  [clickforxss](javascript:alert('XSS'))";

export const tableText = `| Area                | Spent  | Allocated  | Remaining   |
| :------------------ | -----: | ---------: | ----------: |
| Decred Journal      | $7,320 |    $11,340 |  **$4,020** |
| website translation |     $0 |     $1,680 |  **$1,680** |
| articles/content    | $1,445 |     $4,410 |  **$2,965** |
| video content       | $1,940 |    $10,080 |  **$8,140** |
| software            | $3,945 |     $1,260 | **-$2,685** |
| management          |    $40 |       $360 |    **$320** |`;

export const headersText = `# header 1
## header 2
### header 3
#### header 4
##### header 5
###### header 6
`;

export const unorderedListText = `
* Item 1
* Item 2
* Item 2a
* Item 2b
`;

export const orderedListText = `
1. Item 1
1. Item 2
1. Item 3
    1. Item 3a
    1. Item 3b
`;

export const blockQuotesText = `
> Quote 1
>
>> Quote 2.
`;

export const codeBlocksText = `
\`\`\`
let message = 'Hello world';
alert(message);
\`\`\`
`;
