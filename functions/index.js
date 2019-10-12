const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.submitForm = functions.https.onRequest((req, res) => {
	// generate ID for submission
	// let submissionID = req.body.formHostID + '' + req.body.formID + '' + date.getMilliseconds();

	let submissionID = req.body.submissionID;
	let hostID = req.body.formHostID;
	let formID = req.body.formID;
	let body = req.body;
	let date = new Date();

	// pull out form host id and form id from submission body
	// because these are metadata about the form
	// everything else in the body is a field we want to show 
	// when admin views submitted form
	delete body.formHostID;
	delete body.formID;

	let submission = {
		date: date.toString(),
		time: date.getTime(),
		fields: body,
		formHostID: hostID,
		formID: formID,
		submissionID: submissionID,
 	};
  	return admin.database().ref('/submissions/' + hostID + "/" + formID + "/" + submissionID).set(submission).then((snapshot) => {
  		return res.redirect('http://localhost:5000/viewForm/formSubmitSuccess.html');
  	});
});