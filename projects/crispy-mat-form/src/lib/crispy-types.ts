import { FormGroup, ValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";

export type CrispyFieldType =
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
  | 'group';

export interface SelectOption {
  label: string;
  value: string | number
};

export interface CrispyFieldProps {
  // Label use for the field. Wil be placed in a <mat-label> tag.
  label: string;
  // The field type. This controls the type of UI widget used.
  type: CrispyFieldType;
  // Related reactive form control's name.
  formControlName: string;
  // An optional hint for the field. If specified, will be placed in a <mat-hint> tag.
  hint?: string;
  // Additional cssClasses that will be added to the <mat-form-field> wrapper.
  cssClass?: string;
  /* Only for 'select' field type. Specifies the individual options. */
  selectOptions?: {
    options: Array<SelectOption> | Observable<SelectOption[]>;
  }
  /* Only for 'daterange' field type. The member should be self-explantory. */
  dateRangeOptions?: {
    beginRangeLabel?: string; // defaults to 'Start'
    beginRangeFormControlName: string;
    beginRangeValidators?: ValidatorFn | ValidatorFn[];
    endRangeLabel?: string; // defaults to 'End'
    endRangeFormControlName: string;
    endRangeValidators?: ValidatorFn | ValidatorFn[];
  };
  /* Only for 'custom' field type. */
  customControlOptions?: {
    component: any; // The custom component class object that will be dynamically created.
  };
  children?: CrispyFieldProps[];
}

export interface CrispyForm {
  form: FormGroup;
  fields: CrispyFieldProps[];
  fieldCssClass?: string;
}