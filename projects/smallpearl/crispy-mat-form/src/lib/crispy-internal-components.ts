import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentRef, Directive, ElementRef, Input, OnInit, ViewChild, ViewContainerRef, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormGroup } from "@angular/forms";
import { MatFormField } from "@angular/material/form-field";
import { Observable, of } from "rxjs";
import { CrispyFieldNameDirective } from "./crispy-mat-form.component";
import { CrispyFieldProps, CrispyForm, SelectOption } from "./crispy-types";

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
        [formControlName]="field.formControlName"
        [controlErrorAnchor]="errorAnchor"
      />
      <!-- number type has to specified as a literal during initial declaration. Or else input treats it like a
      string and the value returned will be a string. -->
      <input
        *ngIf="field.type == 'number'"
        type="number"
        matInput
        placeholder="{{ field.label }}"
        [formControlName]="field.formControlName"
        [controlErrorAnchor]="errorAnchor"
      />
      <textarea
        *ngIf="field.type == 'textarea'"
        matInput
        placeholder="{{ field.label }}"
        [formControlName]="field.formControlName"
        [controlErrorAnchor]="errorAnchor"
      ></textarea>
      <mat-error><ng-template controlErrorAnchor #errorAnchor="controlErrorAnchor"></ng-template></mat-error>
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
      <mat-select
        [formControlName]="field.formControlName"
        [controlErrorAnchor]="errorAnchor"
      >
        <mat-option
          *ngFor="let option of options | async"
          [value]="option.value"
          >{{ option.label }}</mat-option
        >
      </mat-select>
      <mat-error><ng-template controlErrorAnchor #errorAnchor="controlErrorAnchor"></ng-template></mat-error>
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

@Component({
  selector: 'app-crispy-field-template',
  template: `
  <div [class]="field.cssClass ?? (crispy.fieldCssClass ?? '')">
    <ng-template crispyDynamicControl></ng-template>
  </div>
  `,
  styles: [`
    div {
      display: inline-flex;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrispyTemplateFieldComponent implements OnInit
{
  @Input() crispy!: CrispyForm;
  @Input() field!: CrispyFieldProps;

  @ViewChild(CrispyDynamicControlDirective, { static: true })
  componentLocation!: CrispyDynamicControlDirective;

  constructor() {}

  ngOnInit() {
    this.loadTemplate();
  }

  private loadTemplate() {
    const fnd = CrispyFieldNameDirective._crispyFieldTemplates.find(
      (ft) => ft.crispyFieldName.localeCompare(this.field.formControlName) == 0
    );
    const templateRef = fnd ? fnd.templateRef : undefined;
    if (templateRef) {
      const context = {
        crispy: this.crispy,
        field: this.field,
        control: this.crispy.form.controls[this.field.formControlName],
        formGroup: this.crispy.form
      }
      const view = this.componentLocation.viewContainerRef.createEmbeddedView(
        templateRef,
        context
      );
    }
  }
}
