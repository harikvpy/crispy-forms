import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

type LABEL_FN = (fieldName: string) => string;

export interface CrispyFormsConfig {
  /**
   * Function that returns label of a field, if one is not explicitly
   * specified in `CrispyField.label`.
   */
  labelFn?: LABEL_FN;
  /**
   * Unused in V2
   */
  defaultCssClass?: string;
  /**
   * 
   */
  groupArrayConfig?: {
    addRowText?: string|Observable<string>;
  },
  /**
   * Defaults to 12 cols per row.
   */
  numberOfColsPerRow?: number;
  /**
   * Defaults to 'container', if not specified.
   */
  defaultContainerCssClass?: string;
  /**
   * Defaults to 'row', if not specified.
   */
  defaultRowCssClass?: string;
  /**
   * Defaults to 'col-sm-{width}. {width} gets replaced with the column width
   * calculated based on the number of cols per each row rounded up to the
   * nearest whole number.
   */
  defaultColDivCssClassTemplate?: string;
}

export const CRISPY_FORMS_CONFIG_PROVIDER = new InjectionToken<CrispyFormsConfig>(
  'CrispyFormsConfigProvider'
);
