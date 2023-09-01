import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CRISPY_FORMS_CONFIG_PROVIDER, MatErrorTailorControlErrorComponent, CrispyFormsConfig, CrispyMatFormModule } from '@smallpearl/crispy-mat-form';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MyTelInput } from './components/my-tel-input/my-tel-input.component';
import { errorTailorImports, provideErrorTailorConfig } from '@ngneat/error-tailor';
import { MatInputModule } from '@angular/material/input';

/**
 * CrispyConfig demonstrator that converts all labels to uppercase.
 */
const CrispyConfig: CrispyFormsConfig = {
  labelFn: (code: string) => code.toUpperCase(),
};

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
    { provide: CRISPY_FORMS_CONFIG_PROVIDER, useValue: CrispyConfig },
    provideErrorTailorConfig({
      blurPredicate(element) {
        return element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'MAT-SELECT';
      },
      controlErrorComponent: MatErrorTailorControlErrorComponent,
      errors: {
          useValue: {
            required: 'This field is required',
            pattern: "Doesn't match the required pattern",
            minlength: ({ requiredLength, actualLength }) => 
                        `Expect ${requiredLength} but got ${actualLength}`,
            invalidAddress: error => `Address isn't valid`
          }
        }
      }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
