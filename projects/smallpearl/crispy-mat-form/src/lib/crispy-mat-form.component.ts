import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList
} from '@angular/core';
import {
  FormArray,
  FormGroup
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { getCrispyFormHelper, getFormGroup } from './crispy-mat-form-helper';
import { CrispyFormField, CrispyFieldProps, CrispyForm } from './crispy-types';
import { CrispyFieldNameDirective } from './field-name.directive';
import { CRISPY_FORMS_CONFIG_PROVIDER } from './providers';

/**
 * `<crispy-mat-form>` is a component that makes creating & rendering angular
 * material forms a breeze. The component layers on top of angular's reactive
 * forms to create the required form fields and then layout them in a 
 * standardized way such that application code only has to declare the fields
 * of the form in an array and pass this array to the component as a property.
 * 
 * To illustrate with an example:
 * 
 * `<crispy-mat-form [cffs]="cffs"> </crispy-mat-form>`
 * 
 * where `cffs` is defined as:
 * 
 * ```
 *   @ViewChild(CrispyFormComponent) crispyForm: CrispyFormComponent;
 *   ...
 *   ...
 *   ngOnInit() {
 *     this.cffs = [
 *       crispyTextField('firstName', 'Peter', Validators.required, 'pe-2 w-50'),
 *       crispyTextField('lastName', 'Parker', Validators.required, 'w-50'),
 *     ]
 *   }
 * ```
 * This will create a form with two fields, `firstName` & `lastName` arranged 
 * side by side. Note that in the example, the css classes used come from
 * Bootstrap and it's these classes that provide the side-by-side single-line
 * layout in the form.
 * 
 * Then in the submit handler you can:
 * 
 *   ```
 *   onSubmit() {
 *     const values = this.crispyForm.form.value;
 *     // send the value to the service or use it as data in HttpClient.post().
 *   }
 *   ```
 * 
 * Behind the scenes crispy form works via the structure
 * ```
 * interface CrispyForm {
 *    form: FormGroup;
 *    fields: CrispyFieldProps[];
 * }
 * ```
 * Whereas `form` is the obvious angular's reactive form FormGroup object,
 * `fields` member provides the layout instructions for the individual fields
 * defined in `form`.
 * 
 * To ease the process of composing these two values separately, the library
 * includes a bunch of helper functions that allows you declare the `form` and
 * the `fields` values via a single declaration. What you see in the first
 * example above is code written using these helper functions.
 * 
 * Crispy forms supports the following form field types:
 * 
 *  * HTML input
 *    - text, number, date, password, email, search & textarea
 *  * Material's daterange control
 *  * custom control where the control's component is specified
 *    as an option
 *  * template, where the control's html fragment may be specified
 *    in the client code via ng-template. The NgTemplate is expected
 *    to have the same name as the field.
 *  * group: For nested FormGroups.
 *  * array - for an array of fields or forms
 */
@Component({
  selector: 'crispy-mat-form',
  template: `
    <span *ngFor="let f of crispy.fields">
      <app-crispy-field-input
        *ngIf="
          f.type == 'text' ||
          f.type == 'number' ||
          f.type == 'email' ||
          f.type == 'password' ||
          f.type == 'search' ||
          f.type == 'textarea'
        "
        [crispy]="crispy"
        [field]="f"
      ></app-crispy-field-input>
      <app-crispy-field-select
        *ngIf="f.type == 'select'"
        [crispy]="crispy"
        [field]="f"
      ></app-crispy-field-select>
      <app-crispy-field-daterange
        *ngIf="f.type == 'daterange'"
        [crispy]="crispy"
        [field]="f"
      ></app-crispy-field-daterange>
      <app-crispy-field-date
        *ngIf="f.type == 'date'"
        [crispy]="crispy"
        [field]="f"
      ></app-crispy-field-date>
      <app-crispy-field-checkbox
        *ngIf="f.type == 'checkbox'"
        [crispy]="crispy"
        [field]="f"
      ></app-crispy-field-checkbox>
      <ng-container *ngIf="f.type == 'custom'" [formGroup]="crispy.form">
        <app-crispy-field-custom
          [crispy]="crispy"
          [formControlName]="f.formControlName"
          [field]="f"
        ></app-crispy-field-custom>
      </ng-container>
      <ng-container *ngIf="f.type === 'group'">
        <crispy-mat-form
          [crispy]="getChildrenAsCrispyForm(crispy, f.formControlName)"
        ></crispy-mat-form>
      </ng-container>
      <app-crispy-mat-form-array
        *ngIf="f.type === 'groupArray'"
        [label]="f.label"
        [group]="crispy.form"
        [initial]="f.field.initial"
        [fieldName]="f.formControlName"
        [crispy]="getChildrenAsCrispyForm(crispy, f.formControlName)"
        (formGroupAdded)="formGroupAdded.emit($event)"
        (formGroupRemoved)="formGroupRemoved.emit($event)"
      ></app-crispy-mat-form-array>
      <app-crispy-field-template
        *ngIf="f.type == 'template'"
        [crispy]="crispy"
        [field]="f"
      ></app-crispy-field-template>
    </span>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrispyMatFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ContentChildren(CrispyFieldNameDirective)
  fieldTemplates!: QueryList<CrispyFieldNameDirective>;

  @Input({ required: false }) crispy!: CrispyForm;
  @Input({ required: false }) cffs!: CrispyFormField[];
  @Input({ required: false }) cssClass!: string;
  @Input({ required: false }) multi = false;

  @Output() formGroupAdded = new EventEmitter<{
    field: string;
    form: FormGroup;
  }>();
  @Output() formGroupRemoved = new EventEmitter<{
    field: string;
    form: FormGroup;
  }>();

  private _tempForm = new FormGroup({});

  constructor(private injector: Injector) {}

  ngOnInit(): void {
    if (this.cffs && !this.crispy) {
      this.crispy = this.createCrispyFormFromFields(this.cffs, this.cssClass);
    }
  }

  ngAfterViewInit(): void {
    // console.log(`CrispyMatFormComponent.ngOnInit - field[0].name: ${this.crispy.fields.at(0)?.formControlName}`);  
  }

  ngOnDestroy(): void {}

  getChildrenAsCrispyForm(crispy: CrispyForm, fieldName: string): CrispyForm {
    const field: CrispyFieldProps|undefined = crispy.fields.find(
      (cf) => cf.formControlName == fieldName
    );
    const crispyForm = {
      form: crispy.form.controls[fieldName] as FormGroup,
      fields: field?.children || [],
      fieldCssClass: crispy.fieldCssClass,
    };
    return crispyForm;
  }

  get form(): FormGroup<any> {
    return this.crispy ? this.crispy.form : this._tempForm;
  }

  /**
   * Creates CrispyForm object from array of CrispyFormField objects passed
   * as @Input() cffs.
   *
   * @returns CrispyForm
   */
  private createCrispyFormFromFields(
    cffs: CrispyFormField[],
    defaultCssClass?: string
  ): CrispyForm {
    const config = this.injector.get(CRISPY_FORMS_CONFIG_PROVIDER, null);
    const labelFn = config && config.labelFn ? config.labelFn : (code: string) => code;
    if (!defaultCssClass) {
      defaultCssClass = config && config.defaultCssClass ? config.defaultCssClass : '';
    }
    return getCrispyFormHelper(cffs, labelFn, defaultCssClass);
  }
}

/**
 * A component to render an array of crispy forms. This can come handy in
 * uses cases such as Invoice -> Line Items. Essentially this component would
 * take a CrispyForm object as input and build a FormArray consisting of many
 * instances of this object. 
 */
@Component({
  selector: 'app-crispy-mat-form-array',
  template: `
    <div class="crispy-mat-form-array-wrapper" [formGroup]="group">
      <div class="form-array-label">{{ label }}</div>
      <div
        class="form-array-wrapper"
        *ngFor="let crispy of crispies; let i = index"
      >
        <div class="form-array">
          <crispy-mat-form [crispy]="crispy"></crispy-mat-form>
        </div>
        <div class="array-control">
          <button mat-icon-button type="button" (click)="delRow(i)">
            &#x274C;
          </button>
        </div>
      </div>
      <div class="add-row-buttons">
        <button
          mat-raised-button
          color="primary"
          type="button"
          (click)="addRow(undefined)"
        >
          {{ addRowLabel|async }}
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .crispy-mat-form-array-wrapper {
        margin: 0.5em 0;
        /*
        border: 1px solid lightgrey;
        border-radius: 4px;
        */
      }
      .form-array-wrapper {
        width: 100% !important;
        display: flex;
        flex-direction: row;
      }
      .form-array-label {
        font-size: 1.2em;
        font-weight: 600;
        padding: 0.3em 0.3em;
        /* background-color: lightgrey; */
      }
      .form-array {
        flex-grow: 1;
      }
      .array-control {
        display: flex;
        flex-direction: row;
      }
      .array-control button {
        font-size: 0.8em;
        width: 28px !important;
        height: 28px !important;
        padding: 4px !important;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrispyMatFormArrayComponent implements OnInit {
  @Input({ required: false }) label!: string;
  @Input({ required: true }) group!: FormGroup;
  @Input({ required: true }) fieldName!: string;
  @Input({ required: true }) crispy!: CrispyForm;
  @Input({ required: false }) initial!: Array<any>;

  @Output() formGroupAdded = new EventEmitter<{
    field: string;
    form: FormGroup;
  }>();
  @Output() formGroupRemoved = new EventEmitter<{
    field: string;
    form: FormGroup;
  }>();

  control!: FormArray;
  crispies: CrispyForm[] = [];
  addRowLabel!: Observable<string>;

  constructor(private cdr: ChangeDetectorRef,private injector: Injector) {}

  ngOnInit() {
    const crispyConfig = this.injector.get(CRISPY_FORMS_CONFIG_PROVIDER);
    if (crispyConfig && crispyConfig?.groupArrayConfig?.addRowText) {
      if (crispyConfig?.groupArrayConfig?.addRowText instanceof Observable) {
        this.addRowLabel = crispyConfig.groupArrayConfig.addRowText;
      } else {
        this.addRowLabel = of(crispyConfig.groupArrayConfig.addRowText);
      }
    } else {
      this.addRowLabel = of('Add Row');
    }
    this.control = this.group.controls[this.fieldName] as FormArray;
    // Don't add the row directly or else you will get
    // ExpressionChangedAfterItHasBeenCheckedError. Add it via a timeout so
    // that the natural change detect algo (that happens after the
    // timer routine) picks it up. This will avoid the error as well.
    // Adding rows when user clicks the 'Add Row' button is okay as the change
    // detect algo loop is run after every user input.
    setTimeout(() => {
      if (this.initial && Array.isArray(this.initial)) {
        this.initial.forEach(values => {
          this.addRow(values, true);
        });
      }
      this.addRow(undefined, true);
    });
  }

  addRow(initial: any, emit = true) {
    const crispy: CrispyForm = {
      ...this.crispy,
      form: getFormGroup(this.crispy.fields.map((f) => f.field)),
    };
    // set initial value if it was provided
    if (initial) {
      for (const key in initial) {
        if (crispy.form.controls[key] && initial[key] !== undefined) {
          crispy.form.controls[key].setValue(initial[key]);
        }
      }
    }
    this.control.push(crispy.form);
    this.crispies.push(crispy);
    if (emit) {
      this.formGroupAdded.emit({ field: this.fieldName, form: crispy.form });
    }
    this.cdr.markForCheck();
  }

  delRow(index: number) {
    if (index < this.crispies.length) {
      this.control.removeAt(index);
      const crispy = this.crispies.splice(index, 1);
      this.formGroupRemoved.emit({ field: this.fieldName, form: crispy[0].form });
      this.cdr.markForCheck();
    }
  }
}
