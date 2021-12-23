
import { CoursesService } from './../services/courses.service';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {finalize, tap} from 'rxjs/operators';
import {Observable, pipe} from 'rxjs';
import {Lesson} from '../model/lesson';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  course: Course;
  lessons: Lesson[];
  loading = false;
  lastPageLoaded = 0;

  displayedColumns = ['seqNo', 'description', 'duration'];

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService) {
  }

  ngOnInit() {
    this.course = this.route.snapshot.data['course'];

    this.loading = true;

    this.coursesService.findLessons(this.course.id)
      //finalize is used here to do some actions once the source
      //observable completes, but why don't we just do it in teh subscription?
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(
        lessons => {
          this.lessons = lessons
          //this.loading = false
        }
      );
  }

  loadMore() {
    this.lastPageLoaded++;
    this.loading = true;
    this.coursesService.findLessons(this.course.id, 'asc', 
      this.lastPageLoaded)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(lessons => this.lessons = this.lessons.concat(lessons))
  }

}
