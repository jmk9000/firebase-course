import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import * as firebaseui from 'firebaseui';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import firebase from 'firebase/app';
import EmailAuthProvider = firebase.auth.EmailAuthProvider;
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;


@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

    ui: firebaseui.auth.AuthUI;

    constructor(
        private afAuth: AngularFireAuth,
        private router: Router) {

    }

    ngOnInit() {
        //angular fire auth returns a promise "app"
        //which we then wait for it to return a firebase.app.App
        //this means firebase sdk is initialized and ready to use.
        this.afAuth.app.then(app => {
            const uiConfig = {
                signInOptions: [
                    EmailAuthProvider.PROVIDER_ID,
                    GoogleAuthProvider.PROVIDER_ID
                ],
                callbacks: {
                    //all references to this within LoginSuccessful will now correctly
                    //identify with this instance of the LoginComponent
                    signInSuccessWithAuthResult: this.onLoginSuccessful.bind(this)
                }
            };

            this.ui = new firebaseui.auth.AuthUI(app.auth());
            //select the css id
            this.ui.start("#firebaseui-auth-container", uiConfig);
            this.ui.disableAutoSignIn();
        });

    }

    ngOnDestroy() {
        this.ui.delete();
    }

    onLoginSuccessful(result) {
        console.log('firebase ui result: ', result)
        this.router.navigateByUrl('/courses');
    }
}


