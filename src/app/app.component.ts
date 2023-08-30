import { Component, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  CrispyFormField,
  CrispyMatFormComponent,
  crispyCustomComponentField,
  crispyDateRangeField,
  crispyFormFieldGroup,
  crispyPasswordField,
  crispySelectField,
  crispyTemplateField,
  crispyCheckboxField,
  crispyTextField,
} from '@smallpearl/crispy-mat-form';
import { of } from 'rxjs';
import { MyTelInput } from './components/my-tel-input/my-tel-input.component';

@Component({
  selector: 'app-root',
  template: `
    <h1>Crispy Form Demo</h1>
    <form [formGroup]="crispyComponent.form" (ngSubmit)="onSubmit()" errorTailor>
      <crispy-mat-form [cffs]="cffs"> </crispy-mat-form>
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
    <ng-template crispyFieldName="mobile">
      <mat-form-field class="w-50" [formGroup]="crispyComponent.form">
        <mat-label>My Telephone</mat-label>
        <my-tel-input formControlName="mobile"></my-tel-input>
      </mat-form-field>
    </ng-template>

    <ng-template crispyFieldName="mobile">
      <mat-form-field class="w-50" [formGroup]="crispyComponent.form">
        <mat-label>My Telephone</mat-label>
        <my-tel-input formControlName="mobile"></my-tel-input>
      </mat-form-field>
    </ng-template>

    <ng-template crispyFieldName="dummy" let-control="control" let-field="field" let-crispy="crispy">
      <div class="w-100">
        Members: <span *ngFor="let m of control.value">{{ m }}&nbsp;</span>
      </div>
    </ng-template>

    <!-- <router-outlet></router-outlet> -->
  `,
  styles: [],
})
export class AppComponent {
  cffs!: CrispyFormField[];
  @ViewChild(CrispyMatFormComponent, { static: true })
  crispyComponent!: CrispyMatFormComponent;

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
      crispyTextField('firstName', 'Peter', [Validators.required, Validators.minLength(8)], 'pe-2 w-50'),
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
      crispyFormFieldGroup(
        'matchingPassword',
        [
          crispyPasswordField(
            'password',
            '',
            [Validators.required, Validators.minLength(8)],
            'pe-2 w-50'
          ),
          crispyPasswordField(
            'confirmPassword',
            '',
            [Validators.required, Validators.minLength(8)],
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
        '',
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
        '',
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
      }),
      crispyCheckboxField(
        'public',
        false
      ),
      crispyTemplateField('dummy', [1, 2, 3])
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
