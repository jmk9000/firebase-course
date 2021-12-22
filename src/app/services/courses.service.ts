import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from "@angular/core";
import { Course } from '../model/course';
import { map } from 'rxjs/operators';
import { convertSnaps } from './db-utils';

@Injectable({providedIn: 'root'})
export class CoursesService {

    constructor(private db: AngularFirestore) {

    }

    loadCoursesByCategory(category: string): Observable<Course[]> {
        return this.db.collection(
            'courses',
            ref => ref.where('categories', 'array-contains', category)
                .orderBy('seqNo')
        )
        .get()
        .pipe(
            //convertSnaps of Type Course takes a query snapshot
            //and returns an array of Type Course
            map(result => convertSnaps<Course>(result))
        )

    }

}