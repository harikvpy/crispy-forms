import { FormGroup, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

export type CrispyFieldType =
  | 'div'
  | 'row'
  | 'number'
  | 'text'
  | 'email'
  | 'password'
  | 'search'
  | 'date'
  | 'daterange'
  | 'select'
  | 'textarea'
  | 'checkbox'
  | 'custom'
  | 'template'
  | 'group'
  | 'groupArray';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectOptions {
  options: Array<SelectOption> | Observable<SelectOption[]>;
}

export interface DateRangeOptions {
  beginRangeLabel?: string; // defaults to 'Start'
  beginRangeFormControlName: string;
  beginRangeValidators?: ValidatorFn | ValidatorFn[];
  endRangeLabel?: string; // defaults to 'End'
  endRangeFormControlName: string;
  endRangeValidators?: ValidatorFn | ValidatorFn[];
}

export type FieldContext = { [P: string]: any };

/**
 * Options specific to 'control' CrispyFieldType
 */
export interface CustomComponentOptions {
  component: any; // The custom component class object that will be dynamically created.
  context?: FieldContext;
}

/**
 * Options specific to 'template' CrispyFieldType
 */
export interface TemplateComponentOptions {
  context?: FieldContext;
}

/**
 * Options specific to 'groupArray' CrispyFieldType
 */
export interface GroupArrayOptions {
  context?: FieldContext;
}

export interface CrispyField {
  name: string;
  type: CrispyFieldType;
  initial?: any;
  validators?: ValidatorFn | ValidatorFn[];
  label?: string;
  hint?: string;
  cssClass?: string;
  children?: CrispyField[];
  options?: {
    selectOptions?: SelectOptions,
    dateRangeOptions?: DateRangeOptions,
    customComponentOptions?: CustomComponentOptions,
    templateComponentOptions?: TemplateComponentOptions,
    groupArrayOptions?: GroupArrayOptions
  }
  // internal stuff
  formFieldOptions?: any;
}

export interface CrispyForm {
  form: FormGroup<any>;
  field: CrispyField;
}
