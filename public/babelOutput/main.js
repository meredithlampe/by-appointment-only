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
	// if (!firebase.apps.length) {
	// 		firebase.initializeApp(config);		
	// }

	// Make firebase reachable through the console.
	window.firebase = firebase;

	var firebaseHelper = new FirebaseHelper(firebase);
	window.firebaseHelper = firebaseHelper;
	firebaseHelper.setOnAuthStateChanged(onAuthStateChanged);

	try {
		var app = firebase.app();
		var features = ['auth', 'database', 'messaging', 'storage'].filter(function (feature) {
			return typeof app[feature] === 'function';
		});
	} catch (e) {
		console.error(e);
	}
});

// authentication - sign out button
var signOutButton = document.getElementById('sign-out-button');
signOutButton.addEventListener('click', function () {
	firebase.auth().signOut();
});

// new form button
var newFormButton = $('.create-form-button');
newFormButton.click(function () {
	var props = {
		databaseID: firebaseHelper.generateFormID(),
		formItems: [],
		formName: 'My New Form',
		lastUnusedId: 0,
		firebaseHelper: firebaseHelper,
		newForm: true
	};
	var formInputArea = document.querySelector('.create-form-column');
	ReactDOM.render(React.createElement(DragAndDropForm, props), formInputArea);
	$('.home').addClass('hidden');
	$('.create-form-input-area').removeClass('hidden');
});

// cancel create new form
var cancelNewForm = $('.create-form-cancel').click(function () {
	$('.create-form-input-area').addClass('hidden');
	$('.home').removeClass('hidden');
	var formInputArea = document.querySelector('.create-form-column');
	ReactDOM.unmountComponentAtNode(formInputArea);
});

/**
 * The ID of the currently signed-in User. We keep track of this to detect Auth state change events that are just
 * programmatic token refresh but not a User status change.
 */
var currentUID;

function startFormsLiveUpdaters() {
	// get edit form link
	var getEditFormLink = function getEditFormLink(formData) {
		var editLink = document.createElement('a');
		editLink.innerHTML = 'Edit';
		var editFunction = function editFunction(id, event) {
			var props = {
				databaseID: id,
				lastUnusedId: 4,
				firebaseHelper: firebaseHelper
			};
			var formInputArea = document.querySelector('.create-form-column');
			ReactDOM.render(React.createElement(DragAndDropForm, props), formInputArea);
			$('.home').addClass('hidden');
			$('.create-form-input-area').removeClass('hidden');
		};
		var editFunctionWithParams = editFunction.bind(null, formData.id);
		editLink.addEventListener('click', editFunctionWithParams);
		return editLink;
	};

	// get publish form link
	var getPublishFormLink = function getPublishFormLink(formData) {
		var publishLink = document.createElement('a');
		publishLink.setAttribute('data-toggle', "modal");
		publishLink.setAttribute('data-target', '#publishFormModal');
		publishLink.innerHTML = 'Publish';
		var publishFunction = function publishFunction(id, name, event) {
			// set body of modal
			var modal = $('#publishFormModal');
			var body = modal.find('.modal-body');
			body.html('Ready to publish <b>' + name + "</b>?");
			var publishButton = modal.find('.publish-form-button');
			var publishFormFunction = function publishFormFunction(id) {
				// clear publish modal content
				var modal = $('#publishFormModal');
				var body = modal.find('.modal-body');
				body.empty();

				// set publish modal to loading
				body.append('<div class="d-flex justify-content-center loader-container"><div class="loader"></div></div>');
				firebaseHelper.publishForm(id, function (formData) {
					// clear publish modal content
					var modal = $('#publishFormModal');
					var body = modal.find('.modal-body');
					body.empty();

					// set to done and show new URL
					body.html(formData.name + " has been published!");
					body.append('<a class="view-published-form" target="_blank" href="' + formData.publishURL + '">View Published Form</a>');
				});
			};
			publishFormFunction = publishFormFunction.bind(null, formData.id);
			publishButton.click(publishFormFunction);
		};
		var publishFunctionWithParams = publishFunction.bind(null, formData.id, formData.name);
		publishLink.addEventListener('click', publishFunctionWithParams);

		return publishLink;
	};

	var getViewFormLink = function getViewFormLink(formData) {
		var viewLink = document.createElement('a');
		viewLink.setAttribute('data-toggle', "modal");
		viewLink.setAttribute('data-target', '#viewFormModal');
		viewLink.innerHTML = 'View';
		var viewFunction = function viewFunction(id, name, publishURL, event) {
			// set body of modal
			var modal = $('#viewFormModal');
			var body = modal.find('.modal-body');
			body.html('View <b>' + name + '</b>? This will take you to view your form at the public URL.');
			var viewButton = modal.find('.view-form-button');
			var viewFormFunction = function viewFormFunction(id, publishURL) {
				// clear out this modal
				var modal = $('#viewFormModal');
				var body = modal.find('.modal-body');
				body.empty();

				// redirect to view form page
				window.open(publishURL, '_blank');
			};
			viewFormFunction = viewFormFunction.bind(null, id, publishURL);
			viewButton.click(viewFormFunction);
		};
		viewFunction = viewFunction.bind(null, formData.id, formData.name, formData.publishURL);
		viewLink.addEventListener('click', viewFunction);
		return viewLink;
	};

	var getUnpublishFormLink = function getUnpublishFormLink(formData) {};

	// get delete form link
	var getDeleteFormLink = function getDeleteFormLink(formData) {
		var deleteLink = document.createElement('a');
		deleteLink.setAttribute('data-toggle', "modal");
		deleteLink.setAttribute('data-target', '#deleteFormModal');
		deleteLink.innerHTML = 'Delete';
		var deleteFunction = function deleteFunction(id, name, event) {
			// set body of modal
			var modal = $('#deleteFormModal');
			var body = modal.find('.modal-body');
			body.html('Are you sure you want to delete <b>' + name + '</b>?');
			var deleteButton = modal.find('.delete-form-button');
			var removeFormFunction = function removeFormFunction(id) {
				firebaseHelper.removeForm(id);
			};
			removeFormFunction = removeFormFunction.bind(null, id);
			deleteButton.click(removeFormFunction);
		};
		var deleteFunctionWithParams = deleteFunction.bind(null, formData.id, formData.name);
		deleteLink.addEventListener('click', deleteFunctionWithParams);
		return deleteLink;
	};

	var onFormAdded = function onFormAdded(formData) {
		// configure edit link
		var editLink = getEditFormLink(formData);
		var editTd = document.createElement('td');
		editTd.append(editLink);

		// configure delete link
		var deleteLink = getDeleteFormLink(formData);
		var deleteTd = document.createElement('td');
		deleteTd.append(deleteLink);

		//configure publish or view link
		var link = null;
		if (formData.publishStatus && formData.publishStatus === 'published') {
			link = getViewFormLink(formData);
		} else {
			link = getPublishFormLink(formData);
		}
		var publishTd = document.createElement('td');
		publishTd.append(link);

		// append table data elements to row
		var formTable = $('.applicant-forms-table-body');
		var tableRow = $(document.createElement('tr'));
		tableRow.addClass('odd gradeX');
		tableRow.addClass('form-table-row-' + formData.id);
		tableRow.append("<td>" + formData.name + "</td>");
		tableRow.append("<td>" + formData.lastEdited + "</td>");
		tableRow.append("<td>Not available</td>");
		tableRow.append(editTd);
		tableRow.append(deleteTd);
		tableRow.append(publishTd);
		formTable.append(tableRow);
	};
	onFormAdded = onFormAdded.bind(this);
	window.firebaseHelper.setOnFormAdded(onFormAdded, function (formData) {
		var tr = $('.form-table-row-' + formData.id);
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
		console.log("changing auth state");

		// listen for create/delete to user's forms
		startFormsLiveUpdaters();
		showUserInfo(user);
	} else {
		showLoggedOut();
	}
}

function showLoggedOut() {
	currentUID = null;
	window.location.href = "login.html";
}

function showUserInfo(user) {
	$('.username').html(user.displayName);
	$('.user-profile-photo').attr('src', user.photoURL);
}

function hide(jQueryElement) {
	jQueryElement.addClass('hidden');
}

function show(jQueryElement) {
	jQueryElement.removeClass('hidden');
}