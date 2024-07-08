import { CrispyFormsConfig } from './providers';

/**
 * The default label function. It splits camel cased strings into separate
 * words and uppercases the first character of each word and returns the
 * string comprising of all these words joined.
 * @param value 
 * @returns string
 */
export const DEFAULT_LABEL_FN = (value: string): string => {
  // Function to break camel cased words into separate words
  // with a space in between.
  const breakWords = (value: string) => {
    return value.replace(/([\w])([A-Z])/g, function(m) {
        return m[0] + " " + m[1];
    });
  }
  return breakWords(value)
    .split(' ')
    .map((w: string) => w[0].toLocaleUpperCase() + w.slice(1))
    .join(' ');
}

// Default crispy config
export const DEFAULT_CRISPY_CONFIG: CrispyFormsConfig = {
  labelFn: (code: string) => DEFAULT_LABEL_FN(code),
  groupArrayConfig: {
    addRowText: 'Add Row'
  },
  // These come from bootstrap convention.
  defaultContainerCssClass: 'container',
  defaultRowCssClass: 'row',
  numberOfColsPerRow: 12, // 
  defaultColDivCssClassTemplate: 'col-sm-{width}'
}
