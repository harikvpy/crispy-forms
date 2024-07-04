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

type TRANSLATE_FN = (code: string, args?: any) => string;

/**
 * Returns true if the given type is of HTML input field type.
 * @param type
 * @returns
 */
const isInputFieldType = (type: CrispyFieldType) =>
  type == 'text' ||
  type == 'number' ||
  type == 'email' ||
  type == 'password' ||
  type == 'search' ||
  type == 'textarea';

// V2 - imported from crispy-test
function buildFormGroup(cfs: CrispyField[], fg: FormGroup): FormGroup {
  cfs.forEach((cf) => {
    if (cf.type === 'row') {
      // All the children of this row should be distributed equally in the
      // row. Use 12 columns/# of children to get the width of each column.      
      if (cf.children) {
        const colWidth = Math.floor(12/cf.children.length);
        const lastColWidth = colWidth + (12 - cf.children.length*colWidth);
        const colWidths: string[] = [];
        for (let index = 0; index < cf.children.length-1; index++) {
          colWidths.push(`col-sm-${colWidth}`);
        }
        colWidths.push(`col-sm-${lastColWidth}`);
        buildFormGroup(cf.children, fg);
        cf.children.forEach((field: CrispyField, index: number) => {
          field.cssClass = (field.cssClass ?? '') + ' ' + colWidths[index];
        });
      }
    }
    else if (cf.type === 'div') {
      if (cf.children) {
        buildFormGroup(cf.children, fg);
      }
    } else {
      if (cf.type === 'group') {
        if (cf.children) {
          const subFg = new FormGroup({});
          fg.addControl(cf.name, buildFormGroup(cf.children, subFg));
        }
      } else if (cf.type === 'groupArray') {
        const fa = new FormArray<FormGroup>([])
        fg.addControl(cf.name, fa);
      } else {
        fg.addControl(cf.name, getFormControl(cf));
      }
    }
  });
  return fg;
}

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

  // return {
  //   form: getFormGroup(field, validatorOrOpts, asyncValidator),
  //   fields: getCrispyFields(field, translateFn, fieldCssClass),
  //   fieldCssClass,
  // };
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

function getFormControl(cf: CrispyField) {
  const keys = Object.keys(cf);
  const hasInitial =
    keys.find((k) => k.localeCompare('initial') == 0 && !!(cf as any)[k]) != undefined;
  if (cf.type === 'daterange') {
    // Special handler for 'daterange' field type
    const options: DateRangeOptions = cf.options as DateRangeOptions;
    const group = new FormGroup({});
    const beginInitial =
      (hasInitial &&
        cf.initial[options.beginRangeFormControlName]) ||
      null;
    group.addControl(
      options.beginRangeFormControlName,
      new FormControl<Date | null>(beginInitial, {
        nonNullable: !!beginInitial,
        validators: options?.beginRangeValidators,
      })
    );
    const endInitial =
      (hasInitial &&
        cf.initial[options.endRangeFormControlName]) ||
      null;
    group.addControl(
      options.endRangeFormControlName,
      new FormControl<Date | null>(endInitial, {
        nonNullable: !!endInitial,
        validators: options?.endRangeValidators,
      })
    );
    return group;
  } else {
    if (cf.type === 'number') {
      return new FormControl<number>(hasInitial ? cf.initial : undefined,
        hasInitial
          ? { nonNullable: true, validators: cf.validators }
          : { validators: cf.validators }
      );
    }
    return new FormControl<string>(
      cf.type === 'checkbox'
        ? !!cf?.initial
        : (hasInitial ? cf.initial : isInputFieldType(cf.type) ? '' : undefined),
      hasInitial
        ? { nonNullable: true, validators: cf.validators }
        : { validators: cf.validators }
    );
  }
}

export function getFormGroup(
  cfs: CrispyField[],
  validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
  asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
): FormGroup {
  const fg = new FormGroup({}, validatorOrOpts, asyncValidator);
  cfs.forEach((cf) => {
    if (!cf.children) {
      fg.addControl(cf.name, getFormControl(cf));
    } else {
      if (cf.type === 'group') {
        fg.addControl(cf.name, getFormGroup(cf.children, cf.validators));
      } else if (cf.type === 'groupArray') {
        const fa = new FormArray<FormGroup>([])
        fg.addControl(cf.name, fa);
      }
    }
  });
  return fg;
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
