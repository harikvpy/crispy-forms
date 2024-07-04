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
  CustomControlOptions,
  FieldContext,
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
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
): CrispyField {
  return { type: 'text', name, initial, validators, label, hint, cssClass };
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
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
): CrispyField {
  return { type: 'number', name, initial, validators, label, hint, cssClass };
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
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
): CrispyField {
  return { type: 'email', name, initial, validators, label, hint, cssClass };
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
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
): CrispyField {
  return { type: 'date', name, initial, validators, label, hint, cssClass };
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
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
): CrispyField {
  return { type: 'textarea', name, initial, validators, label, hint, cssClass };
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
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
): CrispyField {
  return { type: 'search', name, initial, validators, label, hint, cssClass };
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
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
): CrispyField {
  return { type: 'password', name, initial, validators, label, hint, cssClass };
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
    options: { options: options },
  };
}


export function CrispySelect(
  name: string,
  options: SelectOption[]|Observable<SelectOption[]>,
  initial?: string | number,
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
    options: { options: options },
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
    options: options
  };
}

export function crispyCustomComponentField(
  name: string,
  options: CustomControlOptions,
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
    options: options
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
      context: context
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

function getCrispyFields(
  cfs: CrispyField[],
  translateFn: TRANSLATE_FN,
  defaultFieldCssClass?: string
): CrispyField[] {
  const fields = new Array<CrispyField>();
  cfs.forEach((cf) => {
    if (!cf.children) {
      fields.push({
        ...cf,
        label: translateFn(cf.label ?? cf.name),
        cssClass: cf.cssClass ?? defaultFieldCssClass ?? '',
        hint: cf.hint ? translateFn(cf.hint) : undefined,
    });
      // fields.push({
      //   field: cf,
      //   label: translateFn(cf.label ?? cf.name),
      //   hint: cf.hint ? translateFn(cf.hint) : undefined,
      //   formControlName: cf.name,
      //   type: cf.type,
      //   cssClass: cf.cssClass ?? defaultFieldCssClass ?? '',
      //   ...cf.options,
      // });
    } else {
      const childFields = getCrispyFields(
        cf.children,
        translateFn,
        defaultFieldCssClass
      );
      fields.push({
        ...cf,
        label: translateFn(cf.label ?? cf.name),
        children: childFields
      })
      // fields.push({
      //   field: cf,
      //   label: translateFn(cf.label ?? cf.name),
      //   type: cf.type,
      //   formControlName: cf.name,
      //   children: childFields,
      // });
    }
  });
  return fields;
}
