import { Component } from "@angular/core";
import { DefaultControlErrorComponent } from "@ngneat/error-tailor";

@Component({
  selector: 'mat-error-tailor-error',
  host: {
    class: 'mat-mdc-form-field-error-wrapper',
    style: 'opacity: 1; transform: translateY(0%);'
  },
  template: `<mat-error>{{ errorText }}</mat-error>`,
})
export class MatErrorTailorControlErrorComponent extends DefaultControlErrorComponent {}
