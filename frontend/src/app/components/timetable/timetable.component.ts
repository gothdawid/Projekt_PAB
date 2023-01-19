import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { Group } from 'src/app/models/Group';
import { Schedule } from 'src/app/models/Schedule';
import { ApiService } from 'src/app/services/api.service';
import * as graphOperations from '../../graphql-operations';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit, OnDestroy {
  private querySubscription: Subscription | undefined;
  public groups: Group[] = [];
  public loading: boolean = true;
  public currentGroup: Group | undefined; 
  public schedules: Schedule[] = [];

  constructor(private service: ApiService) { }

  public changeGroup(group: Group): void {
    if (!group) {
      return;
    }

    if (this.currentGroup?.id == group.id) {
      return;
    }

    this.currentGroup = group;
    this.getGroupSchedule();
  }

  ngOnInit(): void {
    this.service.apollo.watchQuery<any>({
      query: graphOperations.GET_GROUPS
    })
    .valueChanges.subscribe(({ data }) => {
        this.groups = data.allGroups;
        this.currentGroup = this.groups?.find(() => true);
        this.loading = false;
        this.getGroupSchedule();
      });
  }

  ngOnDestroy() {
    this.querySubscription?.unsubscribe();
  }

  private getGroupSchedule(): void {
    if (!this.currentGroup) {
      return;
    }

    this.service.apollo.query<any>({
      query: graphOperations.GET_SCHEDULE_BY_GROUP_ID,
      variables: { groupId: this.currentGroup.id }
    })
    .pipe(take(1))
    .subscribe(val => this.schedules = val.data.schedule);
  }
}
