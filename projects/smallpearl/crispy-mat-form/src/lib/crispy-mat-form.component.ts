import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  FormGroup
} from '@angular/forms';
import { CrispyBuilder } from './builder';
import { CrispyDivComponent, safeGetCrispyConfig } from './crispy-internal-components';
import { CrispyField, CrispyForm } from './crispy-types';
import { CrispyFieldNameDirective } from './field-name.directive';

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
    <crispy-mat-form-impl
    [crispy]="crispy"
    ></crispy-mat-form-impl>
    <!-- <crispy-div
      [crispy]="crispy"
      [field]="crispy.field"
      (formGroupAdded)="formGroupAdded.emit($event)"
      (formGroupRemoved)="formGroupRemoved.emit($event)"
    ></crispy-div> -->
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrispyMatFormComponent implements OnInit, OnChanges {
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

  constructor(private injector: Injector, private builder: CrispyBuilder) {}

  ngOnInit(): void {
    if (this.fields && !this.crispy) {
      this.crispy = this.createCrispyFormFromFields(this.fields);
    }
    // this.initFieldStrings();
  }

  // We should move away from this and to signals API
  ngOnChanges(changes: SimpleChanges): void {
    if ('crispy' in changes) {
      this.initFieldStrings();
    }
  }

  /**
   * If CrispyFormsConfig.translateStrings is set to true, call the
   * user provided translation function with the field's label and hint (if
   * specified) and set the return value as the label & hint respectively.
   */
  private initFieldStrings() {
    const crispyConfig = safeGetCrispyConfig(this.injector);
    if (this.crispy) {
      // const labelFn = crispyConfig.translateFn!;
      // A recursive function that calls itself for each child CrispyField.
      const setFieldLabel = (field: CrispyField) => {
        if (!field.label && field.name) {
          // Set field's name as its label
          field.label = field.name;
        }
        if (crispyConfig.translateFn) {
          const translateFn = crispyConfig.translateFn;
          if (field.label) {
            field.label = translateFn(field.label!);
          }
          if (field.hint) {
            field.hint = translateFn(field.hint);
          }
        }

        if (field.children) {
          field.children.forEach(child => {
            setFieldLabel(child);
          });
        }
      }
      setFieldLabel(this.crispy.field);
    }
  }

  /**
   * @deprecated - Use `crispy` property to specify CrispyForm as input
   * instead of the `fields` property.
   *
   * Creates CrispyForm object from array of CrispyField objects passed
   * as @Input() fields.
   *
   * @returns CrispyForm
   */
  private createCrispyFormFromFields(fields: CrispyField[]): CrispyForm {
    return this.builder.build(fields);
  }
}
