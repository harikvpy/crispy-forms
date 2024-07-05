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
   * CrispyForm is wrapped in a <div> element with this css class.
   * Defaults to 'container', which is derived from Bootstrap. For this
   * to work, pls include Bootstrap's css either from styles.css (after
   * installing the bootstrap npm package) or in the <head> of index.html.
   */
  defaultWrapperDivCssClass?: string; // defaults to 'container'
  /**
   * If the fields in a CrispyRow do not have their own CSS classes specified,
   * (since we default to using Bootstrap's container classes these will
   * default to 'col-sm-{width}), all the fields will be given equal width.
   * Width will be calculated based on the assumtion that a row can at most
   * be divided into 12 columns (again inspired by Bootstrap container
   * classes).
   */
  defaultColDivCssClassTemplate?: string; // defaults to 'col-sm-{width}
  /**
   * 
   */
  groupArrayConfig?: {
    addRowText?: string|Observable<string>;
  },
}

export const CRISPY_FORMS_CONFIG_PROVIDER = new InjectionToken<CrispyFormsConfig>(
  'CrispyFormsConfigProvider'
);
