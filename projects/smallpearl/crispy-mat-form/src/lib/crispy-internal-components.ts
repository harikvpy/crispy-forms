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
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
  forwardRef
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR,
  UntypedFormGroup,
} from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { Observable, of } from 'rxjs';
import {
  CrispyField,
  CrispyForm,
  CustomControlOptions,
  DateRangeOptions,
  SelectOption,
  SelectOptions,
  TemplateControlOptions,
} from './crispy-types';
import { CrispyFieldNameDirective } from './field-name.directive';

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
  selector: 'app-crispy-field-select',
  template: `
    <mat-form-field
      [class]="field.cssClass ?? (crispy.fieldCssClass ?? '')"
      [formGroup]="crispy.form"
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
    const option = this?.field?.options as SelectOptions;
    if (Array.isArray(option.options)) {
      return of(option.options || []);
    } else if (option.options instanceof Observable) {
      return option.options;
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
          [formControlName]="
            options.beginRangeFormControlName || ''
          "
          [placeholder]="options.beginRangeLabel ?? 'Start'"
        />
        <input
          matEndDate
          [formControlName]="
            options.endRangeFormControlName || ''
          "
          [placeholder]="options.endRangeLabel ?? 'End'"
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
  @Input() field!: CrispyField;
  options!: DateRangeOptions;

  constructor() {}

  ngOnInit() {
    this.options = this.field.options as DateRangeOptions;
  }

  get rangeFormGroup() {
    return this.crispy.form.controls[
      this.field.name
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
        [formControlName]="field.name"
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
  @Input() field!: CrispyField;
  constructor() {}
  ngOnInit() {}
}

@Component({
  selector: 'app-crispy-field-checkbox',
  template: `
    <span [formGroup]="crispy.form">
      <mat-checkbox
        [class]="field.cssClass ?? (crispy.fieldCssClass ?? '')"
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
  @Input() field!: CrispyField;

  options!: CustomControlOptions;

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
    this.options = this.field.options as CustomControlOptions;
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
  selector: 'app-crispy-field-template',
  template: `
    <div [class]="'' + field.cssClass || crispy.fieldCssClass">
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
  options!: TemplateControlOptions;

  @ViewChild(CrispyDynamicControlDirective, { static: true })
  componentLocation!: CrispyDynamicControlDirective;

  constructor() {}

  ngOnInit() {
    this.options = this.field.options as TemplateControlOptions;
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
  selector: 'crispy-render-field',
  template: `
      <app-crispy-field-input
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
      ></app-crispy-field-input>
      <app-crispy-field-select
        *ngIf="field.type == 'select'"
        [crispy]="crispy"
        [field]="field"
      ></app-crispy-field-select>
      <app-crispy-field-daterange
        *ngIf="field.type == 'daterange'"
        [crispy]="crispy"
        [field]="field"
      ></app-crispy-field-daterange>
      <app-crispy-field-date
        *ngIf="field.type == 'date'"
        [crispy]="crispy"
        [field]="field"
      ></app-crispy-field-date>
      <app-crispy-field-checkbox
        *ngIf="field.type == 'checkbox'"
        [crispy]="crispy"
        [field]="field"
      ></app-crispy-field-checkbox>
      <ng-container *ngIf="field.type == 'custom'" [formGroup]="crispy.form">
        <app-crispy-field-custom
          [crispy]="crispy"
          [formControlName]="field.name"
          [field]="field"
        ></app-crispy-field-custom>
      </ng-container>
      <ng-container *ngIf="field.type === 'group'">
        <crispy-mat-form
          [crispy]="getChildrenAsCrispyForm(crispy, field.name)"
        ></crispy-mat-form>
      </ng-container>
      <app-crispy-mat-form-array
        *ngIf="field.type === 'groupArray'"
        [label]="field.label ?? ''"
        [group]="crispy.form"
        [initial]="field.initial"
        [fieldName]="field.name"
        [crispy]="getChildrenAsCrispyForm(crispy, field.name)"
        (formGroupAdded)="formGroupAdded.emit($event)"
        (formGroupRemoved)="formGroupRemoved.emit($event)"
      ></app-crispy-mat-form-array>
      <app-crispy-field-template
        *ngIf="field.type == 'template'"
        [crispy]="crispy"
        [field]="field"
      ></app-crispy-field-template>  
  `
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

  constructor() {}

  ngOnInit() { }

  getChildrenAsCrispyForm(crispy: CrispyForm, fieldName: string): CrispyForm {
    const field: CrispyField|undefined = crispy.fields.find(
      (cf) => cf.name == fieldName
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
}


@Component({
  selector: 'crispy-div',
  template: `
  <div [class]="field.cssClass ?? 'w-100'">
    <ng-container *ngFor="let child of field.children">
      <crispy-render-field
        [crispy]="crispy"
        [field]="field"
      ></crispy-render-field>
    </ng-container>
  </div> `,
  styles: `
  .w-100 { width: 100% !important }
  `
})
export class CrispyDivComponent implements OnInit {
  @Input({ required: true }) crispy!: CrispyForm;
  @Input({ required: true }) field!: CrispyField;

  constructor() {}

  ngOnInit() {}
}


@Component({
  selector: 'crispy-row',
  template: `
  <div [class]="'row ' + field.cssClass ? field.cssClass : ''">
    <ng-container *ngFor="let child of field.children">
      <crispy-render-field
        [crispy]="crispy"
        [field]="field"
      ></crispy-render-field>
    </ng-container>
  </div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrispyRowComponent implements OnInit {
  @Input({ required: true }) crispy!: CrispyForm;
  @Input({ required: true }) field!: CrispyField;

  constructor() {}

  ngOnInit() {}
}
