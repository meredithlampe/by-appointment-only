const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.submitForm = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  console.log(req);
  console.log(req.body);
  console.log(req.query);

  let submission = req.body;
  admin.database().ref('/submissions/' + req.body.formID).push(req.body).then((snapshot) => {
  	return res.redirect('http://localhost:5000/viewForm/formSubmitSuccess.html');
  });
});