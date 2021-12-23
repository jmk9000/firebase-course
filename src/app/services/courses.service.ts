import { from, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from "@angular/core";
import { Course } from '../model/course';
import { map, concatMap } from 'rxjs/operators';
import { convertSnaps } from './db-utils';
import { Lesson } from '../model/lesson';

@Injectable({providedIn: 'root'})
export class CoursesService {

    constructor(private db: AngularFirestore) {

    }

    deleteCourseAndLessons(courseId: string) {
        return this.db.collection(`courses/${courseId}/lessons`)
            .get()
            .pipe(
                concatMap(results => {
                    const lessons = convertSnaps<Lesson>(results);
                    const batch = this.db.firestore.batch();
                    const courseRef = this.db.doc( `courses/${courseId}`).ref;
                    //something interesting to note
                    //the parent ref can be deleted before the nested collection
                    batch.delete(courseRef);

                    //also take a look at batch.set and batch.update

                    for (let lesson of lessons) {
                        const lessonRef = this.db.doc(`courses/${courseId}/lessons/${lesson.id}`).ref;
                        batch.delete(lessonRef);
                    }

                    return from(batch.commit());
                })
            )
    }

    deleteCourse(courseId: string): Observable<any> {
        return from(this.db.doc(`courses/${courseId}`).delete());
    }

    updateCourse(courseId: string, changes: Partial<Course>): Observable<any> {
        return from(this.db.doc(`courses/${courseId}`).update(changes));
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