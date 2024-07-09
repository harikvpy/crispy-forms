<p align="center">
  <img width="20%" height="20%" src="./logo.svg">
</p>

<br />

> Quick and crispy Angular forms, including layout, all from TypeScript!

[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Crispy Forms is a forms engine that combines form definition and its layout in a single declaration, all from TypeScript code. It is built over Angular's Reactive Forms, but integrates a layout engine which renders the form created from the declaration.

This is better explained with an example. Angular's native way of using a reactive form looks like this:

```
import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/reactive-forms';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="row">
        <div class="col-12 col-md-6">
          <mat-form-field>
            <mat-label>First name</mat-label>
            <input matInput [formControlName]="firstName" placeholder="First name">
          </mat-form-field>
        </div>
        <div class="col-12 col-md-6">
          <mat-form-field>
            <mat-label>Last name</mat-label>
            <input matInput [formControlName]="lastName" placeholder="Last name">
          </mat-form-field>
        </div>
      </div>
      <div class="row">
        <div class="col-12>
          <mat-form-field>
            <mat-label>Email</mat-label>
            <input type="email" matInput [formControlName]="email" placeholder="Ex. pat@example.com">
          </mat-form-field>
        </div>
      </div>
    </form>
  `
})
export class RegistrationFormComponent {
  form!: FormGroup;
  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required]
    })
  }
  onSubmit() {
    console.log(this.form.value);
  }
}
```

The same form using Crispy Forms, looks like this:
```
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  FORM_ERRORS,
} from '@ngneat/error-tailor';
import {
  CrispyBuilder,
  CrispyDiv,
  CrispyEmail,
  CrispyForm,
  CrispyMatFormModule,
  CrispyRow,
  CrispyText,
} from '@smallpearl/crispy-mat-form';

@Component({
  selector: 'app-registration-form',
  standalone: true,
   imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CrispyMatFormModule,
    MatButtonModule,
  ],
 providers: [
    {
      // Errors that the form's fields would raise. These errors could
      // be a result of local validators or from server side validation.
      provide: FORM_ERRORS, useValue: {
        required: 'This field is required',
        minlength: (error: { requiredLength: number, actualLength: number }) =>
          `Expected ${error.requiredLength} charactres, but got ${error.actualLength}`,
      },
    },
  ],
  template: `
    <form [formGroup]="crispy.form" (ngSubmit)="onSubmit()">
      <crispy-mat-form [crispy]="crispy"></crispy-mat-form>
    </form>
  `
})
export class RegistrationFormComponent {
  crispy!: CrispyForm = this.builder.build(
    CrispyDiv('container', [
      CrispyRow([
        CrispyText('firstName', 'Peter', {
          validators: Validators.required,
          label: 'First name',
        }),
        CrispyText('lastName', 'Parker', {
          validators: Validators.required,
          label: 'Last name',
        }),
      ]),
      CrispyEmail('email', '', {
        validators: Validators.required,
        label: 'Email',
      })
    ])
  );
  
  constructor(private builder: CrispyBuilder) {}

  onSubmit() {
    console.log(this.crispy.form.value);
  }
}
```
Note how the Crispy Forms version eliminates boilerplate HTML code and moves everything to TypeScript? This protects you from any inadvertent mistakes in declarative HTML that is hard to catch during development and consequently makes the code more robust. Also, with Crispy Forms you don't have to remember the declaration syntax for each Material component, saving you countless hours referring to its documentation and numerous copy-paste cycles.

[StackBlitz](https://stackblitz.com/~/github.com/harikvpy/crispy-mat-form-demo1) project that shows the example above.

# Dependencies

* Angular ≥ 15.0.0
* Angular Material ≥ 15.0.0
* @ngneat/error-tailor >= 4.0.0

# Getting started
1. Install the package using `$ npm install @smallpearl/crispy-mat-form` and import `CrispyMatFormModule` into your module or component.
2. Inject `CrispyFormBuilder` into the component where you want to host `crispy-mat-form` and build the `CrispyForm` object using the `CrispyFormBuilder.build()` method. `CrispyFormBuilder.build()` takes one container `CrispyField` object with all the field objects as its children or an array of `CrispyField` objects. It's far easier to create this definition using the `CrispyText`, `CrispyNumber`, `CrispyEmail`, etc. helper functions than defining it statically. A few of these methods such as `CrispyDiv`, `CrispyRow`, `CrispyFormGroup` & `CrispyFormGroupArray` can be used to build an hierarchy of `CrispyField` objects.

    ```
      crispy!: CrispyForm = this.builder.build(
        CrispyDiv('container', [
          CrispyRow([
            CrispyText('firstName', 'Peter', {
              validators: Validators.required,
              label: 'First name',
            }),
            CrispyText('lastName', 'Parker', {
              validators: Validators.required,
              label: 'Last name',
            }),
          ]),
          CrispyEmail('email', '', {
            validators: Validators.required,
            label: 'Email',
          })
        ])
      );
    ```

3. By default the HTML layout engine is built to use [Bootstrap](https://getbootstrap.com/docs/5.3/layout/containers/) CSS classes. Therefore, if you're going to rely on these default classes, make sure to include Bootstrap's CSS file globally either by importing `bootstrap.min.css` in your app's `index.html` or including the css from `angular.json`.

From `index.html`:
```
<!doctype html>
<html lang="en">
<head>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

From `angular.json`:
```
{
  "projects": {
    "<project name>": {
      "architect": {
        ...
        "build": {
          ...
          "options": {
            "styles": [
              "@angular/material/prebuilt-themes/indigo-pink.css",
              "bootstrap/dist/css/bootstrap.min.css", --> bootstrap styles
              "src/styles.scss"
            ]
          }
        }
      }
    }
  }
}
```

If you're using a different CSS grid management system, you can provide the CSS class names that `crispy-mat-form` should use by providing those via the `CRISPY_FORMS_CONFIG_PROVIDER` config property.

```
const CrispyConfig: CrispyFormsConfig = {
  // Field labels and hints are fully localizable and this function
  // helps implement that. It will be called for each field's label and
  // hint and it can return whatever string should be displayed based on
  // user's current language.
  translateFn: (code: string) => code.toUpperCase(),
  groupArrayConfig: {
    addRowText: 'ADD ROW'
  },
  // Default wrapper class for the entire form
  defaultContainerCssClass: 'container',
  // Each field that does not have an explictly specified CSS class
  // will be styled as this.
  defaultRowCssClass: 'row',
  // Number of columns in a row. Default of 12 should work with most
  // grid systems.
  numberOfColsPerRow: 12,
  // The column breakpoint width class that is used for a row with multiple
  // fields. This ensures that the final form is responsive and is usable
  // in all screen sizes.
  defaultColDivCssClassTemplate: 'col-md-{width}'
};

@NgModule({
  declarations: [AppComponent],
  imports: [...],
  providers: [
    { provide: CRISPY_FORMS_CONFIG_PROVIDER, useValue: CrispyConfig },    
  ]
})
export class AppModule {}
```

# Reference

## CrispyForm
The object that defines a Crispy form. It is defined as:

```
export interface CrispyForm {
  form: FormGroup<any>;
  field: CrispyField;
}
```

`field` member holds all the fields as defined by the client and provided to the `CrispyBuilder.build()` method. This single CrispyField is a container field which will hold all the user specified fields as hits children. If the user specified an array of fields as input to `CrispyBuilder.build()`, it will be wrapped in a container `div` CrispyField and `CrispyField.field` will be set to this container field.

`form` member will be set to the `FormGroup` equivalent to the fields as defined by the client. This `FormGroup` is built by `CrispyBuilder.build()` by recursively walking through the `CrispyField` objects provided to it, filtering out any container fields and properly handling any nested `group` and `groupArray` field types (representing them as `FormGroup` & `FormArray` objects).

## CrispyBuilder
This is an injectable class that allows a `CrispyForm` object to be built from its constituent `CrispyField` objects. It consists of only one method

```
export class CrispyBuilder {
  build(
    field: CrispyField | CrispyField[],
    validatorOrOpts?:
      | ValidatorFn
      | ValidatorFn[]
      | AbstractControlOptions
      | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ): CrispyForm
}
```

## CrispyFormsConfig
This object allows application level configuration of the library. It is defined as:

```
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
   * Defaults to 'col-sm-{width}. {width} gets replaced with the column width
   * calculated based on the number of cols per each row rounded up to the
   * nearest whole number.
   */
  defaultColDivCssClassTemplate?: string;
}
```

## CrispyField
The object that is used to represent each field in a `CrispyForm`. Some of these objects are purely container objects which host other `CrispyField` objects whereas others will map one-to-one to a Material component.

  ```
  export interface CrispyField {
    // Field name. This will be the formControlName in the FormGroup()
    name: string;
    // Type of field
    type: CrispyFieldType;
    // Field initial value
    initial?: any;
    // Field validators
    validators?: ValidatorFn | ValidatorFn[];
    // Field label. Will default to `name` if omitted.
    label?: string;
    // Field hint displayed below the field
    hint?: string;
    // CSS class applied to the field wrapper element.
    cssClass?: string;
    // Applicable for container field types such as `div`, `row`, `group` & `groupArray`.
    children?: CrispyField[];
    // Field specific options
    options?: {
      // Only for 'select' field type. Specifies the individual options.
      selectOptions?: SelectOptions,
      // Only for 'daterange' field type. The members should be self-explantory.
      dateRangeOptions?: DateRangeOptions,
      // Only for 'custom' field type.
      customComponentOptions?: CustomComponentOptions,
      templateComponentOptions?: TemplateComponentOptions,
      groupArrayOptions?: GroupArrayOptions
    }
  }
  ```

The `type` member decides the nature of the object and the UI widget that it will be rendered as. The table below lists the field types that are currently recognized along with their corresponding HTML widget type.

  | Field Type | HTML widget |
  |------------|-------------|
  | div        | A `div` container that will wrap all its children `CrispyField`s |
  | row        | A `div` container that will be assigned the CSS class `config.defaultRowCssClass`. All its children will be nested within this `div`. |
  | number     | HTML input with type="number" |
  | text       | HTML input with type="text" |
  | email      | HTML input with type="email" |
  | password   | HTML input with type="password" |
  | search     | HTML input with type="search" |
  | checkbox   | MatCheckbox |
  | date       | MatDatePicker |
  | daterange  | MatDateRangeInput |
  | select     | MatSelect |
  | custom     | Custom widget, as specified in `customControlOptions.component`|
  | template   | `<ng-template>` fragment which will be loaded and placed as the field's HTML |
  | group      | child `FormGroup` |
  | groupArray | A `FormArray` object consisting of multiple `FormGroup` objects |

## Error handling
For a form to be user friendly, its inputs have to be validated and appropriate messages as to what's wrong with the input has to be shown to the user. Crispy Form uses [@ngneat/error-tailor](https://github.com/ngneat/error-tailor) to handle this in a generic way. (In a way, the idea for this project germinated from `@ngneat/error-tailor` together with the need to author many forms quickly while minimizing potential errors.)

To take advantage of this, add the `error-tailor` package (`npm install @ngneat/error-tailor`) and then define a `FORM_ERRORS` provider that captures all the error names as an object. The values of these error names can be a string or a function that returns a string. Refer to `error-tailor` documentation for more details.

Refer to the [StackBlitz](https://stackblitz.com/~/github.com/harikvpy/crispy-mat-form-demo1) project to see how it is done.

Note that if `FORM_ERRORS` is provided at the top application level module, it will be available throughout the project. So you can have a global object with all the form validation errors and then use it across all the forms in your app. As you create new forms and new validation error names, you may keep adding these to this global errors-to-message object.

## Field Functions
#### Helper functions
Field functions are simple helper functions that return a valid `CrispyField` object corresponding to the field type that the function stands for. Using these functions, instead of building `CrispyField` objects directly, will make your form code more readable and consequently far more maintainable. Also using the functions ensures that the client code has a high chance of being insulated from any changes to the library implementation code.

#### Categorized into two
Field functions can be categorized into two -- container functions and field functions. Container functions yield a `CrispyField` object that acts as a container for other CrispyField objects whereas field functions result in a CrispyField object that maps to a Material component. This sounds complex, but once you start using these functions, they are so intuitive that you won't even realize this difference.

#### Uniform signature
All field functions have a somewhat uniform signature. The first two parameters for all these functions are
* form field name, that will be the `formControlName` input
* An optional initial value for the corresponding `FormControl`

If the field function requires any custom parameters such as name of a custom component or options for `mat-select`, this will be the third parameter.

The final parameter is a `Partial<CrispyField>`, which is an optional paramter. This partial includes values for the field's label, it's hint, user specified CSS class, etc. This is specified as a partial to allow the client code to specify only the required optional property values and omit the non-required ones. Note that even through `CrispyField` includes properties such as `name` and `initial`, values for these two properties will always be taken from the first two arguments to the field function.

### CrispyDiv
```
CrispyDiv(
  cssClass: string,
  children: CrispyField | CrispyField[]
): CrispyField
```
Results in a `div` container that would wrap all its children `CrispyField`s. The `div` element will have its class set to `CrispyFormsConfig.defaultContainerCssClass` value. Defaults to `container`.

### CrispyRow
```
CrispyRow(
  children: CrispyField | CrispyField[],
  cssClass?: string
): CrispyField
```
Results in a `div` container with a that would wrap all its children `CrispyField`s. The `div` element will have its class set to `CrispyFormsConfig.defaultRowCssClass` value. Defaults to `row`.

CrispyRow can be used to lay out its children in a single row on wide screens. If the children do not specify their own css classes, they all will be assigned the same width. This is done by assigning them all `col-sm-{width}` css class where `{width}` is replaced by the maximum number columns per row divided by number of fields. The maximum number of columns per row defaults to 12, but can be customized via
`CrispyFormsConfig.numberOfColsPerRow`.

Similarly, the `col-sm-{width}` template can also be customized via the `CrispyFormsConfig.defaultColDivCssClassTemplate` setting.

To illustrate with an example, if you have two fields in a `CrispyRow`, each field would be a child of a parent div and have `col-sm-6` as its css class.

```
<div class="row">
  <child-field class="col-12 col-sm-6"></child-field>
  <child-field class="col col-sm-6"></child-field>
</div>
```

Note how the children also have a `col-12` class applied. So on screen sizes that are smaller than the `col-sm-{*}` breakpoint width, each child is rendered in a separate row ensuring that the form is as usable on small screens as it is on wide desktops.

### CrispyText
```
CrispyText(
  name: string,
  initial?: string,
  options?: Partial<CrispyField>
): CrispyField
```
Creates an `<input type="text" matInput>` element.

### CrispyNumber
```
CrispyNumber(
  name: string,
  initial?: number,
  options?: Partial<CrispyField>
): CrispyField
```
Creates an `<input type="number" matInput>` element.

### CrispyEmail
```
CrispyEmail(
  name: string,
  initial?: string,
  options?: Partial<CrispyField>
): CrispyField
```
Creates an `<input type="email" matInput>` element.

### CrispyPassword
```
CrispyPassword(
  name: string,
  initial?: string,
  options?: Partial<CrispyField>
): CrispyField
```
Creates an `<input type="password" matInput>` element.

### CrispySearch
```
CrispySearch(
  name: string,
  initial?: string,
  options?: Partial<CrispyField>
): CrispyField
```
Creates an `<input type="search" matInput>` element.

### CrispyTextArea
```
CrispyTextarea(
  name: string,
  initial?: string,
  options?: Partial<CrispyField>
): CrispyField
```
Creates a `<textarea matInput>` element.

### CrispyCheckbox
```
CrispyCheckbox(
  name: string,
  initial?: boolean,
  options?: Partial<CrispyField>
): CrispyField
```
Creates a `<mat-checkbox>` element.

### CrispySelect
```
CrispySelect(
  name: string,
  selectOptions: SelectOption[] | Observable<SelectOption[]>,
  options?: Partial<CrispyField>
): CrispyField
```
Creates a `<mat-select>` component. The second argument to this function is `SelectOptions` which is defined as
```
export interface SelectOption {
  label: string;
  value: string | number;
}
export interface SelectOptions {
  options: Array<SelectOption> | Observable<SelectOption[]>;
}
```
Note how the `SelectionOptions` also supports and `Observable<>` as the source. This is to allow you to fetch select options dynamically from an offline provider such as a remote server or local cache DB.

### CrispyDate
```
CrispyDate(
  name: string,
  initial?: Date,
  options?: Partial<CrispyField>
): CrispyField
```
Creates an `<input matInput [matDatepicker]="picker">` element.

### CrispyDateRange
```
CrispyDateRange(
  name: string,
  dateRangeOptions: DateRangeOptions,
  initial?: any,
  options?: Partial<CrispyField>
): CrispyField
```
Creates a `<mat-date-range-input>` component.

Material's date range control is a little complex to instantiate and use. The various properties that are required to initialize this component and use it effectively are encapsulated in the interface `DateRangeOptions` which is defined as:

```
export interface DateRangeOptions {
  beginRangeLabel?: string; // defaults to 'Start'
  beginRangeFormControlName: string;
  beginRangeValidators?: ValidatorFn | ValidatorFn[];
  endRangeLabel?: string; // defaults to 'End'
  endRangeFormControlName: string;
  endRangeValidators?: ValidatorFn | ValidatorFn[];
}
```

You can provide this as the third argument to CrispyDateRange, and let crispy forms do the rest.

### CrispyCustomComponent
```
CrispyCustomComponent(
  name: string,
  initial?: any,
  customComponentOptions?: CustomComponentOptions,
  options?: Partial<CrispyField>
): CrispyField
```
Creates a `<mat-form-field>` with a custom component as the child. The component should implement the `MatFormFieldControl<>` interface. Refer to [Creating a custom field control](https://material.angular.io/guide/creating-a-custom-form-field-control) doc for details.

The third argument to this function is `CustomComponentOptions` which is defined as
```
export interface CustomComponentOptions {
  component: any; // The custom component class object that will be dynamically created.
  context?: FieldContext;
}
```
You specify the custom component's class as the value for `component` property. Also remember to import the custom control component's module(or component, if you're using standalone components) for its dynamic creation from within `crispy-forms` to work.

Any additional context that is to be passed to the component can be provided by the `context` property.


### CrispyTemplate
```
CrispyTemplate(
  name: string,
  initial?: any,
  templateComponentOptions?: TemplateComponentOptions,
  options?: Partial<CrispyField>
): CrispyField
```
When the standard form field types supported by Crispy Form is not sufficient, client can provide the form field's HTML element as a `ng-template` and construct a CrispyField with this template. Following is the code taken from the application sample that is part of the project.

Client code (HTML):
```
<form [formGroup]="crispy.form" (ngSubmit)="onSubmit()">
  <crispy-mat-form [crispy]="crispy"></crispy-mat-form>
</form>

<ng-template crispyFieldName="mobile" let-formGroup="formGroup">
  <span *ngIf="formGroup" [formGroup]="formGroup">
    <mat-form-field class="w-100">
      <mat-label>My Telephone</mat-label>
      <my-tel-input formControlName="mobile"></my-tel-input>
    </mat-form-field>
  </span>
</ng-template>
```

Client code(TS), which contains the CrispyField definition:
```
CrispyTemplate('mobile', {
  area: '737',
  exchange: '777',
  subscriber: '0787',
})
```

How does Crispy know which template refers to which field? The name of the field here is `mobile`, and the template for the field has
a `crispyFieldName` directive, whith the value `mobile`. `crispyFieldName` is a directive exported by Crispy Form and it is used to track templates by their field name. When rendering the form, Crispy uses this link to locate the relevant template for the field specified in `CrispyField` definition.

Another important point to note is how the template gets a `formGroup` context variable, which has to be set in an ancestor element of the `formControlName` element without which, the compilation would fail.

The example above shows a [custom Material form field control](https://material.angular.io/guide/creating-a-custom-form-field-control) which is taken directly from the Material documentation. But this is not a requirement. You can put any component in your template as long as it implements `ControlValueAccessor` interface so that it can work with reactive forms.

Finally remember to import the component and any dependencies in your component (or module) so that the template instantiation can succeed.

### CrispyFormGroup
```
CrispyFormGroup(
  name: string,
  fields: CrispyField | CrispyField[],
  validators?: ValidatorFn | ValidatorFn[]
): CrispyField
```

### CrispyFormGroupArray
```
CrispyFormGroupArray(
  name: string,
  children: CrispyField[],
  initial?: any,
  options?: Partial<CrispyField>
): CrispyField
```

# Sample code
The demo project in the workspace shows a rather comprehensive example of how the component can be used to efficiently design forms and then process their value in your code. Particularly, you may want to pay attention to the form validators that abstracts all of the business logic of the form's data.

## StackBlitz Projects

* [Sample 1](https://stackblitz.com/~/github.com/harikvpy/crispy-mat-form-demo1): shows input fields arranged in a row in large screens. These fields wrap into separate lines on small screens.
* [Sample 2](https://stackblitz.com/~/github.com/harikvpy/crispy-mat-form-demo2): shows usage of `CrispyDate` and `CrispyDateRange`.
* [Sample 3](https://stackblitz.com/~/github.com/harikvpy/crispy-mat-form-demo3): shows usage of `CrispyCustomComponent` and `CrispyTemplate`.

# Pros & Cons
Like any other thirdparty library, using Crispy Forms also has pros & cons. Let's try to identify these and list them.

## Pros
* All the controls are defined in *compiled* TypeScript which protects you from typos and other mistakes that can occur in HTML's declarative syntax.
* Library takes care of the layout saving you from having to deal with HTML code and remembering the minute declarative syntax details for each Material control type.
* Insulation from changes made to Material library between successive versions as this would only require updates to the Crispy Forms library.
* Built-in error handling mechanics that removes the need for hardcoding `<mat-error *ngIf="">` tags in your form's HTML source.

## Cons
* Slight code bloat as using Crispy Forms for simple forms would still pull in Material components such as `matDatePicker` and `mat-date-range-input`
* Form error reporting is done using [@ngneat/error-tailor](https://github.com/ngneat/error-tailor), a third party library, albeit a well established one. This is a powerful library that makes error handling uniform across all your forms in the app and eliminates the need to hardcode `<mat-eror>` tags within your HTML source.

Given these pros & cons, if you have a project consisting of tens (or even hundreds) of forms, maintaining the HTML code for them can be a pain. This will be even more apparent when the underlying component library (Angular Material in this case), introduces some changes that you just can't look past. This is where using a higher layer library such as Crispy Forms can help you manage these changes effectively and keep the code maintainable & robust.

# Inspiration
The project is inspired by the [Django Crispy Forms](https://github.com/django-crispy-forms/django-crispy-forms) which provides a similar feature, but for the Django backend. This explains the `crispy` part in its name.

I also have to acknowledge the cleverness of `@ngneat/error-tailor` for sowing the seeds for this project. It showed that error handling in Angular forms can be abstracted out as a pattern and delegated to an independent module. This project takes this to the next step, whereby form layout and form handling is abstracted out as a generic pattern that can be controlled by user provided configuration from TS.

# Looking Ahead
Currently the library exclusively uses [Angular Material](https://material.angular.io/) components for its widgets. Material was chosen as it can be seen as an extension to the core Angular package, is well supported and does provide an exhaustive library of components that ought to satisfy the most extreme use cases. That said, it's quite feasible to adapt the library to support a different component library or even abstract the component library support as an independent module which can then be selected by the client via a global configuration.
