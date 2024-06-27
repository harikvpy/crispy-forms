import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

type LABEL_FN = (fieldName: string) => string;

export interface CrispyFormsConfig {
  labelFn?: LABEL_FN;
  defaultCssClass?: string;
  groupArrayConfig?: {
    addRowText?: string|Observable<string>;
  }
}

export const CRISPY_FORMS_CONFIG_PROVIDER = new InjectionToken<CrispyFormsConfig>(
  'CrispyFormsConfigProvider'
);
