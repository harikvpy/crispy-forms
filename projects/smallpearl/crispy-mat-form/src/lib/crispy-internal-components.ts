import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
  forwardRef
} from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  UntypedFormGroup
} from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { Observable, of } from 'rxjs';
import { CrispyDiv } from './crispy-mat-form-helper';
import {
  CrispyField,
  CrispyFieldType,
  CrispyForm,
  CustomComponentOptions,
  DateRangeOptions,
  SelectOption,
  TemplateComponentOptions,
} from './crispy-types';
import { CrispyFieldNameDirective } from './field-name.directive';
import { CRISPY_FORMS_CONFIG_PROVIDER, CrispyFormsConfig } from './providers';
import { DEFAULT_CRISPY_CONFIG } from './config';


export function safeGetCrispyConfig(injector: Injector): CrispyFormsConfig {
  // return empty config object if one was not provided by client.
  const crispyConfig = injector.get(CRISPY_FORMS_CONFIG_PROVIDER, {});
  return {
    ...DEFAULT_CRISPY_CONFIG,
    ...crispyConfig
  }
}

/**
 * Core of the crispy-forms library. This recursively iterates through the
 * CrispyFields (and its children) and creates the relevant AbstractControl
 * specialization for the field and adds them to the FormGroup object in
 * argument 2.
 * 
 * @param cfs Fields to be processed
 * @param fg FormGroup to which AbstractControl specialization is to be added.
 * @returns FormGroup object passed in arg 2.
 */
export function buildFormGroup(
  cfs: CrispyField[],
  fg: FormGroup,
  rowCssClass: string,
  colCssClass: string,
  numberOfColsPerRow: number,
  colDivCssClassTemplate: string
): FormGroup {
  const colClass = colDivCssClassTemplate;
  const COLUMN_CSS_CLASS = (width: number): string => {
    return colClass.replace('{width}', `${width}`);
  };
  cfs.forEach((cf) => {
    if (cf.type === 'row') {
      // All the children of this row should be distributed equally in the
      // row. Use 12 columns/# of children to get the width of each column.
      if (cf.children) {
        const colWidth = Math.floor(12 / cf.children.length);
        const lastColWidth = colWidth + (12 - cf.children.length * colWidth);
        const colWidths: string[] = [];
        for (let index = 0; index < cf.children.length - 1; index++) {
          colWidths.push(COLUMN_CSS_CLASS(colWidth));
        }
        colWidths.push(COLUMN_CSS_CLASS(lastColWidth));
        buildFormGroup(cf.children, fg, rowCssClass, colCssClass, numberOfColsPerRow, colDivCssClassTemplate);
        cf.children.forEach((field: CrispyField, index: number) => {
          field.cssClass = field.cssClass ? field.cssClass : (colCssClass + ' ' + colWidths[index]);
        });
      }
    } else if (cf.type === 'div') {
      if (cf.children) {
        buildFormGroup(cf.children, fg, rowCssClass, colCssClass, numberOfColsPerRow, colDivCssClassTemplate);
      }
    } else {
      if (cf.type === 'group') {
        if (cf.children) {
          const subFg = new FormGroup({}, cf.validators);
          fg.addControl(
            cf.name,
            buildFormGroup(cf.children, subFg, rowCssClass, colCssClass, numberOfColsPerRow, colDivCssClassTemplate)
          );
        }
      } else if (cf.type === 'groupArray') {
        const fa = new FormArray<FormGroup>([], cf.validators);
        fg.addControl(cf.name, fa);
      } else {
        fg.addControl(cf.name, getFormControl(cf));
      }
    }
  });
  return fg;
}

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

function getFormControl(cf: CrispyField) {
  const keys = Object.keys(cf);
  const hasInitial =
    keys.find((k) => k.localeCompare('initial') == 0 && !!(cf as any)[k]) != undefined;
  if (cf.type === 'daterange') {
    // Special handler for 'daterange' field type
    const options: DateRangeOptions = cf.options?.dateRangeOptions!;
    const group = new FormGroup({}, cf.validators);
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

@Component({
  selector: 'crispy-field-input',
  template: `
    <mat-form-field
      class="w-100"
      [formGroup]="crispy.form"
      [subscriptSizing]="field.formFieldOptions?.subscriptSizing"
    >
      <mat-label>{{ field.label }}</mat-label>
      <mat-hint *ngIf="field.hint">{{ field.hint }}</mat-hint>
      <input
        *ngIf="field.type != 'textarea' && field.type != 'number'"
        [type]="field.type"
        matInput
        placeholder="{{ field.label }}"
        [formControlName]="field.name"
        [controlErrorAnchor]="errorAnchor"
      />
      <!-- number type has to specified as a literal during initial declaration. Or else input treats it like a
      string and the value returned will be a string. -->
      <input
        *ngIf="field.type == 'number'"
        type="number"
        matInput
        placeholder="{{ field.label }}"
        [formControlName]="field.name"
        [controlErrorAnchor]="errorAnchor"
      />
      <textarea
        *ngIf="field.type == 'textarea'"
        matInput
        placeholder="{{ field.label }}"
        [formControlName]="field.name"
        [controlErrorAnchor]="errorAnchor"
      ></textarea>
      <mat-error
        ><ng-template
          controlErrorAnchor
          #errorAnchor="controlErrorAnchor"
        ></ng-template
      ></mat-error>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrispyInputFieldTypeComponent implements OnInit {
  @Input() crispy!: CrispyForm;
  @Input() field!: CrispyField;
  constructor() {}
  ngOnInit() {}
}

@Component({
  selector: 'crispy-field-select',
  template: `
    <mat-form-field
      class="w-100"
      [formGroup]="crispy.form"
      [subscriptSizing]="field.formFieldOptions?.subscriptSizing"
    >
      <mat-label>{{ field.label }}</mat-label>
      <mat-hint *ngIf="field.hint">{{ field.hint }}</mat-hint>
      <mat-select
        [formControlName]="field.name"
        [controlErrorAnchor]="errorAnchor"
      >
        <mat-option
          *ngFor="let option of options | async"
          [value]="option.value"
          >{{ option.label }}</mat-option
        >
      </mat-select>
      <mat-error
        ><ng-template
          controlErrorAnchor
          #errorAnchor="controlErrorAnchor"
        ></ng-template
      ></mat-error>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrispySelectFieldComponent implements OnInit {
  @Input() crispy!: CrispyForm;
  @Input() field!: CrispyField;
  constructor() {}
  ngOnInit() {}

  get options(): Observable<SelectOption[]> {
    const option = this?.field?.options?.selectOptions!;
    if (Array.isArray(option.options)) {
      return of(option.options || []);
    } else if (option.options instanceof Observable) {
      return option.options;
    }
    return of([]);
  }
}

@Component({
  selector: 'crispy-field-daterange',
  template: `
    <mat-form-field
      class="w-100"
      [formGroup]="crispy.form"
      [subscriptSizing]="field.formFieldOptions?.subscriptSizing"
    >
      <mat-label>{{ field.label }}</mat-label>
      <mat-date-range-input
        [formGroup]="rangeFormGroup"
        [rangePicker]="picker"
        [controlErrorAnchor]="errorAnchor"
      >
        <input
          matStartDate
          [formControlName]="options.beginRangeFormControlName || ''"
          [placeholder]="options.beginRangeLabel ?? 'Start'"
        />
        <input
          matEndDate
          [formControlName]="options.endRangeFormControlName || ''"
          [placeholder]="options.endRangeLabel ?? 'End'"
        />
      </mat-date-range-input>
      <mat-hint *ngIf="field.hint">{{ field.hint }}</mat-hint>
      <mat-datepicker-toggle
        matIconSuffix
        [for]="picker"
      ></mat-datepicker-toggle>
      <mat-date-range-picker #picker></mat-date-range-picker>
      <mat-error
        ><ng-template
          controlErrorAnchor
          #errorAnchor="controlErrorAnchor"
        ></ng-template
      ></mat-error>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrispyDateRangeFieldComponent implements OnInit {
  @Input() crispy!: CrispyForm;
  @Input() field!: CrispyField;
  options!: DateRangeOptions;

  constructor() {}

  ngOnInit() {
    this.options = this.field.options?.dateRangeOptions!;
  }

  get rangeFormGroup() {
    return this.crispy.form.controls[
      this.field.name
    ] as UntypedFormGroup;
  }
}

@Component({
  selector: 'crispy-field-date',
  template: `
    <mat-form-field
      class="w-100"
      [formGroup]="crispy.form"
      [subscriptSizing]="field.formFieldOptions?.subscriptSizing"
    >
      <mat-label>{{ field.label }}</mat-label>
      <input
        matInput
        [formControlName]="field.name"
        [matDatepicker]="picker"
        [controlErrorAnchor]="errorAnchor"
      />
      <mat-datepicker-toggle
        matIconSuffix
        [for]="picker"
      ></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
      <mat-hint *ngIf="field.hint">{{ field.hint }}</mat-hint>
      <mat-error
        ><ng-template
          controlErrorAnchor
          #errorAnchor="controlErrorAnchor"
        ></ng-template
      ></mat-error>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrispyDateFieldComponent implements OnInit {
  @Input() crispy!: CrispyForm;
  @Input() field!: CrispyField;
  constructor() {}
  ngOnInit() {}
}

@Component({
  selector: 'crispy-field-checkbox',
  template: `
    <span [formGroup]="crispy.form">
      <mat-checkbox
        [class]="field.cssClass ?? ''"
        [formControlName]="field.name"
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
  @Input() field!: CrispyField;
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
  selector: 'crispy-field-custom',
  template: `
    <mat-form-field
      #matFormField
      class="w-100"
      [formGroup]="crispy.form"
      [subscriptSizing]="field.formFieldOptions?.subscriptSizing"
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
  @Input() field!: CrispyField;

  options!: CustomComponentOptions;

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
    this.options = this.field.options?.customComponentOptions!;
    if (this.componentLocation) {
      // TODO: Howe can we specify that the component returend by createComponent
      // implements FormFieldControl interface?
      this.component =
        this.componentLocation.viewContainerRef.createComponent<any>(
          this.options.component
        );
      const input = this._elementRef.nativeElement.querySelector('input');
      input.remove();
      if (this.matFormField) {
        // We're assuming that the component is an instance of MatFormField
        this.matFormField._control = this.component.instance;
        this.component.instance.ngControl =
          this.crispy.form.controls[this.field.name];
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

@Component({
  selector: 'crispy-field-template',
  template: `
    <div [class]="'w-100 ' + field.cssClass || ''">
      <ng-template crispyDynamicControl></ng-template>
    </div>
  `,
  styles: [
    `
      div {
        display: inline-flex;
        flex-direction: column;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrispyTemplateFieldComponent implements OnInit {
  @Input() crispy!: CrispyForm;
  @Input() field!: CrispyField;
  options!: TemplateComponentOptions;

  @ViewChild(CrispyDynamicControlDirective, { static: true })
  componentLocation!: CrispyDynamicControlDirective;

  constructor() {}

  ngOnInit() {
    this.options = this.field.options?.templateComponentOptions!
    this.loadTemplate();
  }

  private loadTemplate() {
    const fnd = CrispyFieldNameDirective._crispyFieldTemplates.find(
      (ft) => ft.crispyFieldName.localeCompare(this.field.name) == 0
    );
    const templateRef = fnd ? fnd.templateRef : undefined;
    if (templateRef) {
      const userContext = this.options?.context ?? {};
      // console.log(`CrispyTemplateFieldComponent - userContext: ${JSON.stringify(userContext)}`);
      const context = {
        ...userContext,
        crispy: this.crispy,
        field: this.field,
        control: this.crispy.form.controls[this.field.name],
        formGroup: this.crispy.form,
      };
      const view = this.componentLocation.viewContainerRef.createEmbeddedView(
        templateRef,
        context
      );
    }
  }
}


@Component({
  selector: 'crispy-div',
  template: `
  <div [class]="field.cssClass ?? 'w-100'">
    <ng-container *ngFor="let child of field.children">
      <crispy-render-field
        [crispy]="crispy"
        [field]="child"
        [class]="child.cssClass ? child.cssClass : 'row'"
        (formGroupAdded)="formGroupAdded.emit($event)"
        (formGroupRemoved)="formGroupRemoved.emit($event)"
      ></crispy-render-field>
    </ng-container>
  </div> `,
  styles: `
  .w-100 { width: 100% !important }
  `,
})
export class CrispyDivComponent implements OnInit {
  @Input({ required: true }) crispy!: CrispyForm;
  @Input({ required: true }) field!: CrispyField;

  @Output() formGroupAdded = new EventEmitter<{
    field: string;
    form: FormGroup;
  }>();
  @Output() formGroupRemoved = new EventEmitter<{
    field: string;
    form: FormGroup;
  }>();

  constructor() {}

  ngOnInit() {}
}


@Component({
  selector: 'crispy-row',
  template: `
  <div [class]="field.cssClass ? field.cssClass : rowCssClass">
    <ng-container *ngFor="let child of field.children">
      <crispy-render-field
        [crispy]="crispy"
        [field]="child"
        [class]="child.cssClass ?? ''"
      ></crispy-render-field>
    </ng-container>
  </div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrispyRowComponent implements OnInit {
  @Input({ required: true }) crispy!: CrispyForm;
  @Input({ required: true }) field!: CrispyField;

  rowCssClass: string = 'row';
  constructor(injector: Injector) {
    this.rowCssClass = safeGetCrispyConfig(injector).defaultRowCssClass!;
  }

  ngOnInit() {}
}


/**
 * A component to render an array of crispy forms. This can come handy in
 * uses cases such as Invoice -> Line Items. Essentially this component would
 * take a CrispyForm object as input and build a FormArray consisting of many
 * instances of this object. 
 */
@Component({
  selector: 'crispy-form-array',
  template: `
    <div class="crispy-form-array-wrapper" [formGroup]="group">
      <div class="form-array-label">{{ label }}</div>
      <div
        class="form-array-wrapper"
        *ngFor="let crispy of crispies; let i = index"
      >
        <div class="form-array">
          <crispy-mat-form-impl [crispy]="crispy"></crispy-mat-form-impl>
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
      .crispy-form-array-wrapper {
        margin: 0.5em 0;
        /*
        border: 1px solid lightgrey;
        border-radius: 4px;
        padding: 0.5em;
        */
      }
      .form-array-wrapper {
        width: 100% !important;
        display: flex;
        flex-direction: row;
        padding: 0.25em 0;
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
export class CrispyFormArrayComponent implements OnInit {
  // This is the label for the form array element
  @Input({ required: false }) label!: string;
  @Input({ required: true }) group!: FormGroup;
  @Input({ required: true }) field!: CrispyField;
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

  constructor(private cdr: ChangeDetectorRef, private injector: Injector) {}

  ngOnInit() {
    const crispyConfig = safeGetCrispyConfig(this.injector);
    if (crispyConfig && crispyConfig?.groupArrayConfig?.addRowText) {
      if (crispyConfig?.groupArrayConfig?.addRowText instanceof Observable) {
        this.addRowLabel = crispyConfig.groupArrayConfig.addRowText;
      } else {
        this.addRowLabel = of(crispyConfig.groupArrayConfig.addRowText);
      }
    } else {
      this.addRowLabel = of('Add Row');
    }
    this.control = this.group.controls[this.field.name] as FormArray;
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
    const crispyConfig = safeGetCrispyConfig(this.injector);
    if (this.field.children) {
      const crispy: CrispyForm = {
        form: buildFormGroup(
          this.field.children!,
          new FormGroup({}, this.field.validators),
          crispyConfig.defaultRowCssClass!,
          crispyConfig.defaultColCssClass!,
          crispyConfig.numberOfColsPerRow!,
          crispyConfig.defaultColDivCssClassTemplate!
        ),
        field: Array.isArray(this.field.children) ? CrispyDiv('', this.field.children) : this.field.children
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
        this.formGroupAdded.emit({ field: this.field.name, form: crispy.form });
      }
      this.cdr.markForCheck();
    }
  }

  delRow(index: number) {
    if (index < this.crispies.length) {
      this.control.removeAt(index);
      const crispy = this.crispies.splice(index, 1);
      this.formGroupRemoved.emit({ field: this.field.name, form: crispy[0].form });
      this.cdr.markForCheck();
    }
  }
}

@Component({
  selector: 'crispy-render-field',
  template: `
    <crispy-row
      *ngIf="field.type == 'row'"
      [crispy]="crispy"
      [field]="field"
    ></crispy-row>
    <crispy-div
      *ngIf="field.type == 'div'"
      [crispy]="crispy"
      [field]="field"
    ></crispy-div>
    <crispy-field-input
      *ngIf="
        field.type == 'text' ||
        field.type == 'number' ||
        field.type == 'email' ||
        field.type == 'password' ||
        field.type == 'search' ||
        field.type == 'textarea'
      "
      [crispy]="crispy"
      [field]="field"
    ></crispy-field-input>
    <crispy-field-select
      *ngIf="field.type == 'select'"
      [crispy]="crispy"
      [field]="field"
    ></crispy-field-select>
    <crispy-field-daterange
      *ngIf="field.type == 'daterange'"
      [crispy]="crispy"
      [field]="field"
    ></crispy-field-daterange>
    <crispy-field-date
      *ngIf="field.type == 'date'"
      [crispy]="crispy"
      [field]="field"
    ></crispy-field-date>
    <crispy-field-checkbox
      *ngIf="field.type == 'checkbox'"
      [crispy]="crispy"
      [field]="field"
    ></crispy-field-checkbox>
    <ng-container *ngIf="field.type == 'custom'" [formGroup]="crispy.form">
      <crispy-field-custom
        [crispy]="crispy"
        [formControlName]="field.name"
        [field]="field"
      ></crispy-field-custom>
    </ng-container>
    <ng-container *ngIf="field.type === 'group'">
      <crispy-mat-form-impl [crispy]="groupCrispy"></crispy-mat-form-impl>
    </ng-container>
    <crispy-form-array
      *ngIf="field.type === 'groupArray'"
      [label]="field.label ?? ''"
      [group]="crispy.form"
      [initial]="field.initial"
      [field]="field"
      [crispy]="crispy"
      (formGroupAdded)="formGroupAdded.emit($event)"
      (formGroupRemoved)="formGroupRemoved.emit($event)"
    ></crispy-form-array>
    <crispy-field-template
      *ngIf="field.type == 'template'"
      [crispy]="crispy"
      [field]="field"
    ></crispy-field-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrispyRenderFieldComponent implements OnInit {
  @Input({ required: true }) crispy!: CrispyForm;
  @Input({ required: true }) field!: CrispyField;

  @Output() formGroupAdded = new EventEmitter<{
    field: string;
    form: FormGroup;
  }>();
  @Output() formGroupRemoved = new EventEmitter<{
    field: string;
    form: FormGroup;
  }>();

  private _tempForm = new FormGroup({});
  groupCrispy!: CrispyForm;

  constructor() {}

  ngOnInit() {
    if (this.field.type === 'group') {
      this.groupCrispy = {
        form: this.crispy.form.controls[this.field.name] as FormGroup,
        field: CrispyDiv('', this.field.children ?? []),
      };
    }
  }

  get form(): FormGroup<any> {
    return this.crispy ? this.crispy.form : this._tempForm;
  }
}

@Component({
  selector: 'crispy-mat-form-impl',
  template: `
    <crispy-div
      [crispy]="crispy"
      [field]="crispy.field"
      (formGroupAdded)="formGroupAdded.emit($event)"
      (formGroupRemoved)="formGroupRemoved.emit($event)"
    ></crispy-div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrispyMatFormImplComponent implements OnInit {
  @Input({ required: true }) crispy!: CrispyForm;
  @Output() formGroupAdded = new EventEmitter<{
    field: string;
    form: FormGroup;
  }>();
  @Output() formGroupRemoved = new EventEmitter<{
    field: string;
    form: FormGroup;
  }>();

  constructor() {}

  ngOnInit() {}
}
