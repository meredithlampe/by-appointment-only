const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.submitForm = functions.https.onRequest((req, res) => {

	// get timestamp for submissoin
	let date = new Date();

	// generate ID for submission
	let submissionID = req.body.formHostID + '' + req.body.formID + '' + date.getMilliseconds();

  let submission = {
  	date: date.toString(),
  	fields: req.body,
  	formHostID: req.body.formHostID,
  	formID: req.body.formID,
  	submissionID: submissionID,
  };
  return admin.database().ref('/submissions/' + req.body.formHostID + "/" + req.body.formID + "/" + submissionID).set(submission).then((snapshot) => {
  	return res.redirect('http://localhost:5000/viewForm/formSubmitSuccess.html');
  });
});