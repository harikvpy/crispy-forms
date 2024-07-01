import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { errorTailorImports, provideErrorTailorConfig } from '@ngneat/error-tailor';
import { CRISPY_FORMS_CONFIG_PROVIDER, CrispyFormsConfig, CrispyMatFormModule, MatErrorTailorControlErrorComponent } from '@smallpearl/crispy-mat-form';
import { interval, map, startWith } from 'rxjs';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyTelInput } from './components/my-tel-input/my-tel-input.component';
import { provideDateFnsAdapter } from "@angular/material-date-fns-adapter";
import { MAT_DATE_FORMATS, MatDateFormats, provideNativeDateAdapter } from '@angular/material/core';

/**
 * CrispyConfig demonstrator that converts all labels to uppercase.
 */
const CrispyConfig: CrispyFormsConfig = {
  labelFn: (code: string) => code.toUpperCase(),
  groupArrayConfig: {
    addRowText: interval(3000).pipe(
      startWith(''),
      map(() => (Math.floor(Math.random()*100)%10 > 5 ? "ADD ROW" : "+ Row"))
    )
  }
};

const MY_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'YYYY/MM/DD'
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthYearLabel: 'MM/YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM/YYYY'
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MyTelInput,
    CrispyMatFormModule,
    errorTailorImports,
  ],
  providers: [
    provideNativeDateAdapter(MY_DATE_FORMATS),
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: CRISPY_FORMS_CONFIG_PROVIDER, useValue: CrispyConfig },
    provideErrorTailorConfig({
      blurPredicate(element) {
        return (
          element.tagName === 'INPUT' ||
          element.tagName === 'SELECT' ||
          element.tagName === 'MAT-SELECT'
        );
      },
      controlErrorComponent: MatErrorTailorControlErrorComponent,
      errors: {
        useValue: {
          required: 'This field is required',
          pattern: "Doesn't match the required pattern",
          minlength: ({ requiredLength, actualLength }) =>
            `Expect ${requiredLength} but got ${actualLength}`,
          invalidAddress: (error) => `Address isn't valid`,
        },
      },
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
