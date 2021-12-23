// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  useEmulators: true,
  firebase: {
    apiKey: "AIzaSyDsNiE1pIhxt-q5NJRaWSN6LwyGYdajnN0",
    authDomain: "fir-course-6f95e.firebaseapp.com",
    projectId: "fir-course-6f95e",
    storageBucket: "fir-course-6f95e.appspot.com",
    messagingSenderId: "248035233886",
    appId: "1:248035233886:web:d167158ca852c61b4024cf"
  },
  api: {

  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
