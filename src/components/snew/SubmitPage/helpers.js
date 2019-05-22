const concatSupportedChars = supportedChars =>
  supportedChars.reduce((str, v) => str + v, "");

export const invoiceInstructions = ({
  cmscontactsupportedchars,
  cmsnamelocationsupportedchars,
  maxlocationlength,
  minlocationlength,
  mincontactlength,
  maxcontactlength,
  minnamelength,
  maxnamelength,
  minlineitemcollength,
  maxlineitemcollength,
  invoicefieldsupportedchars
}) => `
  ***Contractor Name:*** This is whatever name you identify yourself with the DHG, typically something beyond a mere handle or nick. 
   - Allowed chars: ${concatSupportedChars(cmsnamelocationsupportedchars)}
   - Min length: ${minnamelength}
   - Max length: ${maxnamelength}
  
  ***Contractor Location:*** This is the country you are currently located, or primarily residing.
  - Allowed chars: ${concatSupportedChars(cmsnamelocationsupportedchars)}
  - Min length: ${minlocationlength}
  - Max length: ${maxlocationlength}
  
  ***Contractor Contact:*** Contact information in case an administrator would need to reach out to discuss something, typically an email address or chat nick.
  - Allowed chars: ${concatSupportedChars(cmscontactsupportedchars)}
  - Min length: ${mincontactlength}
  - Max length: ${maxcontactlength}
  
  ***Contractor Rate:*** This is the previously agreed upon rate you will be performing work.
  
  ***Payment Address:*** This is the DCR address where you would like to receive payment.  
  
  ***Line Items:***
    * Type: Currently can be 1 (Labor), 2 (Expense), or 3 (Misc)
    * Domain: The broad category of work performed/expenses spent (for example, Development, Marketing, Community etc).
    * Subdomain: The specific project or program of which the work or expenses are related (for example, Decrediton, dcrd, NYC Event).
    * Description: A thorough description of the work or expenses.
    * Labor: The number of hours of work performed.
    * Expenses: The cost of the line item (in USD).
    
  Line items policy for domain, subdomain and description:
  - Allowed chars: ${concatSupportedChars(invoicefieldsupportedchars)}
  - Min length: ${minlineitemcollength}
  - Max length: ${maxlineitemcollength}
  `;
