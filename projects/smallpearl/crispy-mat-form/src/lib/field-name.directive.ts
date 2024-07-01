import {
  Directive,
  OnInit,
  OnDestroy,
  Input,
  TemplateRef,
} from '@angular/core';

@Directive({
  selector: 'ng-template.[crispyFieldName]',
})
export class CrispyFieldNameDirective implements OnInit, OnDestroy {
  static _crispyFieldTemplates: Array<CrispyFieldNameDirective> = [];

  @Input()
  crispyFieldName!: string;

  constructor(public templateRef: TemplateRef<any>) {}

  ngOnInit(): void {
    CrispyFieldNameDirective._crispyFieldTemplates.push(this);
    // console.log(`CrispyFieldNameDirective.ngOnInit - field: ${this.crispyFieldName},_crispyFieldTemplates.length: ${CrispyFieldNameDirective._crispyFieldTemplates.length}`);
  }

  ngOnDestroy(): void {
    const index = CrispyFieldNameDirective._crispyFieldTemplates.findIndex(
      (f) => f.crispyFieldName.localeCompare(this.crispyFieldName) == 0,
      1
    );
    // console.log(`CrispyFieldNameDirective.ngOnDestroy(bf) - field: ${this.crispyFieldName}, _crispyFieldTemplates.length: ${CrispyFieldNameDirective._crispyFieldTemplates.length}, index: ${index}`);
    if (index !== -1) {
      CrispyFieldNameDirective._crispyFieldTemplates.splice(index, 1);
      // console.log(`CrispyFieldNameDirective.ngOnDestroy(af) - field: ${this.crispyFieldName}, _crispyFieldTemplates.length: ${CrispyFieldNameDirective._crispyFieldTemplates.length}`);
    }
  }
}
