import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CRISPY_FORMS_CONFIG_PROVIDER, CrispyFormsConfig, CrispyMatFormModule } from '@smallpearl/crispy-mat-form';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MyTelInput } from './components/my-tel-input/my-tel-input.component';

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
    MyTelInput,
    CrispyMatFormModule,
  ],
  providers: [
    { provide: CRISPY_FORMS_CONFIG_PROVIDER, useValue: CrispyConfig },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
