import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { Day } from 'src/app/models/Day';
import { Group } from 'src/app/models/Group';
import { Schedule } from 'src/app/models/Schedule';
import { SchedulePerDay } from 'src/app/models/SchedulePerDay';
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
  public schedulesPerDay: Map<Day, SchedulePerDay[]> = new Map<Day, SchedulePerDay[]>();

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

  public ngOnDestroy(): void {
    this.querySubscription?.unsubscribe();
  }

  public printPage(id: string): void {
      var printHtml = window.document.getElementById(id)?.outerHTML;
      if(!printHtml) {
        return;
      }

      let popupWin;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin?.document.open();
      console.log(document.head)
      const stylesHtml = this.getTagsHtml('style');
      const linksHtml = this.getTagsHtml('link');
      popupWin?.document.write(`
        <html>
          <head>
            ${linksHtml}
            ${stylesHtml}
          </head>
          <body onload="window.print();window.close()">${printHtml}</body>
        </html>`
      );
      popupWin?.document.close();
  }

  private getTagsHtml(tagName: keyof HTMLElementTagNameMap): string
  {
      const htmlStr: string[] = [];
      const elements = document.getElementsByTagName(tagName);
      for (let idx = 0; idx < elements.length; idx++)
      {
          htmlStr.push(elements[idx].outerHTML);
      }

      return htmlStr.join('\r\n');
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
    .subscribe(val => {
      this.schedules = val.data.SchedulesByGroup;
      this.schedulesPerDay = this.createSchedulesPerDay([...this.schedules]);
    });
  }

  private createSchedulesPerDay(schedules: Schedule[]): Map<Day, SchedulePerDay[]> {
    if (!schedules) {
      return new Map<Day, SchedulePerDay[]>();
    }

    if (schedules.length == 0){
      return new Map<Day, SchedulePerDay[]>();
    }

    const schedulesGrouped = this.groupBy(this.schedules, "day") as { [key: string]: Array<Schedule> };
    const collectionSchedulesPerDay = new Map<Day, SchedulePerDay[]>();
    for (const property in schedulesGrouped) {
      const schedulesPerDay: SchedulePerDay[] = schedulesGrouped[property]
          .sort((a,b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0))
          .map(s => ({
        id: s.id,
        time: this.getScheduleHour(s.time),
        subject: s.Subject.name,
        teacher: s.Subject.Teacher.first_name + " " + s.Subject.Teacher.last_name,
        room: s.Room.name,
      }));
      const day: Day = Number(property);
      collectionSchedulesPerDay.set(day, schedulesPerDay);
    }

    return collectionSchedulesPerDay;
  }

  private groupBy(arr: any[], key:any): any {
    return arr.reduce((acc, cur) => {
      acc[cur[key]] = [...acc[cur[key]] || [], cur];
      return acc;
    }, []).filter(Boolean);
  }

  private getScheduleHour(value: number): string {
    const valueString = value.toString();
    if (valueString.length < 3) {
      return "";
    }
    return valueString.slice(0, valueString.length-2) + ":" + valueString.slice(valueString.length-2);
  }
}
