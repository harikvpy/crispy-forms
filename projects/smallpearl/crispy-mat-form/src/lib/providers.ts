import { InjectionToken } from '@angular/core';

type LABEL_FN = (fieldName: string) => string;

export interface CrispyFormsConfig {
  labelFn?: LABEL_FN;
  defaultCssClass?: string;
  groupArrayConfig?: {
    addRowText?: string;
  }
}

export const CRISPY_FORMS_CONFIG_PROVIDER = new InjectionToken<CrispyFormsConfig>(
  'CrispyFormsConfigProvider'
);
