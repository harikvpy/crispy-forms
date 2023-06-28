# CrispyMatForm

An Angular library to generate & layout reactive forms based on field definitions as TypeScript objects.

## Dependencies

* Angular ^15.2.0
* Angular Material ^15.2.0

## Introduction
Building HTML forms can quickly become quite tedious as one has to constantly shift their energies between writing the code for the form's data logic and the form HTML layout.

Angular's reactive forms helps mitigate this quite a bit by providing a framework to abstract & isolate the former in TypeScript code thereby decoupling the form's data logic from its visual presentation layout part. However, one still has to write the HTML for laying out the form's controls using your chosen framework -- Bootstrap or Angular Material.

This is where this library comes in. It allows you to declare the form and its layout in TypeScript as an array of objects much like how the controls are declared in `FormGroup`. Thereafter to render the form, instantiate the library's `crispy-mat-form` component passing this array of fields as its `cffs` property.

To illustrate with an example:

```
...
import {
  CrispyMatFormComponent,
  crispyTextField,
} from '@smallpearl/crispy-mat-form';

@Component({
imports: [
  CommonModule,
  ReactiveFormsModule,
  MatButtonModule,
  CrispyMatFormModule,
],
template: `
  <form [formGroup]="crispyComponent.form" (ngSubmit)="onSubmit()">
    <crispy-mat-form [cffs]="cffs"> </crispy-mat-form>
    <div>
      <button mat-raised-button color="primary" type="button" (click)="onReset()">
        Reset
      </button>&nbsp;
      <button mat-raised-button color="primary" type="submit" [disabled]="crispyComponent.form.invalid">
        Submit
      </button>
    </div>
  </form>
`,
})
export class AppComponent implements OnInit {
  cffs!: CrispyFormField[];
  @ViewChild(CrispyMatFormComponent, { static: true }) crispyComponent!: CrispyMatFormComponent;

  ngOnInit() {
    this.cffs = [
      crispyTextField('name', '', Validators.required, 'pe-2 w-50'),
      crispyEmailField('email', '', Validators.required, 'w-50'),
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
```

The `mat` infix in the component's selector is deliberate. This is an explicit
hint to highlight that the form is rendered using Angular Material UI components.

## Version History
* 0.1 - Initial release
* 0.2 - 
* 0.3 - Added `crispyCheckboxField`.