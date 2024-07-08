import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

type TRANSLATE_FN = (fieldName: string) => string;

export interface CrispyFormsConfig {
  /**
   * Function that returns label of a field, if one is not explicitly
   * specified in `CrispyField.label`.
   */
  translateFn?: TRANSLATE_FN;
  /**
   * For `groupArray` field types, Crispy adds a button at the bottom of
   * all rows of FormGroups to allow the user to add a new FormGroup to the
   * FormArray. This allows the text of that button to be customized.
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
   * Defaults to 'col', if not specified.
   */
  defaultColCssClass?: string;
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
