import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  CRISPY_FORMS_CONFIG_PROVIDER,
  CrispyFormsConfig,
  CrispyMatFormModule,
} from 'dist/crispy-mat-form';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MyTelInput } from './components/my-tel-input/my-tel-input.component';
import { MatFormFieldModule } from '@angular/material/form-field';

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
    BrowserAnimationsModule,
    AppRoutingModule,
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
