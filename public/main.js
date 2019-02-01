var React = require('react');
var DND = require('react-beautiful-dnd');
var ReactDOM = require('react-dom');
import { DragAndDropForm } from './DragAndDropForm.react.js';
import FirebaseHelper from './FirebaseHelper';
import DragAndDropFormUtils from './DragAndDropFormUtils.js';

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
	var formInputArea = document.querySelector('.create-form-input-area');
	ReactDOM.render(React.createElement(DragAndDropForm, props), formInputArea);
	$('.applicant-forms-home').hide();
	$('.applicant-forms-create-form').show();
});

// cancel create new form
var cancelNewForm = $('.create-form-cancel').click(function () {
	$('.applicant-forms-create-form').hide();
	$('.applicant-forms-home').show();
	var formInputArea = document.querySelector('.create-form-input-area');
	ReactDOM.unmountComponentAtNode(formInputArea);
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
		var name = formData.name;
		var lastEdited = formData.lastEdited;

		// configure edit link
		var editLink = document.createElement('a');
		editLink.innerHTML = 'Edit';
		var editFunction = function editFunction(name, event) {
			var props = {
				formName: name,
				lastUnusedId: 4,
				firebaseHelper: firebaseHelper
			};
			var formInputArea = document.querySelector('.create-form-input-area');
			ReactDOM.render(React.createElement(DragAndDropForm, props), formInputArea);
			$('.applicant-forms-home').hide();
			$('.applicant-forms-create-form').show();
		};
		var editFunctionWithParams = editFunction.bind(null, formData.name);
		editLink.addEventListener('click', editFunctionWithParams);
		var editTd = document.createElement('td');
		editTd.append(editLink);

		// configure delete link
		var deleteLink = document.createElement('a');
		deleteLink.setAttribute('data-toggle', "modal");
		deleteLink.setAttribute('data-target', '#deleteFormModal');
		deleteLink.innerHTML = 'Delete';
		var deleteFunction = function deleteFunction(name, event) {
			// set body of modal
			var modal = $('#deleteFormModal');
			var body = modal.find('.modal-body');
			body.html('Are you sure you want to delete <b>' + name + '</b>?');
			var deleteButton = modal.find('.delete-form-button');
			var removeFormFunction = function removeFormFunction(name) {
				firebaseHelper.removeForm(name);
			};
			removeFormFunction = removeFormFunction.bind(null, name);
			deleteButton.click(removeFormFunction);
		};
		var deleteFunctionWithParams = deleteFunction.bind(null, formData.name);
		deleteLink.addEventListener('click', deleteFunctionWithParams);
		var deleteTd = document.createElement('td');
		deleteTd.append(deleteLink);

		// append table data elements to row
		var formTable = $('.applicant-forms-table-body');
		var tableRow = $(document.createElement('tr'));
		tableRow.addClass('odd gradeX');
		tableRow.addClass('form-table-row-' + DragAndDropFormUtils.getSafeName(name));
		tableRow.append("<td>" + name + "</td>");
		tableRow.append("<td>" + lastEdited + "</td>");
		tableRow.append("<td>Not available</td>");
		tableRow.append(editTd);
		tableRow.append(deleteTd);
		formTable.append(tableRow);
	}, function (formData) {
		var tr = $('.form-table-row-' + DragAndDropFormUtils.getSafeName(formData.name));
		if (tr) {
			tr.remove();
		}
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