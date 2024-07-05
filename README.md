<p align="center">
  <img width="20%" height="20%" src="./logo.svg">
</p>

<br />

> Quick and crispy Angular forms, including layout, all from TypeScript!

Crispy Forms is a forms engine that combines form definition and its layout in a single declaration, all from TypeScript code. It is built over Angular's Reactive Forms, but integrates a layout engine which renders the form created from the declaration.

So instead of this :
```
import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/reactive-forms';

@Component({
  selector: 'app-registration-form',
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

With Crispy Forms, you can do this:
```
import { Component } from '@angular/core';
import { CrispyDiv, CrispyText, CrispyEmail, buildCrispy } from '@smallpearl/crispy-mat-form';

@Component({
  selector: 'app-registration-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <crispy-mat-form [crispy]="crispy"></crispy-mat-form>
    </form>
  `
})
export class RegistrationFormComponent {
  crispy!: CrispyForm = CrispyDiv('container', [
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
  ]);
  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required]
    })
  }
  onSubmit() {
    console.log(this.crispy.form.value);
  }
}
```

# Dependencies

* Angular ≥^15.0.0
* Angular Material, ≥^15.0.0

# Getting started


# How to use

There are two ways.

* Raw approach: By defining the FormGroup and the layout for the individual fields in the FormGroup.
* Using helper methods: By using helper methods in the library to combine the above two into a single step.

Each of these methods are explained below.

## Raw approach

1. First define your reactive form group. For eg.:

    ```
    const form = fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      units: [0],
      category: ['CL', Validators.required],
      password: ['', Validators.required],
      confirmPassword: [''],
      publishOn: ['',],
      publishedOnRange: fb.group({
        published_on__gte: new FormControl<Date | null>(null),
        published_on__lte: new FormControl<Date | null>(null)
      }),
      telephone: [null, Validators.required],
    });
    ```

2. Then define the form layout, specifying the field type and layout rules for
each field in the form above in a `CrispyForm` object.

    ```
    const crispy: CrispyForm = {
      form: form,
      fields: [
        {
          label: 'First name',
          type: 'text',
          formControlName: 'firstName',
          cssClass: 'pe-2 w-50'
        },
        {
          label: 'Last name',
          type: 'text',
          formControlName: 'lastName',
          cssClass: 'w-50'
        },
        {
          label: 'Units',
          type: 'number',
          formControlName: 'units',
          cssClass: 'pe-2 w-50'
        },
        {
          label: 'Category',
          type: 'select',
          formControlName: 'category',
          cssClass: 'w-50',
          selectOptions: [
            { label: 'All', value: '' },
            { label: 'Open', value: 'OP' },
            { label: 'Closed', value: 'CL' },
          ]
        },
        {
          label: 'Password',
          hint: 'Minium 8 characters, at least one non-alphabet.',
          type: 'password',
          formControlName: 'password',
          cssClass: 'pe-2 w-50'
        },
        {
          label: 'Confirm password',
          hint: 'Renter the same password.',
          type: 'password',
          formControlName: 'confirmPassword',
          cssClass: 'w-50'
        },
        {
          label: 'Published On',
          type: 'daterange',
          formControlName: 'publishedOnRange',
          cssClass: 'pe-2 w-50',
          dateRangeOptions: {
            beginRangeLabel: 'From',
            endRangeLabel: 'To',
            beginRangeFormControlName: 'published_on__gte',
            endRangeFormControlName: 'published_on__lte'
          }
        },
        {
          label: 'Unit',
          type: 'custom',
          formControlName: 'unit',
          cssClass: 'pe-2 w-50',
          customControlOptions: {
            component: CustomControlComponent
          }
        },
        {
          label: 'Telephone',
          type: 'custom',
          formControlName: 'mobile',
          cssClass: 'w-50',
          customControlOptions: {
            component: QQWebTelInputComponent
          }
        }
      ]
    }
    ```

    As you can see, for each field in the form, we define its layout rules in the `fields` member of `crispy`, which is of type `CrispyForm`. Each field in the `fields` array is declared as of type `CrispyField`.

3. With the CrispyForm defined, you can use it like below in the template:

    ```
    <form [formGroup]="crispy.form" (ngSubmit)="onSubmit()">
      <app-crispy-form [crispy]="crispy"></app-crispy-form>
      <div>
        <button mat-raised-button color="primary" type="reset">Reset</button>&nbsp;
        <button mat-raised-button color="primary" type="submit">Submit</button>
      </div>
    </form>
    ```

    And in the corresponding TypeScript source, handle the form like you would do with a regular Angular reactive form:

    ```
    {
      ...
      onSubmit() {
        console.log(`onSubmit - form.value: ${JSON.stringify(this.crispy.form.value)}`);
      }
      ...
    }
    ```

    Keeping the `<form>` tag outside of the `<app-crispy-form>` tag allows you to add any additional fields that either does not conform to the `MatFormFieldControl<>` interface or for some reason has compatibility issues with the `crispy-forms` library. Moreover, you can add additional buttons other than the standard `Reset` and `Submit`, if necessary.


# CrispyField

  ```
  export interface CrispyField {
    // Label use for the field. Wil be placed in a <mat-label> tag.
    label: string;
    // The field type. This controls the type of UI widget used.
    type: CrispyFieldType,
    // Related reactive form control's name.
    formControlName: string;
    // An optional hint for the field. If specified, will be placed in a <mat-hint> tag.
    hint?: string;
    // Additional cssClasses that will be added to the <mat-form-field> wrapper.
    cssClass?: string;
    /* Only for 'select' field type. Specifies the individual options. */
    selectOptions?: Array<{
      label: string;
      value: string | number;
    }>;
    /* Only for 'daterange' field type. The member should be self-explantory. */
    dateRangeOptions?: {
      beginRangeLabel?: string; // defaults to 'Start'
      beginRangeFormControlName: string;
      endRangeLabel?: string;   // defaults to 'End'
      endRangeFormControlName: string;
    };
    /* Only for 'custom' field type. */
    customControlOptions?: {
      component: any  // The custom component class object that will be dynamically created.
    }
  }
  ```

Essentially for each of the form's field, you declare its label, field type and
the form control's name. Field type controls the UI widget that will be used
to render the form field.

The table below lists the field types that are currently recognized along with their corresponding HTML widget type.

  | Field Type | HTML widget |
  |------------|-------------|
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

Note that for the `custom` field type, the widget component should implement the `MatFormFieldControl<>` interface as the control will be wrapped in a `<mat-form-field>` tag. In the example above, both `CustomControlComponent` and `QQWebTelInputComponent` are two custom control components that comfrom to the `MatFormFieldControl<>` interface. Refer to [Creating a custom field control](https://material.angular.io/guide/creating-a-custom-form-field-control) doc for details.

Also remember to import the custom control component in the parent component's module(or component, if you're using standalone components) for its dynamic instantiation from within `crispy-forms` to work.

For `template` field type, the `ng-template` should be defined as:

  ```
  <ng-template crispyFieldName="reported_by">
    <!-- your custom field's HTML -->
  </ng-template>
  ```

`crispyFieldName` directive's value should match the field's name used in `FormGroup.controls` and `CrispyForm.fields`.


## Using helper methods

The task of defining a FormGroup and then specifying its layout via `CrispyForm.fields` can soon become quite repetitive and tedious. Besides, this process spreads the logic of the form across two different declarations, even though they are closely related to each other. So to streamline the process, the library component comes with a few helper methods that can be used to define the form & its layout in one declaration.

This is facilitated by the `CrispyField` interface, which is defined as:
```
export interface CrispyField {
  name: string;
  type: CrispyFieldType;
  initial: any;
  validators?: ValidatorFn | ValidatorFn[];
  label?: string;
  hint?: string;
  cssClass?: string;
  children?: CrispyField[];
  options?: Partial<CrispyFieldProps>;
}
```

Just like each field in a reactive form is defined via a `FormControl` instance, in crispy forms, each field is defined by a `CrispyField` object definition. You define an array of `CrispyField` objects and then pass it as the first argument to `getCrispyFormHelper` function, also provided by the library. `getCrispyFormHelper` will create the `FormGroup` and also its layout definition, returning a `Crispy` object. This object can then passed to `crispy-mat-form` component.

Alternatively, `crispy-mat-form` also takes the array of `CrispyField` as a parameter in which case the component would internall call `getCrispyFormHelper` to convert that into a `Crispy` object.

The following example illustrates the latter approach:

```
...
import {
  CrispyMatFormComponent,
  crispyTextField,
} from '@smallpearl/crispy-mat-form';

@Component({
imports: [
  CommonModule,
  ReactiveFormsModule,
  MatButtonModule,
  CrispyMatFormModule,
],
template: `
  <form [formGroup]="crispyComponent.form" (ngSubmit)="onSubmit()">
    <crispy-mat-form [cffs]="cffs"> </crispy-mat-form>
    <div>
      <button mat-raised-button color="primary" type="button" (click)="onReset()">
        Reset
      </button>&nbsp;
      <button mat-raised-button color="primary" type="submit" [disabled]="crispyComponent.form.invalid">
        Submit
      </button>
    </div>
  </form>
`,
})
export class AppComponent implements OnInit {
  cffs!: CrispyField[];
  @ViewChild(CrispyMatFormComponent, { static: true }) crispyComponent!: CrispyMatFormComponent;

  ngOnInit() {
    this.cffs = [
      crispyTextField('name', '', Validators.required, 'pe-2 w-50'),
      crispyEmailField('email', '', Validators.required, 'w-50'),
    ];
  }
  onReset() {
    this.crispyComponent.form.reset();
  }
  onSubmit() {
    console.log(
      `onSubmit - form.value: ${JSON.stringify(
        this.crispyComponent.form.value
      )}`
    );
  }
}
```

## Field functions
To ease the process further, instead of defining an array of `CrispyField` objects, the library comes with a series of helper functions that would return a `CrispyField` object from its arguments. Using these functions is easier as each function comes with own brief parameter documentation which will be available during its definition via the editor's context-sensitive help feature. Also using functions allows the library to ensure that the `CrispyField` definition for the field type is accurate and is complete (as required `CrispyField` object fields are make mandatory in the function's parameter declaration.

This table lists the functions and their corresponding field type:

  | Function   | Field Type |
  |------------|-------------|
  | crispyTextField | HTML input with type="text" |
  | crispyNumberField | HTML input with type="number" |
  | crispySearchField | HTML input with type="search" |
  | crispyEmailField | HTML input with type="email" |
  | crispyPasswordField | HTML input with type="password" |
  | crispyCheckboxField | MatCheckboxField |
  | crispySelectField | MatSelect |
  | crispyDateField | MatDateField |
  | crispyDateRangeField | MatDateRangeField |
  | crispyCustomField | Field with a custom reactive forms control (ControlValueAccesor) |
  | crispyTemplateField | Field whose HTML will be rendered with contents of `<ng-template>` |

# Error-tailor support

Crispy forms includes support for reflecting field errors via the [@ngneat/error-tailor](https://github.com/ngneat/error-tailor). However, due to vagaries of material's error reporting mechanism, the client code needs to initialize Error Tailor with the appropriate configuration for this to work. Specifically, in the client relevant module class declaration, initialize Error Tailor like this:

```
import { errorTailorImports, provideErrorTailorConfig } from '@ngneat/error-tailor';
import { MatErrorTailorControlErrorComponent } from '@smallpearl/crispy-mat-form';

@NgModule({
  ...
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ...
    errorTailorImports,
    CrispyMatFormModule,
  ],
  providers: [
    provideErrorTailorConfig({
      blurPredicate(element) {
        return element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'MAT-SELECT';
      },
      controlErrorComponent: MatErrorTailorControlErrorComponent,
      errors: {
          useValue: {
            required: 'This field is required',
            pattern: "Doesn't match the required pattern",
            minlength: ({ requiredLength, actualLength }) => 
                        `Expect ${requiredLength} but got ${actualLength}`,
            invalidAddress: error => `Address isn't valid`
          }
        }
      }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```
Note the `MatErrorTailorControlErrorComponent` which is used to substitute the Error Tailor original `DefaultControlErrorComponent` for rendering field errors. Also note how `blurPredicate` is overridden to support `MAT-SELECT`.

Once this is setup, Crispy Material Forms should render any field validation errors when the field receives the 'blur' event or when the enclosing form is submitted.

## Using in pure Angular Material forms
If you've have a pure Angular form (not crispy form), you can add Error Tailor support using the same `MatErrorTailorControlErrorComponent` like this:

```
<form [formGroup]="form" (ngSubmit)="onSubmit()" errorTailor>
  <mat-form-field>
    <mat-label>Name</mat-label>
    <input
      type="text"
      matInput
      [formControlName]="name"
      [controlErrorAnchor]="errorAnchor"
    />
    <mat-error><ng-template controlErrorAnchor #errorAnchor="controlErrorAnchor"></ng-template></mat-error>
  </mat-form-field>
</form>
```
We're using Error Tailor's `controlErrorAnchor` directive to customize its behavior to render errors as `<mat-error>` elements.

# Sample code
The demo project in the workspace shows a rather comprehensive example of how the component can be used to efficiently design forms and then process their value in your code. Particularly, you may want to pay attention to the form validators that abstracts all of the business logic of the form's data.

# Advantages

* All the controls are defined in *compiled* TypeScript which protects you from typos and other mistakes that can occur in HTML's declarative syntax.
* Library takes care of the layout saving you from having to deal with HTML code and remembering the minute declarative syntax details for each Material control type.
* Insulation from changes made to Material library between successive versions as this would only require updates to the Crispy Forms library.

When you have a project consisting of tens (or even hundreds) of forms, this can increase your productivity tremendously while making the code more maintainable & therefore more robust.

# Background
The project is inspired by the [Django Crispy Forms](https://github.com/django-crispy-forms/django-crispy-forms) which provides a similar feature, but for the Django backend. This explains the `crispy` part in its name.

Currently, the library exclusively uses [Angular Material](https://material.angular.io/) components for its widgets. Material was chosen as it can be seen as an extension to the core Angular package, is well supported and does provide an exhaustive library of components that ought to satisfy most use cases. That said, it's quite feasible to adapt the library to support a different component library or even abstract the component library support as an independent module which can then be selected by the client via a global configuration.

Note that though it uses Angular Material components, Crispy Forms also includes support for user developed custom components. These may be provided to the engine via named templates from client code and specified using the `CrispyTemplate` function.

# Motivation

# TODO
  * Unit tests
  * Improved documentation. Perhaps a reference section.

# Version History
* 0.1 - Initial release
* 0.2 - 
* 0.3 - Added `crispyCheckboxField`.
* 0.4 - More elaborate readme.
