var React = require('react');
var DND = require('react-beautiful-dnd');
var ReactDOM = require('react-dom');
import { DragAndDropForm } from './DragAndDropForm.react.js';
import FirebaseHelper from './FirebaseHelper';

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
	// firebase.initializeApp(config);

	// Make firebase reachable through the console.
	window.firebase = firebase;

	var firebaseHelper = new FirebaseHelper(firebase);
	window.firebaseHelper = firebaseHelper;
	firebaseHelper.setOnAuthStateChanged(onAuthStateChanged);

	// firebase.database().ref('/path/to/ref').on('value', snapshot => { });
	// firebase.messaging().requestPermission().then(() => { });
	// firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });

	// configure forms UI
	var domContainer = document.querySelector('.create-form-input-area');

	var sampleFormItems = {
		items: [{
			id: 0,
			idCopy: 0,
			label: "Name",
			placeholder: "Enter Name",
			inputType: "shortText"
		}, {
			id: 1,
			idCopy: 1,
			label: "Email",
			placeholder: "Enter Email",
			inputType: "shortText"
		}, {
			id: 2,
			idCopy: 3,
			label: "Comments",
			placeholder: "Provide any additional comments here",
			inputType: "longText"
		}]
	};

	var props = {
		formItems: sampleFormItems,
		formName: 'My New Form',
		lastUnusedId: 4,
		firebaseHelper: firebaseHelper
	};
	console.log("creating drag and drop form");
	ReactDOM.render(React.createElement(DragAndDropForm, props), domContainer);

	try {
		var app = firebase.app();
		var features = ['auth', 'database', 'messaging', 'storage'].filter(function (feature) {
			return typeof app[feature] === 'function';
		});
	} catch (e) {
		console.error(e);
	}
});

// hide all components initially
cleanupUI();
transitionToScreen('home-container');

// authentication - sign in button
var signInButton = document.getElementById('sign-in-button');
signInButton.addEventListener('click', function () {
	var provider = new firebase.auth.GoogleAuthProvider();
	firebase.auth().signInWithPopup(provider);
});

// authentication - sign out button
var signOutButton = document.getElementById('sign-out-button');
signOutButton.addEventListener('click', function () {
	firebase.auth().signOut();
});

// new form button
var newFormButton = $('.create-form-button');
newFormButton.click(function () {
	$('.applicant-forms-home').hide();
	$('.applicant-forms-create-form').show();
});

// cancel create new form
var cancelNewForm = $('.create-form-cancel').click(function () {
	$('.applicant-forms-create-form').hide();
	$('.applicant-forms-home').show();
});

var previewFormLink = $('.preview-form-link');
previewFormLink.click(function () {
	$('.applicant-forms-create-form').hide();
	$('.applicant-forms-preview-form').show();
});

// all tab click handlers
$('.home-tab').click(function () {
	cleanupTabs();
	transitionToTab('home');
});
$('.calendar-tab').click(function () {
	cleanupTabs();
	transitionToTab('calendar');
});
$('.appointments-tab').click(function () {
	cleanupTabs();
	transitionToTab('appointments');
	renderAppointments();
});
$('.applicant-forms-tab').click(function () {
	cleanupTabs();
	transitionToTab('applicant-forms');
});

/**
 * The ID of the currently signed-in User. We keep track of this to detect Auth state change events that are just
 * programmatic token refresh but not a User status change.
 */
var currentUID;

function startFormsLiveUpdaters() {
	window.firebaseHelper.setOnFormAdded(function (formData) {
		console.log(formData);
		var formTable = $('.applicant-forms-table-body');
		var tableRow = $(document.createElement('tr'));
		tableRow.addClass('odd gradeX');

		// replace data below with actual form data
		tableRow.append("<td>Sample Form</td>");
		tableRow.append("<td>Date</td>");
		tableRow.append("<td>80</td>");
		tableRow.append("<td class=\"center\"><a>Edit</a></td>");
		tableRow.append("<td class=\"center\"><a>Delete</a></td>");
		tableRow.append("<td class=\"center\"><a>Share</a></td>");
		formTable.append(tableRow);
	});
}

/**
 * Triggers every time there is a change in the Firebase auth state (i.e. user signed-in or user signed out).
 */
function onAuthStateChanged(user) {
	// We ignore token refresh events.
	if (user && currentUID === user.uid) {
		return;
	}

	if (user) {
		currentUID = user.uid;
		console.log("setting userid to " + user.uid);
		//writeUserData(user.uid, user.displayName, user.email, user.photoURL);
		//startDatabaseQueries();

		// uesr has just signed in. redirect to home page.
		cleanupUI();
		transitionToScreen('home-container');

		// listen for create/delete to user's forms
		startFormsLiveUpdaters();
	} else {
		// Set currentUID to null.
		currentUID = null;
		console.log("setting userid to null");
		cleanupUI();
		transitionToScreen('sign-in');
		// Display the splash page where you can sign-in.
		// splashPage.style.display = '';
	}
}

function cleanupUI() {
	$('.sign-in').hide();
	$('.home-container').hide();

	// hide sections of tabs that shouldn't be shown
	$('.applicant-forms-create-form').hide();
	$('.applicant-forms-preview-form').hide();
}

function cleanupTabs() {
	hide($('.home'));
	hide($('.calendar'));
	hide($('.appointments'));
	hide($('.applicant-forms'));
}

function hide(jQueryElement) {
	jQueryElement.addClass('hidden');
}

function show(jQueryElement) {
	jQueryElement.removeClass('hidden');
}

function transitionToScreen(className) {
	$('.' + className).show();
}

function transitionToTab(tabName) {
	show($('.' + tabName));
}

function renderAppointments() {
	// get appointments from database


	// render in table
}