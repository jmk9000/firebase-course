

import {Component, OnInit} from '@angular/core';
import 'firebase/firestore';

import {AngularFirestore} from '@angular/fire/firestore';
import {COURSES, findLessonsForCourse} from './db-data';


@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent {

    constructor(private db: AngularFirestore) {
    }

    async uploadData() {
        const coursesCollection = this.db.collection('courses');
        const courses = await this.db.collection('courses').get();
        for (let course of Object.values(COURSES)) {
            const newCourse = this.removeId(course);
            const courseRef = await coursesCollection.add(newCourse);
            const lessons = await courseRef.collection('lessons');
            const courseLessons = findLessonsForCourse(course['id']);
            console.log(`Uploading course ${course['description']}`);
            for (const lesson of courseLessons) {
                const newLesson = this.removeId(lesson);
                delete newLesson.courseId;
                await lessons.add(newLesson);
            }
        }
    }

    removeId(data: any) {
        const newData: any = {...data};
        delete newData.id;
        return newData;
    }

    onReadDoc() {
        this.db.doc('/courses/2rVkH078k4A7YTteCALm')
            .get()
            .subscribe(snap => {
                console.log(snap.id);
                console.log(snap.data);
            });
    }

    onReadCollection() {
        this.db.collection(
            'courses', 
            //a combined query (two where field), will cause
            //firebase to ask us to create an index
            //check the console log for this error and a link 
            //to where we can create an index
            ref => ref.where('seqNo', '<=', 20)
                    .where('url', '==', 'angular-forms-course')
                    .orderBy('seqNo'))
            .get()
            .subscribe(snapshots => {
                console.log(snapshots.forEach(snap => {
                    console.log(snap.id);
                    console.log(snap.data());
                }))
            })
    }
}
















