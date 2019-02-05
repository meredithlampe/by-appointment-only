var React = require('react');
var DND = require('react-beautiful-dnd');
var ReactDOM = require('react-dom');
import FirebaseHelper from '../../FirebaseHelper';
import DragAndDropFormUtils from '../../DragAndDropFormUtils.js';

// handle page load
document.addEventListener('DOMContentLoaded', function () {

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
		// if (!firebase.apps.length) {
		// 	firebase.initializeApp(config);		
		// }
		var firebaseHelper = new FirebaseHelper(firebase);

		// Make firebase reachable through the console.
		window.firebase = firebase;
		window.firebaseHelper = firebaseHelper;

		try {
				var app = firebase.app();
				var features = ['database', 'storage'].filter(function (feature) {
						return typeof app[feature] === 'function';
				});
		} catch (e) {
				console.error(e);
		}

		console.log("loaded firebase?");
});