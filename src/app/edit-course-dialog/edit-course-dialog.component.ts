import { CoursesService } from './../services/courses.service';
import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {AngularFireStorage} from '@angular/fire/storage';
import {Observable} from 'rxjs';


@Component({
    selector: 'edit-course-dialog',
    templateUrl: './edit-course-dialog.component.html',
    styleUrls: ['./edit-course-dialog.component.css']
})
export class EditCourseDialogComponent {

    form: FormGroup;

    course: Course;

    constructor(
        private dialogRef: MatDialogRef<EditCourseDialogComponent>,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) course: Course,
        private coursesService: CoursesService
    ) {

        this.course = course;

        this.form = this.fb.group({
            description: [course.description, Validators.required],
            longDescription: [course.longDescription, Validators.required],
            promo: [course.promo]
        })
        
    }

    onClose() {
        this.dialogRef.close();
    }

    onSave() {
        const changes = this.form.value;

        this.coursesService.updateCourse(this.course.id, changes)
            .subscribe(() => {
                //close dialog if successful
                //passing changes to close emits observable with changes
                this.dialogRef.close(changes);
            });
    }

}






