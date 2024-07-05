import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild
} from '@angular/core';
import {
  FormGroup
} from '@angular/forms';
import { CrispyDivComponent } from './crispy-internal-components';
import { buildCrispy } from './crispy-mat-form-helper';
import { CrispyField, CrispyForm } from './crispy-types';
import { CrispyFieldNameDirective } from './field-name.directive';
import { CRISPY_FORMS_CONFIG_PROVIDER, CrispyFormsConfig } from './providers';
import { DEFAULT_CRISPY_CONFIG, DEFAULT_LABEL_FN } from './config';

/**
 * `<crispy-mat-form>` is a component that makes creating & rendering angular
 * material forms a breeze. The component layers on top of angular's reactive
 * forms to create the required form fields and then layout them in a 
 * standardized way such that application code only has to declare the fields
 * of the form in an array and pass this array to the component as a property.
 * 
 * To illustrate with an example:
 * 
 * `<crispy-mat-form [fields]="fields"> </crispy-mat-form>`
 * 
 * where `fields` is defined as:
 * 
 * ```
 *   @ViewChild(CrispyFormComponent) crispyForm: CrispyFormComponent;
 *   ...
 *   ...
 *   ngOnInit() {
 *     this.fields = [
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
 *    fields: CrispyField[];
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
    <crispy-div
      [crispy]="crispy"
      [field]="crispy.field"
      (formGroupAdded)="formGroupAdded.emit($event)"
      (formGroupRemoved)="formGroupRemoved.emit($event)"
    ></crispy-div>
    <!-- <span *ngFor="let f of crispy.fields">
      <crispy-render-field
      [crispy]="crispy"
      [field]="f"
      ></crispy-render-field>
    </span> -->
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrispyMatFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ContentChildren(CrispyFieldNameDirective)
  fieldTemplates!: QueryList<CrispyFieldNameDirective>;

  /**
   * @deprecated
   */
  @Input({ required: false }) fields!: CrispyField[];

  @Input({ required: false }) crispy!: CrispyForm;
  @Input({ required: false }) cssClass!: string;

  @Output() formGroupAdded = new EventEmitter<{
    field: string;
    form: FormGroup;
  }>();
  @Output() formGroupRemoved = new EventEmitter<{
    field: string;
    form: FormGroup;
  }>();

  @ViewChild(CrispyDivComponent) wrapperDiv!: CrispyDivComponent;

  constructor(private injector: Injector) {}

  ngOnInit(): void {
    if (this.fields && !this.crispy) {
      this.crispy = this.createCrispyFormFromFields(this.fields, this.cssClass);
    }
    this.initFieldLabels();
  }

  ngAfterViewInit(): void {
    // console.log(`CrispyMatFormComponent.ngOnInit - field[0].name: ${this.crispy.fields.at(0)?.name}`);  
  }

  ngOnDestroy(): void {}

  private initFieldLabels() {
    const crispyConfig = this.injector.get(CRISPY_FORMS_CONFIG_PROVIDER, DEFAULT_CRISPY_CONFIG);
    if (this.crispy && crispyConfig) {
      const labelFn: CrispyFormsConfig['labelFn'] = crispyConfig.labelFn
        ? crispyConfig.labelFn
        : DEFAULT_LABEL_FN;
      const setFieldLabel = (field: CrispyField) => {
        if (!field.label && field.name) {
          field.label = labelFn(field.name);
        }
        if (field.children) {
          field.children.forEach(child => {
            if (child.type !== 'group') {
              setFieldLabel(child);
            }
          });
        }
      }
      setFieldLabel(this.crispy.field);
    }
  }

  /**
   * @deprecated - Use `crispy` property to specify CrispyForm as input
   * instead of `fields`.
   *
   * Creates CrispyForm object from array of CrispyField objects passed
   * as @Input() fields.
   *
   * @returns CrispyForm
   */
  private createCrispyFormFromFields(
    fields: CrispyField[],
    defaultCssClass?: string
  ): CrispyForm {
    const config = this.injector.get(CRISPY_FORMS_CONFIG_PROVIDER, null);
    const labelFn = config && config.labelFn ? config.labelFn : (code: string) => code;
    if (!defaultCssClass) {
      defaultCssClass = config && config.defaultCssClass ? config.defaultCssClass : '';
    }
    return buildCrispy(fields);
  }
}
