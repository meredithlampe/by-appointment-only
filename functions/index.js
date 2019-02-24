const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.submitForm = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  console.log(req);
  console.log(req.body);
  console.log(req.query);

  let submission = req.body;
  admin.database().ref('/submissions/' + 'formID').push(req.body).then((snapshot) => {
  	return res.redirect('http://localhost:5000/viewForm/formSubmitSuccess.html');
  });

  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  // return admin.database().ref('/messages').push({original: original}).then((snapshot) => {
  //   // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.)
  //   return res.redirect(303, snapshot.ref.toString());
  // });
  return 'yo';
});