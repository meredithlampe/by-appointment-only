var React = require('react');
var DND = require('react-beautiful-dnd');
var ReactDOM = require('react-dom');
import FirebaseHelper from '../../babelOutput/FirebaseHelper';
import DragAndDropFormUtils from '../../babelOutput/DragAndDropFormUtils.js';
import {ViewForm} from './ViewForm.react.js';

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function showForm(formData, user, firebaseHelper, isUnpublished = false) {

    $('.loading-form').html('');

    // header
    $('.form-header').html(formData.name);
    $('#form-id-input-hidden').attr('value', formData.id);
    $('#form-host-id-input-hidden').attr('value', user);

    // get timestamp for submissoin
    let date = new Date();
    let submissionID = user + '' + formData.id + '' + date.getMilliseconds();
    $('#submission-id-input-hidden').attr('value', submissionID);

    console.log("submission ID created in mainViewForm.showForm:" + submissionID);

    if (isUnpublished) {
        // show notice that form isn't published
        $('.view-form-unpublished-alert').removeAttr("hidden");
    }

    // body
    let viewFormProps = {
        firebaseHelper: firebaseHelper,
        id: formData.id,
        name: formData.name,
        submissionID: submissionID,
        formHostId: user,
    }
    const formContainer = document.querySelector('.form-body');
    ReactDOM.render(React.createElement(ViewForm, viewFormProps), formContainer);
}

// handle page load
document.addEventListener('DOMContentLoaded', function() {

	//TODO: move this to file on server
  	var config = {
	    apiKey: "AIzaSyBH3LE6nJ46M3HymCqBZx5PKO2LBNbbU_0",
	    authDomain: "by-appointment-only.firebaseapp.com",
	    databaseURL: "https://by-appointment-only.firebaseio.com",
	    projectId: "by-appointment-only",
	    storageBucket: "by-appointment-only.appspot.com",
	    messagingSenderId: "885970159577"
  	};

	// Configure Firebase.	
	if (!firebase.apps.length) {
	 	firebase.initializeApp(config);		
	}
	let firebaseHelper = new FirebaseHelper(firebase);

	// Make firebase reachable through the console.
	window.firebase = firebase;
	window.firebaseHelper = firebaseHelper;

    try {
      let app = firebase.app();
      let features = ['database', 'storage'].filter(feature => typeof app[feature] === 'function');

    } catch (e) {
      console.error(e); 
    }

    // get form info from URL
    let user = getUrlVars()['u'];
    let formName = getUrlVars()['name'];

    // try to fetch form from firebase
    firebaseHelper.getPublicUserForm(user, formName, function(formData) {

        if (!formData) {
            // form not found. possibly because form hasn't been published.
            // check if viewer is form host
            firebaseHelper.getCurrentUserForm(formName, function(formData) {
                if (formData) {
                    showForm(formData, user, firebaseHelper, true);                    
                } else {
                    // show error message
                }
            });
        } else {
            showForm(formData, user, firebaseHelper);
        }
    });
  });