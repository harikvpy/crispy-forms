/**
 * Crispy Forms is a forms engine that combines form definition and its layout
 * in a single declaration. It layers over the Angular native reactive forms
 * and integartes a layout engine which arranges the form's controls as per its
 * definition in the CrispyField object.
 * 
 * Typically there's a one-to-one mapping between the reactive form field
 * and it's layout definition. Therefore, given a layout definition, it's
 * possible to generate the reactive form control corresponding to that
 * and then collect all these controls into a FormGroup.
 *
 * The FormGroup generated together with the CrispyFields, the CrispyForm
 * object can be composed and passed as an argument to the
 * <crispy-mat-form> component.
 *
 * We should be able to derive a FormControl or FormGroup instance from an
 * instance of this class. This will help us build a FormGroup from a
 * collection of these objects.
 *
 * cf = [
 *  CF('name', 'text),
 *  CF('age', 'number'),
 *  CF('password', 'password'),
 *  CF('confirmPassword', 'password'),
 *  CF('publicationRange', 'daterange', )
 * ]
 */

import {
  ValidatorFn,
  FormControl,
  FormGroup,
  AbstractControlOptions,
  AsyncValidatorFn,
  FormArray,
} from '@angular/forms';
import {
  CrispyFieldType,
  CrispyField,
  CrispyForm,
  SelectOption,
  DateRangeOptions,
  CustomComponentOptions,
  FieldContext,
  TemplateComponentOptions,
} from './crispy-types';
import { Observable } from 'rxjs';
import { buildFormGroup } from './crispy-internal-components';

type TRANSLATE_FN = (code: string, args?: any) => string;

/**
 * A function to construct a CrispyForm object from its constituent
 * field definitions.
 * 
 * @param field - Array of fields to be included in the form.
 * @param translateFn - String translation function
 * @param fieldCssClass - Global field css class, if per field css class is
 * not specified, this will be used.
 * @param validatorOrOpts - Global form validation routine.
 * @param asyncValidator - Global async form validation routine.
 * @returns CrispyForm object that can be passed to `crispy-mat-form` as
 * its `crispy` property value.
 */
export function buildCrispyForm(
  field: CrispyField|CrispyField[],
  translateFn: TRANSLATE_FN,
  fieldCssClass?: string,
  validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
  asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
): CrispyForm {

  if (Array.isArray(field)) {
    field = CrispyDiv(
      'container',
      field
    );
  }
  const fg = new FormGroup({}, validatorOrOpts, asyncValidator);
  return {
    form: buildFormGroup([field], fg),
    field,
    fieldCssClass: ''
  }
}

export function CrispyDiv(
  cssClass: string,
  children: CrispyField | CrispyField[]
): CrispyField {
  return {
    type: 'div',
    name: '',
    cssClass,
    children: Array.isArray(children) ? children : [children],
  };
}

export function CrispyRow(
  children: CrispyField | CrispyField[],
  cssClass?: string,
): CrispyField {
  return {
    type: 'row',
    name: '',
    cssClass: cssClass ? cssClass : 'row',
    children: Array.isArray(children) ? children : [children],
  };
}

export function crispyTextField(
  name: string,
  initial: string,
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
): CrispyField {
  return { type: 'text', name, initial, validators, label, hint, cssClass };
}

export function CrispyText(
  name: string,
  initial?: string,
  options?: Partial<CrispyField>
): CrispyField {
  return {
    ...options ?? {},
    type: 'text',
    name,
    initial
  };
}

export function crispyNumberField(
  name: string,
  initial: number|undefined,
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
): CrispyField {
  return { type: 'number', name, initial, validators, label, hint, cssClass };
}

export function CrispyNumber(
  name: string,
  initial?: number,
  options?: Partial<CrispyField>
): CrispyField {
  return {
    ...(options ?? {}),
    type: 'number',
    name,
    initial
  };
}

export function crispyEmailField(
  name: string,
  initial: string,
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
): CrispyField {
  return { type: 'email', name, initial, validators, label, hint, cssClass };
}

export function CrispyEmail(
  name: string,
  initial?: string,
  options?: Partial<CrispyField>
): CrispyField {
  return { 
    ...(options ?? {}),
    type: 'email',
    name,
    initial
  };
}

export function crispyDateField(
  name: string,
  initial: Date,
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
): CrispyField {
  return { type: 'date', name, initial, validators, label, hint, cssClass };
}

export function CrispyDate(
  name: string,
  initial?: Date,
  options?: Partial<CrispyField>
): CrispyField {
  return {
    ...(options ?? {}),
    type: 'date',
    name,
    initial
  };
}


export function crispyTextareaField(
  name: string,
  initial: string,
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
): CrispyField {
  return { type: 'textarea', name, initial, validators, label, hint, cssClass };
}

export function CrispyTextarea(
  name: string,
  initial?: string,
  options?: Partial<CrispyField>
): CrispyField {
  return {
    ...(options ?? {}),
    type: 'textarea',
    name,
    initial
  };
}

export function crispySearchField(
  name: string,
  initial: string,
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
): CrispyField {
  return { type: 'search', name, initial, validators, label, hint, cssClass };
}

export function CrispySearch(
  name: string,
  initial?: string,
  options?: Partial<CrispyField>
): CrispyField {
  return {
    ...(options ?? {}),
    type: 'search',
    name,
    initial
  };
}

export function crispyPasswordField(
  name: string,
  initial = '',
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
): CrispyField {
  return { type: 'password', name, initial, validators, label, hint, cssClass };
}

export function CrispyPassword(
  name: string,
  initial?: string,
  options?: Partial<CrispyField>
): CrispyField {
  return {
    ...(options ?? {}),
    type: 'password',
    name,
    initial
  };
}

export function crispySelectField(
  name: string,
  options: SelectOption[]|Observable<SelectOption[]>,
  initial: any,
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
): CrispyField {
  return {
    type: 'select',
    name,
    initial,
    validators,
    label,
    hint,
    cssClass,
    options: { 
      selectOptions: { options: options }
    }
  };
}

export function CrispySelect(
  name: string,
  selectOptions: SelectOption[]|Observable<SelectOption[]>,
  options?: Partial<CrispyField>
): CrispyField {
  return {
    ...options ?? {},
    type: 'select',
    name,
    options: {
      selectOptions: { options: selectOptions },
    }
  };
}

export function crispyDateRangeField(
  name: string,
  options: DateRangeOptions,
  initial: any,
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
): CrispyField {
  return {
    type: 'daterange',
    name,
    initial,
    validators,
    label,
    hint,
    cssClass,
    options: {
      dateRangeOptions: options
    }
  };
}

export function CrispyDateRange(
  name: string,
  dateRangeOptions: DateRangeOptions,
  initial?: any,
  options?: Partial<CrispyField>,
): CrispyField {
  return {
    ...(options ?? {}),
    type: 'daterange',
    name,
    initial,
    options: {
      dateRangeOptions
    }
  };
}

export function crispyCustomComponentField(
  name: string,
  options: CustomComponentOptions,
  initial: any,
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
): CrispyField {
  return {
    type: 'custom',
    name,
    initial,
    validators,
    label,
    hint,
    cssClass,
    options: {
      customComponentOptions: options
    }
  };
}

export function CrispyCustomComponent(
  name: string,
  initial?: any,
  customComponentOptions?: CustomComponentOptions,
  options?: Partial<CrispyField>,
): CrispyField {
  return {
    ...(options ?? {}),
    type: 'custom',
    name,
    initial,
    options: {
      customComponentOptions
    }
  };
}

export function crispyTemplateField(
  name: string,
  initial: any,
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
  context?: FieldContext
): CrispyField {
  return {
    type: 'template',
    name,
    initial,
    validators,
    label,
    hint,
    cssClass,
    options: {
      templateComponentOptions: {
        context: context
      }
    }
  };
}

export function CrispyTemplate(
  name: string,
  initial?: any,
  templateComponentOptions?: TemplateComponentOptions,
  options?: Partial<CrispyField>,
): CrispyField {
  return {
    ...(options ?? {}),
    type: 'template',
    name,
    initial,
    options: {
      templateComponentOptions
    }
  };
}

export function crispyFormGroup(
  name: string,
  fields: CrispyField[],
  initial?: any,
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string
): CrispyField {
  return {
    type: 'group',
    name,
    initial,
    validators,
    label: undefined,
    hint: undefined,
    cssClass,
    children: fields,
  };
}

export function CrispyFormGroup(
  name: string,
  fields: CrispyField|CrispyField[],
  validators?: ValidatorFn | ValidatorFn[]
): CrispyField {
  return {
    type: 'group',
    name,
    initial: undefined,
    validators,
    label: undefined,
    hint: undefined,
    cssClass: undefined,
    children: Array.isArray(fields) ? fields : [fields],
  };
}

export function crispyFormGroupArray(
  name: string,
  fields: CrispyField[],
  initial?: any,
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string
): CrispyField {
  return {
    type: 'groupArray',
    name,
    initial,
    validators,
    label: label,
    hint: undefined,
    cssClass,
    children: fields,
  };
}

export function CrispyFormGroupArray(
  name: string,
  children: CrispyField[],
  initial?: any,
  options?: Partial<CrispyField>,
): CrispyField {
  return {
    ...(options ?? {}),
    type: 'groupArray',
    name,
    initial,
    children
  };
}

export function crispyCheckboxField(
  name: string,
  initial: boolean,
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
): CrispyField {
  return { type: 'checkbox', name, initial, validators, label, hint, cssClass };
}

export function CrispyCheckbox(
  name: string,
  initial?: boolean,
  options?: Partial<CrispyField>,
): CrispyField {
  return {
    ...(options ?? {}),
    type: 'checkbox',
    name,
    initial: !!initial
  };
}
