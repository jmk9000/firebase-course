import { from, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from "@angular/core";
import { Course } from '../model/course';
import { map, concatMap } from 'rxjs/operators';
import { convertSnaps } from './db-utils';

@Injectable({providedIn: 'root'})
export class CoursesService {

    constructor(private db: AngularFirestore) {

    }

    createCourse(newCourse: Partial<Course>, courseId?: string): Observable<any> {
        return this.db.collection(
            'courses', 
            ref => ref.orderBy('seqNo', 'desc').limit(1))
            .get()
            .pipe(
                concatMap(result => {
                    const courses = convertSnaps<Course>(result);
                    //the ?? tells what to do if courses[0] is undefined
                    const lastCourseSeqNo = courses[0]?.seqNo ?? 0;

                    const course = {
                        ...newCourse,
                        seqNo: lastCourseSeqNo + 1
                    }

                    let save$: Observable<any>;

                    if (courseId) {
                        //rxjs operator - from
                        //turns a promise (or array or iterable) into an observable
                        save$ = from(this.db.doc(`courses/${courseId}`).set(course));
                    } else {
                        save$ = from(this.db.collection('courses').add(course));
                    }
                    //pipe to map, this gets the response from the database upon adding
                    //and we return a new data object, which is a valid course
                    //along with the course identifier
                    //this data object corresponds to the course model
                    return save$
                        .pipe(
                            map(res => {
                                return {
                                    id: courseId ?? res.id,
                                    ...course
                                }
                            })
                        );
                })
            )
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