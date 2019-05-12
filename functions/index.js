const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.submitForm = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  console.log(req);
  console.log(req.body);
  console.log(req.query);

  let submission = {
  	timestamp: 'today',
  	fields: req.body
  };
  return admin.database().ref('/submissions/' + req.body.formHostID + "/" + req.body.formID).push(submission).then((snapshot) => {
  	return res.redirect('http://localhost:5000/viewForm/formSubmitSuccess.html');
  });
});