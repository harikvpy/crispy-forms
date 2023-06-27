import {
  ValidatorFn,
  FormControl,
  FormGroup,
  AbstractControlOptions,
  AsyncValidatorFn,
} from '@angular/forms';
import { CrispyFieldType, CrispyFieldProps, CrispyForm, SelectOption } from './crispy-types';
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

export function getCrispyFormHelper(
  fields: CrispyFormField[],
  translateFn: TRANSLATE_FN,
  fieldCssClass?: string,
  validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
  asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
): CrispyForm {
  return {
    form: getFormGroup(fields, validatorOrOpts, asyncValidator),
    fields: getCrispyFields(fields, translateFn, fieldCssClass),
    fieldCssClass,
  };
}

/**
 * An interface that unifies the reactive form field and its CrispyFieldProps
 * interface counterpart.
 *
 * Crispy Forms engine is a reactive form layout engine which arranges the
 * form's controls as per its definition in the CrispyFieldProps object.
 * Typically there's a one-to-one mapping between the reactive form field
 * and it's layout definition. Therefore, given a layout definition, it's
 * possible to generate the reactive form control corresponding to that
 * and then collect all these controls into a FormGroup.
 *
 * The FormGroup generated together with the CrispyFields, the CrispyForm
 * object can be composed and passed as an argument to the
 * <app-crispy-form> component.
 *
 * We should be able to derive a FormControl or FormGroup
 * instance from an instance of this class. This will help us
 * build a FormGroup from a collection of these objects.
 *
 * cf = [
 *  CF('name', 'text),
 *  CF('age', 'number'),
 *  CF('password', 'password'),
 *  CF('confirmPassword', 'password'),
 *  CF('publicationRange', 'daterange', )
 * ]
 */
export interface CrispyFormField {
  name: string;
  type: CrispyFieldType;
  initial: any;
  validators?: ValidatorFn | ValidatorFn[];
  label?: string;
  hint?: string;
  cssClass?: string;
  children?: CrispyFormField[];
  options?: Partial<CrispyFieldProps>;
}

export function crispyTextField(
  name: string,
  initial: string,
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
): CrispyFormField {
  return { type: 'text', name, initial, validators, label, hint, cssClass };
}

export function crispyNumberField(
  name: string,
  initial: string,
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
): CrispyFormField {
  return { type: 'number', name, initial, validators, label, hint, cssClass };
}

export function crispyEmailField(
  name: string,
  initial: string,
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
): CrispyFormField {
  return { type: 'email', name, initial, validators, label, hint, cssClass };
}

export function crispyTextareaField(
  name: string,
  initial: string,
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
): CrispyFormField {
  return { type: 'textarea', name, initial, validators, label, hint, cssClass };
}

export function crispySearchField(
  name: string,
  initial: string,
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
): CrispyFormField {
  return { type: 'search', name, initial, validators, label, hint, cssClass };
}

export function crispyPasswordField(
  name: string,
  initial = '',
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
): CrispyFormField {
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
): CrispyFormField {
  return {
    type: 'select',
    name,
    initial,
    validators,
    label,
    hint,
    cssClass,
    options: {
      selectOptions: { options },
    },
  };
}

export function crispyDateRangeField(
  name: string,
  options: CrispyFieldProps['dateRangeOptions'],
  initial: any,
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
): CrispyFormField {
  return {
    type: 'daterange',
    name,
    initial,
    validators,
    label,
    hint,
    cssClass,
    options: {
      dateRangeOptions: options,
    },
  };
}

export function crispyCustomComponentField(
  name: string,
  options: CrispyFieldProps['customControlOptions'],
  initial: any,
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
): CrispyFormField {
  return {
    type: 'custom',
    name,
    initial,
    validators,
    label,
    hint,
    cssClass,
    options: {
      customControlOptions: options,
    },
  };
}

export function crispyTemplateField(
  name: string,
  initial: any,
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string,
  label?: string,
  hint?: string,
): CrispyFormField {
  return {
    type: 'template',
    name,
    initial,
    validators,
    label,
    hint,
    cssClass
  };

}

export function crispyFormFieldGroup(
  name: string,
  fields: CrispyFormField[],
  initial?: any,
  validators?: ValidatorFn | ValidatorFn[],
  cssClass?: string
): CrispyFormField {
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

function getFormControl(cf: CrispyFormField) {
  const keys = Object.keys(cf);
  const hasInitial =
    keys.find((k) => k.localeCompare('initial') == 0 && !!(cf as any)[k]) != undefined;
  if (cf.type === 'daterange') {
    // Special handler for 'daterange' field type
    const group = new FormGroup({});
    const beginInitial =
      (hasInitial &&
        cf.initial[(cf as any).options.dateRangeOptions.beginRangeFormControlName]) ||
      null;
    group.addControl(
      (cf as any).options.dateRangeOptions.beginRangeFormControlName,
      new FormControl<Date | null>(beginInitial, {
        nonNullable: !!beginInitial,
        validators: (cf as any).options.dateRangeOptions?.beginRangeValidators,
      })
    );
    const endInitial =
      (hasInitial &&
        cf.initial[(cf as any).options.dateRangeOptions.endRangeFormControlName]) ||
      null;
    group.addControl(
      (cf as any).options.dateRangeOptions.endRangeFormControlName,
      new FormControl<Date | null>(endInitial, {
        nonNullable: !!endInitial,
        validators: (cf as any).options.dateRangeOptions?.endRangeValidators,
      })
    );
    return group;
  } else {
    return new FormControl(
      hasInitial ? cf.initial : isInputFieldType(cf.type) ? '' : undefined,
      hasInitial
        ? { nonNullable: true, validators: cf.validators }
        : { validators: cf.validators }
    );
  }
}

function getFormGroup(
  cfs: CrispyFormField[],
  validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
  asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
): FormGroup {
  const fg = new FormGroup({}, validatorOrOpts, asyncValidator);
  cfs.forEach((cf) => {
    if (!cf.children) {
      fg.addControl(cf.name, getFormControl(cf));
    } else {
      fg.addControl(cf.name, getFormGroup(cf.children, cf.validators));
    }
  });
  return fg;
}

function getCrispyFields(
  cfs: CrispyFormField[],
  translateFn: TRANSLATE_FN,
  defaultFieldCssClass?: string
): CrispyFieldProps[] {
  const fields = new Array<CrispyFieldProps>();
  cfs.forEach((cf) => {
    if (!cf.children) {
      fields.push({
        label: translateFn(cf.label ?? cf.name),
        hint: cf.hint ? translateFn(cf.hint) : undefined,
        formControlName: cf.name,
        type: cf.type,
        cssClass: cf.cssClass ?? defaultFieldCssClass ?? '',
        ...cf.options,
      });
    } else {
      const childFields = getCrispyFields(
        cf.children,
        translateFn,
        defaultFieldCssClass
      );
      fields.push({
        label: '',
        type: 'group',
        formControlName: cf.name,
        children: childFields,
      });
    }
  });
  return fields;
}
