import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {
  CrispyFormField,
  CrispyMatFormComponent,
  crispyCheckboxField,
  crispyCustomComponentField,
  crispyDateRangeField,
  crispyFormGroup,
  crispyFormGroupArray,
  crispyNumberField,
  crispyPasswordField,
  crispySelectField,
  crispyTemplateField,
  crispyTextField,
} from '@smallpearl/crispy-mat-form';
import { BehaviorSubject, of, tap } from 'rxjs';
import { MyTelInput } from './components/my-tel-input/my-tel-input.component';

@Component({
  selector: 'app-root',
  template: `
    <h1>Crispy Form Demo</h1>
    <form [formGroup]="crispyComponent.form" (ngSubmit)="onSubmit()" errorTailor>
      <crispy-mat-form
        [cffs]="cffs"
        (formGroupAdded)="onFormGroupAdded($event)"
        (formGroupRemoved)="onFormGroupRemoved($event)"
      ></crispy-mat-form>
      <div>
        <button
          mat-raised-button
          color="primary"
          type="button"
          (click)="onReset()"
        >
          Reset</button
        >&nbsp;
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="crispyComponent.form.invalid"
        >
          Submit
        </button>
      </div>
    </form>

    <ng-template crispyFieldName="mobile" let-formGroup="formGroup">
      <span *ngIf="formGroup" [formGroup]="formGroup">
        <mat-form-field>
          <mat-label>My Telephone</mat-label>
          <my-tel-input formControlName="mobile"></my-tel-input>
        </mat-form-field>
      </span>
    </ng-template>

    <ng-template crispyFieldName="dummy" let-control="control" let-field="field" let-crispy="crispy" let-formGroup="formGroup">
        Members: <span *ngFor="let m of control.value">{{ m }}&nbsp;</span>
    </ng-template>

    <ng-template crispyFieldName="total" let-control="control" let-field="field" let-crispy="crispy" let-formGroup="formGroup">
      <div style="width: 100% !important; display: flex; justify-content: end; padding: 0.4em 1em;">
        <h2>Total: {{ total|async }}</h2>
      </div>
    </ng-template>

    <!-- <router-outlet></router-outlet> -->
  `,
  styles: [],
})
export class AppComponent implements OnInit, AfterViewInit {
  cffs!: CrispyFormField[];
  @ViewChild(CrispyMatFormComponent, { static: true })
  crispyComponent!: CrispyMatFormComponent;
  total = new BehaviorSubject<number>(0);
  constructor() {}

  ngOnInit(): void {
    /**
     * Check if the end date in date range is within this month. If not
     * set error state in the control. Otherwise, clear the error.
     * @param control
     * @returns
     */
    const endDateRangeValidator = (control: AbstractControl<any, any>) => {
      const endDate = new Date();
      endDate.setTime(Date.parse(control.value));
      if (endDate.getMonth() > new Date().getMonth()) {
        return { invalidDate: true };
      }
      return null;
    };
    /**
     * Compare the two password and if they don't match set error
     * on the confirmPassword control.
     * @param fg
     * @returns
     */
    const matchPasswords = (fg: FormGroup<any>): ValidationErrors | null => {
      let password = undefined;
      let confirmPassword = undefined;
      for (const key in fg.controls) {
        if (key == 'password') {
          password = fg.controls[key].value as string;
        } else {
          confirmPassword = fg.controls[key].value as string;
        }
      }

      if (
        (password && confirmPassword && password === confirmPassword) ||
        !confirmPassword
      ) {
        return null;
      }
      fg.controls['confirmPassword'].setErrors({ passwordMismatch: true });
      return null;
    };
    this.cffs = [
      crispyTextField('firstName', 'Peter', [Validators.required], 'pe-2 w-50'),
      crispyTextField('lastName', 'Parker', undefined, 'w-50'),
      crispyDateRangeField(
        'publishedOn',
        {
          beginRangeLabel: 'From',
          endRangeLabel: 'To',
          beginRangeFormControlName: 'published_on__gte',
          endRangeFormControlName: 'published_on__lte',
          endRangeValidators: endDateRangeValidator,
        },
        {
          published_on__gte: '2023-06-19T16:00:00.000Z',
          published_on__lte: '2023-06-25T16:00:00.000Z',
        },
        undefined,
        'w-100'
      ),
      crispyFormGroup(
        'matchingPassword',
        [
          crispyPasswordField(
            'password',
            '',
            undefined, // [Validators.required, Validators.minLength(8)],
            'pe-2 w-50'
          ),
          crispyPasswordField(
            'confirmPassword',
            '',
            undefined, // [Validators.required, Validators.minLength(8)],
            'w-50'
          ),
        ],
        undefined,
        (fg) => matchPasswords(fg as FormGroup)
      ),
      crispySelectField(
        'sex',
        [
          { label: 'Male', value: 'M' },
          { label: 'Female', value: 'F' },
          { label: 'Transgender', value: 'T' },
        ],
        'M',
        Validators.required,
        'pe-2 w-50'
      ),
      crispySelectField(
        'status',
        of([
          { label: 'Married', value: 'M' },
          { label: 'Single', value: 'S' },
          { label: 'Widow/Widower', value: 'W' },
        ]),
        'M',
        Validators.required,
        'w-50'
      ),
      crispyCustomComponentField(
        'telephone',
        { component: MyTelInput },
        { area: '618', exchange: '782', subscriber: '2890' },
        undefined,
        'pe-2 w-50'
      ),
      crispyTemplateField('mobile', {
        area: '737',
        exchange: '777',
        subscriber: '0787',
      }, undefined, 'w-50'),
      crispyNumberField('age', undefined, undefined, 'w-100'),
      crispyCheckboxField(
        'public',
        false,
        undefined,
        'w-50'
      ),
      crispyTemplateField('dummy', [1, 2, 3]),
      crispyFormGroupArray(
        'items', [
          crispyTextField('name', '', Validators.required, 'w-40 pe-2', 'Name'),
          crispyNumberField('qty', 0, Validators.required, 'w-20 pe-2', 'Quantity'),
          crispyNumberField('unitPrice', 0, Validators.required, 'w-20 pe-2', 'Unit Price'),
          crispyTextField('total', '', undefined, 'w-20', 'Total'),
        ],
        undefined,
        undefined,
        undefined,
        "Items"
      ),
      crispyTemplateField('total', 0, undefined, 'w-100')
    ];
  }

  ngAfterViewInit(): void {
    const items: FormArray = this.crispyComponent.form.controls['items'] as FormArray;
    if (items) {
      items.valueChanges.pipe(
        tap((values: { name: string; qty: number; unitPrice: number; total: number} []) => {
          let invoiceTotal = 0;
          values.forEach((value, index: number) => {
            try {
              if (value.qty !== undefined && value.unitPrice !== undefined) {
                const total = value.qty * value.unitPrice;
                invoiceTotal += total;
                // const control: FormControl = items.at(index).get('total') as FormControl;
                items.at(index).get('total')?.setValue(total, {emitEvent: false, onlySelf: true});
              }
            } catch (error) {
              
            }
          })
          this.total.next(invoiceTotal);
          // console.log(`items changed: ${JSON.stringify(values)}`);
        })
      ).subscribe();
    }
  }

  onFormGroupAdded(event: any) {
    const fgEvent: {field: string, form: FormGroup} = event as {field: string, form: FormGroup};
    // console.log(`form group added - field: ${fgEvent.field}, group: ${fgEvent.form}`);
    fgEvent.form.controls['total'].disable();
  }

  onFormGroupRemoved(event: any) {
    const fgEvent: {field: string, form: FormGroup} = event as {field: string, form: FormGroup};
    // console.log(`form group removed - field: ${fgEvent.field}, group: ${fgEvent.form}`);
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
