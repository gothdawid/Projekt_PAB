import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input()
  public headers: string[] = [];

  private _data: any[] = [];

  @Input() set data(value: any[]) {
    this._data = value;
    this.dataCopy = [...this._data];
  }
    
  get data(): any[] {
      return this._data;
  }

  @Input()
  public sorting: boolean = true;

  public dataCopy: any[] = [];
  public rowClicked: number = -1;
  public behaviour = '';

  public Object = Object;

  constructor() { }

  public headerClicked(rowId: number) {
    if (!this.sorting || this.dataCopy.length < 1) {
      return;
    }

    const elements = Object.keys(this.dataCopy[0]);
    if (this.rowClicked == rowId && this.behaviour == this.rules.Asc) {
      this.behaviour = this.rules.Desc;
      this.dataCopy = this.dataCopy.sort((a,b) => (a[elements[rowId]] < b[elements[rowId]]) ? 1 : ((b[elements[rowId]] < a[elements[rowId]]) ? -1 : 0));
    } else if (this.rowClicked == rowId && this.behaviour == this.rules.Desc) {
      this.rowClicked = -1;
      this.behaviour = '';
      this.dataCopy = [...this.data];
    } else {
      this.rowClicked = rowId;
      this.behaviour = this.rules.Asc;
      this.dataCopy = this.dataCopy.sort((a,b) => (a[elements[rowId]] > b[elements[rowId]]) ? 1 : ((b[elements[rowId]] > a[elements[rowId]]) ? -1 : 0));
    }
  }

  public rules = {
    Asc: 'ASC',
    Desc: 'DESC'
  }
}
