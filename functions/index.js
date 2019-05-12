const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.submitForm = functions.https.onRequest((req, res) => {

	// get timestamp for submissoin
	let date = new Date();

  let submission = {
  	date: date.toString(),
  	fields: req.body
  };
  return admin.database().ref('/submissions/' + req.body.formHostID + "/" + req.body.formID).push(submission).then((snapshot) => {
  	return res.redirect('http://localhost:5000/viewForm/formSubmitSuccess.html');
  });
});