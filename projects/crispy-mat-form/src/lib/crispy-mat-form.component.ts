import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ContentChildren,
  Directive,
  ElementRef,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR,
  UntypedFormGroup,
} from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { Observable, of } from 'rxjs';
import { CrispyFormField, getCrispyFormHelper } from './crispy-mat-form-helper';
import { CrispyFieldProps, CrispyForm, SelectOption } from './crispy-types';
import { CRISPY_FORMS_CONFIG_PROVIDER } from './providers';

@Directive({
  selector: 'ng-template.[crispyFieldName]',
})
export class CrispyFieldNameDirective implements OnInit, OnDestroy {
  static _crispyFieldTemplates: Array<CrispyFieldNameDirective> = [];

  @Input()
  crispyFieldName!: string;

  constructor(public templateRef: TemplateRef<any>) {}

  ngOnInit(): void {
    CrispyFieldNameDirective._crispyFieldTemplates.push(this);
    // console.log(`CrispyFieldNameDirective.ngOnInit - field: ${this.crispyFieldName},_crispyFieldTemplates.length: ${CrispyFieldNameDirective._crispyFieldTemplates.length}`);
  }

  ngOnDestroy(): void {
    const index = CrispyFieldNameDirective._crispyFieldTemplates.findIndex(
      (f) => f.crispyFieldName.localeCompare(this.crispyFieldName) == 0,
      1
    );
    // console.log(`CrispyFieldNameDirective.ngOnDestroy(bf) - field: ${this.crispyFieldName}, _crispyFieldTemplates.length: ${CrispyFieldNameDirective._crispyFieldTemplates.length}, index: ${index}`);
    if (index !== -1) {
      CrispyFieldNameDirective._crispyFieldTemplates.splice(index, 1);
      // console.log(`CrispyFieldNameDirective.ngOnDestroy(af) - field: ${this.crispyFieldName}, _crispyFieldTemplates.length: ${CrispyFieldNameDirective._crispyFieldTemplates.length}`);
    }
  }
}

@Component({
  selector: 'app-crispy-field-input',
  template: `
    <mat-form-field
      [class]="field.cssClass ?? (crispy.fieldCssClass ?? '')"
      [formGroup]="crispy.form"
    >
      <mat-label>{{ field.label }}</mat-label>
      <mat-hint *ngIf="field.hint">{{ field.hint }}</mat-hint>
      <input
        *ngIf="field.type != 'textarea'"
        [type]="field.type"
        matInput
        placeholder="{{ field.label }}"
        [formControlName]="field.formControlName"
      />
      <textarea
        *ngIf="field.type == 'textarea'"
        matInput
        placeholder="{{ field.label }}"
        [formControlName]="field.formControlName"
      ></textarea>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrispyInputFieldTypeComponent implements OnInit {
  @Input() crispy!: CrispyForm;
  @Input() field!: CrispyFieldProps;
  constructor() {}
  ngOnInit() {}
}

@Component({
  selector: 'app-crispy-field-select',
  template: `
    <mat-form-field
      [class]="field.cssClass ?? (crispy.fieldCssClass ?? '')"
      [formGroup]="crispy.form"
    >
      <mat-label>{{ field.label }}</mat-label>
      <mat-hint *ngIf="field.hint">{{ field.hint }}</mat-hint>
      <mat-select [formControlName]="field.formControlName">
        <mat-option
          *ngFor="let option of options | async"
          [value]="option.value"
          >{{ option.label }}</mat-option
        >
      </mat-select>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrispySelectFieldComponent implements OnInit {
  @Input() crispy!: CrispyForm;
  @Input() field!: CrispyFieldProps;
  constructor() {}
  ngOnInit() {}

  get options(): Observable<SelectOption[]> {
    if (Array.isArray(this?.field?.selectOptions?.options)) {
      return of(this?.field?.selectOptions?.options || []);
    } else if (this?.field?.selectOptions?.options instanceof Observable) {
      return this.field.selectOptions.options;
    }
    return of([]);
  }
}

@Component({
  selector: 'app-crispy-field-daterange',
  template: `
    <mat-form-field
      [class]="field.cssClass ?? (crispy.fieldCssClass ?? '')"
      [formGroup]="crispy.form"
    >
      <mat-label>{{ field.label }}</mat-label>
      <mat-date-range-input [formGroup]="rangeFormGroup" [rangePicker]="picker">
        <input
          matStartDate
          [formControlName]="field.dateRangeOptions?.beginRangeFormControlName || ''"
          [placeholder]="field.dateRangeOptions?.beginRangeLabel ?? 'Start'"
        />
        <input
          matEndDate
          [formControlName]="field.dateRangeOptions?.endRangeFormControlName || ''"
          [placeholder]="field.dateRangeOptions?.endRangeLabel ?? 'End'"
        />
      </mat-date-range-input>
      <mat-hint *ngIf="field.hint">{{ field.hint }}</mat-hint>
      <mat-datepicker-toggle
        matIconSuffix
        [for]="picker"
      ></mat-datepicker-toggle>
      <mat-date-range-picker #picker></mat-date-range-picker>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrispyDateRangeFieldComponent implements OnInit {
  @Input() crispy!: CrispyForm;
  @Input() field!: CrispyFieldProps;
  constructor() {}
  ngOnInit() {}
  get rangeFormGroup() {
    return this.crispy.form.controls[
      this.field.formControlName
    ] as UntypedFormGroup;
  }
}

@Component({
  selector: 'app-crispy-field-date',
  template: `
    <mat-form-field
      [class]="field.cssClass ?? (crispy.fieldCssClass ?? '')"
      [formGroup]="crispy.form"
    >
      <mat-label>{{ field.label }}</mat-label>
      <input
        matInput
        [formControlName]="field.formControlName"
        [matDatepicker]="picker"
      />
      <mat-datepicker-toggle
        matIconSuffix
        [for]="picker"
      ></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
      <mat-hint *ngIf="field.hint">{{ field.hint }}</mat-hint>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrispyDateFieldComponent implements OnInit {
  @Input() crispy!: CrispyForm;
  @Input() field!: CrispyFieldProps;
  constructor() {}
  ngOnInit() {}
}

@Component({
  selector: 'app-crispy-field-checkbox',
  template: `
    <span [formGroup]="crispy.form">
      <mat-checkbox
        [class]="field.cssClass ?? (crispy.fieldCssClass ?? '')"
        [formControlName]="field.formControlName"
      >
        {{ field.label }}
        <small *ngIf="field.hint"><br />{{ field.hint }}</small>
      </mat-checkbox>
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrispyCheckboxComponent implements OnInit {
  @Input() crispy!: CrispyForm;
  @Input() field!: CrispyFieldProps;
  constructor() {}
  ngOnInit() {}
}

@Directive({
  selector: '[crispyDynamicControl]',
})
export class CrispyDynamicControlDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
  selector: 'app-crispy-field-custom',
  template: `
    <mat-form-field
      #matFormField
      [class]="field.cssClass ?? (crispy.fieldCssClass ?? '')"
      [formGroup]="crispy.form"
    >
      <mat-label>{{ field.label }}</mat-label>
      <mat-hint *ngIf="field.hint">{{ field.hint }}</mat-hint>
      <input matInput />
      <ng-template crispyDynamicControl></ng-template>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CrispyCustomFieldComponent),
      multi: true,
    },
  ],
})
export class CrispyCustomFieldComponent
  implements OnInit, AfterViewInit, AfterContentInit, ControlValueAccessor
{
  @Input() crispy!: CrispyForm;
  @Input() field!: CrispyFieldProps;

  @ViewChild(CrispyDynamicControlDirective, { static: true })
  componentLocation!: CrispyDynamicControlDirective;
  @ViewChild(MatFormField, { static: true }) matFormField!: MatFormField;

  private component!: ComponentRef<any>;
  instantiateControl = false;

  constructor(
    private _elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private vcr: ViewContainerRef
  ) {}

  ngOnInit() {
    if (this.componentLocation) {
      // TODO: Howe can we specify that the component returend by createComponent
      // implements FormFieldControl interface?
      this.component =
        this.componentLocation.viewContainerRef.createComponent<any>(
          this?.field?.customControlOptions?.component
        );
      const input = this._elementRef.nativeElement.querySelector('input');
      input.remove();
      if (this.matFormField) {
        // We're assuming that the component is an instance of MatFormField
        this.matFormField._control = this.component.instance;
        this.component.instance.ngControl =
          this.crispy.form.controls[this.field.formControlName];
      }
    }
  }

  ngAfterViewInit(): void {
    // this.instantiateControl = true;
    // this.cdr.detectChanges();
  }

  ngAfterContentInit(): void {}

  // ControlValueAccessor interface methods
  writeValue(value: string): void {
    if (this.component && this.component.instance) {
      this.component.instance.writeValue(value);
    }
  }
  registerOnChange(fn: any): void {
    // this._onChange = fn;
    if (this.component && this.component.instance) {
      this.component.instance.registerOnChange(fn);
    }
  }
  registerOnTouched(fn: any): void {
    // this._onTouched = fn;
    if (this.component && this.component.instance) {
      this.component.instance.registerOnTouched(fn);
    }
  }
  // End ControlValueAccessor methods
}

/**
 * `<app-crispy-form>` is a component that makes creating & rendering angular
 * material forms a breeze. The component layers on top the excellent reactive
 * forms to create the required form fields and then layout them in a standardized
 * way such that application code only has to declare the fields of the form in an
 * array and pass this array to the component as an input argument.
 * 
 * To illustrate with an example:
 * 
 * `<app-crispy-form [cffs]="cffs"> </app-crispy-form>`
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
 * This will create a form with two fields, `firstName` & `lastName` arranged side by side.
 * Note that in the example, the css classes used come from Bootstrap and it's these classes
 * that provide the side-by-side single-line layout in the form.
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
      <span *ngIf="f.type == 'custom'" [formGroup]="crispy.form">
        <app-crispy-field-custom
          [crispy]="crispy"
          [formControlName]="f.formControlName"
          [field]="f"
        ></app-crispy-field-custom>
      </span>
      <span *ngIf="f.type == 'group'">
        <crispy-mat-form
          [crispy]="getChildrenAsCrispyForm(crispy, f.formControlName)"
        ></crispy-mat-form>
      </span>
      <ng-container
        *ngIf="f.type == 'template'"
        [ngTemplateOutlet]="getFieldTemplate(f)"
      >
      </ng-container>
    </span>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrispyMatFormComponent implements OnInit, OnDestroy {
  @ContentChildren(CrispyFieldNameDirective)
  fieldTemplates!: QueryList<CrispyFieldNameDirective>;

  @Input() crispy!: CrispyForm;
  @Input() cffs!: CrispyFormField[];
  @Input() cssClass!: string;

  constructor(private injector: Injector) {}

  ngOnInit(): void {
    if (this.cffs && !this.crispy) {
      this.crispy = this.createCrispyFormFromFields(this.cffs, this.cssClass);
    }
  }

  ngOnDestroy(): void {}

  getFieldTemplate(field: CrispyFieldProps): TemplateRef<any> {
    const fnd = CrispyFieldNameDirective._crispyFieldTemplates.find(
      (ft) => ft.crispyFieldName.localeCompare(field.formControlName) == 0
    );
    // const fnd = this.fieldTemplates.find(ft => ft.crispyFieldName.localeCompare(field.formControlName) == 0);
    return fnd!.templateRef;
  }

  getChildrenAsCrispyForm(crispy: CrispyForm, fieldName: string): CrispyForm {
    const field: CrispyFieldProps|undefined = crispy.fields.find(
      (cf) => cf.formControlName == fieldName
    );
    return {
      form: crispy.form.controls[fieldName] as FormGroup,
      fields: field?.children || [],
      fieldCssClass: crispy.fieldCssClass,
    };
  }

  get form(): FormGroup|null {
    return this.crispy ? this.crispy.form : null;
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
