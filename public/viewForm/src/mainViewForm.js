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

    	// header
    	$('.form-header').html(formData.name);

    	// body
    	let props = {
    		firebaseHelper: firebaseHelper,
            id: formData.id,
    		name: formData.name,
    		formHostId: user,
    	}
    	const formContainer = document.querySelector('.form-body');
		ReactDOM.render(React.createElement(ViewForm, props), formContainer);
    });

  });