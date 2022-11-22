import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Group } from '../models/Group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private _groups: Group[] = [
    { id: 1, name: '22INF' },
    { id: 2, name: '23INF' },
    { id: 3, name: '32INF' }
  ];

  constructor() { }
  
  public addGroup(group: Group): Group {
    const lastId = this.getLastId();
    group.id = lastId + 1;
    this._groups.push(group);
    return group;
  }

  public deleteGroup(group: Group): void {
    this._groups = this._groups.filter(g => g.id !== group.id);
  }

  public updateGroup(group: Group): Group {
    return group;
  }

  public getGroup(id: number): Observable<Group | undefined> {
    return of(this._groups.find(g => g.id === id));
  }

  public getGroups(): Observable<Group[]> {
    const groups = of(this._groups);
    return groups;
  }

  private getLastId(): number {
    return Math.max(...this._groups.map(o => o.id));
  }
}
