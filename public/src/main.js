var React = require('react');
var DND = require('react-beautiful-dnd');
var ReactDOM = require('react-dom');
import {DragAndDropForm} from './DragAndDropForm.react.js';
import FirebaseHelper from './FirebaseHelper';
import DragAndDropFormUtils from './DragAndDropFormUtils.js';

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
	// if (!firebase.apps.length) {
 // 		firebase.initializeApp(config);		
	// }

	// Make firebase reachable through the console.
	window.firebase = firebase;

	let firebaseHelper = new FirebaseHelper(firebase);
	window.firebaseHelper = firebaseHelper;
	firebaseHelper.setOnAuthStateChanged(onAuthStateChanged);

  try {
    let app = firebase.app();
    let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');

  } catch (e) {
    console.error(e);
  }

});

// authentication - sign out button
let signOutButton = document.getElementById('sign-out-button');
signOutButton.addEventListener('click', function() {
	firebase.auth().signOut();
});

// new form button
let newFormButton = $('.create-form-button');
newFormButton.click(function() {
	let props = {
		databaseID: firebaseHelper.generateFormID(),
		formItems: [],
		formName: 'My New Form',
		lastUnusedId: 0,
		firebaseHelper: firebaseHelper,
		newForm: true,
	};
   const formInputArea = document.querySelector('.create-form-column');
	ReactDOM.render(React.createElement(DragAndDropForm, props), formInputArea);
	$('.home').addClass('hidden');
	$('.create-form-input-area').removeClass('hidden');
});

// cancel create new form
let cancelNewForm = $('.create-form-cancel').click(function() {
	$('.create-form-input-area').addClass('hidden');
	$('.home').removeClass('hidden');
	const formInputArea = document.querySelector('.create-form-column');
	ReactDOM.unmountComponentAtNode(formInputArea);
})

/**
 * The ID of the currently signed-in User. We keep track of this to detect Auth state change events that are just
 * programmatic token refresh but not a User status change.
 */
var currentUID;

function startFormsLiveUpdaters() {
	// get edit form link
	let getEditFormLink = (formData) => {
		let editLink = document.createElement('a');
		editLink.innerHTML = 'Edit';
		let editFunction = (id, event) => {
			let props = {
				databaseID: id,
				lastUnusedId: 4,
				firebaseHelper: firebaseHelper,
			};
		   const formInputArea = document.querySelector('.create-form-column');
			ReactDOM.render(React.createElement(DragAndDropForm, props), formInputArea);
			$('.home').addClass('hidden');
			$('.create-form-input-area').removeClass('hidden');
		};
		let editFunctionWithParams = editFunction.bind(null, formData.id);
		editLink.addEventListener('click', editFunctionWithParams);
		return editLink;
	};

	// get publish form link
	let getPublishFormLink =(formData) => {
		let publishLink = document.createElement('a');
		publishLink.setAttribute('data-toggle', "modal");
		publishLink.setAttribute('data-target', '#publishFormModal');
		publishLink.innerHTML = 'Publish';
		let publishFunction = (id, name, event) => {
			// set body of modal
			let modal = $('#publishFormModal');
			let body = modal.find('.modal-body');
			body.html('Ready to publish <b>' + name + "</b>?");
			let publishButton = modal.find('.publish-form-button');
			let publishFormFunction = (id) => {
				// clear publish modal content
				let modal = $('#publishFormModal');
				let body = modal.find('.modal-body');
				body.empty();					

				// set publish modal to loading
				body.append('<div class="d-flex justify-content-center loader-container"><div class="loader"></div></div>');
				firebaseHelper.publishForm(id, (formData) => {
					// clear publish modal content
					let modal = $('#publishFormModal');
					let body = modal.find('.modal-body');
					body.empty();

					// set to done and show new URL
					body.html(formData.name + " has been published!");
					body.append('<a class="view-published-form" target="_blank" href="' + formData.publishURL + '">View Published Form</a>');
					publishButton.remove();
					modal.find('.modal-footer').append(getOkButtonToDismissModal('#unpublishFormModal'));
				});
			}
			publishFormFunction = publishFormFunction.bind(null, formData.id);
			publishButton.click(publishFormFunction);
		};
		let publishFunctionWithParams = publishFunction.bind(null, formData.id, formData.name);
		publishLink.addEventListener('click', publishFunctionWithParams);
		
		return publishLink;
	};

	let getViewFormLink = (formData) => {
		let viewLink = document.createElement('a');
		viewLink.setAttribute('data-toggle', "modal");
		viewLink.setAttribute('data-target', '#viewFormModal');
		viewLink.innerHTML = 'View';
		let viewFunction = (id, name, publishURL, event) => {
			// set body of modal
			let modal = $('#viewFormModal');
			let body = modal.find('.modal-body');
			body.html('View <b>' + name + '</b>? This will take you to view your form at the public URL.');
			let viewButton = modal.find('.view-form-button');
			let viewFormFunction = (id, publishURL) => {
				// clear out this modal
				let modal = $('#viewFormModal');
				let body = modal.find('.modal-body');
				body.empty();

				// redirect to view form page
				window.open(publishURL, '_blank');
			}
			viewFormFunction = viewFormFunction.bind(null, id, publishURL);
			viewButton.click(viewFormFunction);
		}
		viewFunction = viewFunction.bind(null, formData.id, formData.name, formData.publishURL);
		viewLink.addEventListener('click', viewFunction);
		return viewLink;
	}

	let getUnpublishFormLink = (formData) => {
		let link = document.createElement('a');
		link.setAttribute('data-toggle', "modal");
		link.setAttribute('data-target', '#unpublishFormModal');
		link.innerHTML = 'Unpublish';
		let linkFunction = (id, name, event) => {
			// set body of modal
			let modal = $('#unpublishFormModal');
			let body = modal.find('.modal-body');
			body.html('Unpublish <b>' + name + '</b>? This will deactivate any links to the form.');
			let submitButton = modal.find('.unpublish-form-button');
			let submitFunction = (id) => {
				// clear out this modal
				let modal = $('#unpublishFormModal');
				let body = modal.find('.modal-body');
				body.empty();

				// set publish modal to loading
				body.append('<div class="d-flex justify-content-center loader-container"><div class="loader"></div></div>');
				submitButton.prop('disabled', true);
				firebaseHelper.unpublishForm(id, (formData) => {
					// clear publish modal content
					let modal = $('#unpublishFormModal');
					let body = modal.find('.modal-body');
					body.empty();

					// show confirmation of unpublish form action
					body.html(formData.name + " has been unpublished and is no longer active.");
					submitButton.remove();
					modal.find('.modal-footer').append(getOkButtonToDismissModal('#unpublishFormModal'));
				});
			}
			submitFunction = submitFunction.bind(null, id);
			submitButton.click(submitFunction);
		}
		linkFunction = linkFunction.bind(null, formData.id, formData.name);
		link.addEventListener('click', linkFunction);
		return link;	
	}

	// get delete form link
	let getDeleteFormLink = (formData) => {
		let deleteLink = document.createElement('a');
		deleteLink.setAttribute('data-toggle', "modal");
		deleteLink.setAttribute('data-target', '#deleteFormModal');
		deleteLink.innerHTML = 'Delete';
		let deleteFunction = (id, name, event) => {
			// set body of modal
			let modal = $('#deleteFormModal');
			let body = modal.find('.modal-body');
			body.html('Are you sure you want to delete <b>' + name + '</b>?');
			let deleteButton = modal.find('.delete-form-button');
			let removeFormFunction = (id) => {
				firebaseHelper.removeForm(id);
			};
			removeFormFunction = removeFormFunction.bind(null, id);
			deleteButton.click(removeFormFunction);
		}
		let deleteFunctionWithParams = deleteFunction.bind(null, formData.id, formData.name);
		deleteLink.addEventListener('click', deleteFunctionWithParams);
		return deleteLink;
	};

	let getOkButtonToDismissModal = (modalId) => {
		let okButton = $(document.createElement('button'));
		okButton.html('OK');
		okButton.click(null);
		okButton.prop('disabled', false);
		okButton.addClass('btn btn-primary');
		okButton.attr('data-dismiss', "modal");
		okButton.attr('data-target', modalId);
		return okButton;		
	}

	let onFormAdded = (formData) => {
		// configure edit link
		let editLink = getEditFormLink(formData);
		let editTd = document.createElement('td');
		editTd.append(editLink);

		// configure delete link
		let deleteLink = getDeleteFormLink(formData);
		let deleteTd = document.createElement('td');
		deleteTd.append(deleteLink);

		//configure publish or view link
		let publishTd = document.createElement('td');
		if (formData.publishStatus && formData.publishStatus === 'published') {
			let viewFormLink = getViewFormLink(formData);
			let unpublishFormLink = getUnpublishFormLink(formData);
			let orDiv = document.createElement('div');
			orDiv.setAttribute('style', 'display: inline');
			orDiv.innerHTML = ' or ';

			publishTd.append(viewFormLink);
			publishTd.append(orDiv);
			publishTd.append(unpublishFormLink);
		} else {
			publishTd.append(getPublishFormLink(formData));
		}


		// append table data elements to row
		let formTable = $('.applicant-forms-table-body');
		let tableRow = $(document.createElement('tr'));
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
	window.firebaseHelper.setOnFormAdded(
		onFormAdded,
		(formData) => {
			let tr = $('.form-table-row-' + formData.id);
			if (tr) {
				tr.remove();
			}
		},
	);

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
