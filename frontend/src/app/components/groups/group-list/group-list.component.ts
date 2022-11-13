import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Group } from 'src/app/models/Group';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {
  public groups$: Observable<Group[]> = this.groupService.getGroups();

  constructor(private groupService: GroupService) { }

  ngOnInit(): void {
      this.groups$.subscribe(g => console.log(g));
  }
}
