import { Component, OnInit } from '@angular/core';
import { Grade } from 'src/app/models/Grade';
import { ApiService } from 'src/app/services/api.service';
import * as graphOperations from '../../graphql-operations';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.scss']
})
export class GradesComponent implements OnInit {
  public grades: Grade[] | null = [];
  public loading: boolean = true;

  constructor(private service: ApiService) { }

  public ngOnInit(): void {
    this.service.apollo.watchQuery<any>({
      query: graphOperations.GET_MY_GRADES
    })
    .valueChanges.subscribe(({ data }) => {
        this.grades = data.MyGrades.map((g: { Subject: { name: any; Teacher: { first_name: string; last_name: string; }; }; grade: any; }) => ({
          subjectName: g.Subject.name, 
          teacherName: g.Subject.Teacher.first_name + " " + g.Subject.Teacher.last_name,
          grade: g.grade
        }));
        this.loading = false;
      });
  }

}
