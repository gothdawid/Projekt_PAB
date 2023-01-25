import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appTableRow]'
})
export class TableRowDirective {
  @Input()
  public sorting: boolean = true;

  @Input()
  public property: string = "";

  constructor() { }

}
