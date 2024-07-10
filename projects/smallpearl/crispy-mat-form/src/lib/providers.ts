import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

type TRANSLATE_FN = (fieldName: string) => string;

export interface CrispyFormsConfig {
  /**
   * Function that translates the two user facing strings of a field -- its
   * label and its hint. If this is defined, it will be called giving a field's
   * label or hint as its argument. If a field's label is not explicitly
   * defined, its name will be used as its label. So in this case, this
   * function will be called with the field's name as argument.
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
