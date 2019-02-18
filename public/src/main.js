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

// hide all components initially
cleanupUI();
transitionToScreen('home-container');

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
		let link = null;
		if (formData.publishStatus && formData.publishStatus === 'published') {
			link = getViewFormLink(formData);
		} else {
			link = getPublishFormLink(formData);				
		}
		let publishTd = document.createElement('td');
		publishTd.append(link);

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

		// uesr has just signed in. redirect to home page.
		cleanupUI();
		transitionToScreen('home-container');

	    // listen for create/delete to user's forms
	    startFormsLiveUpdaters();
	    showUserInfo(user);
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

function showUserInfo(user) {
	$('.username').html(user.displayName);
	$('.user-profile-photo').attr('src', user.photoURL);
}

function cleanupUI() {
	$('.sign-in').hide();
	$('.home-container').hide();

	// hide sections of tabs that shouldn't be shown
	$('.applicant-forms-create-form').hide();
	$('.applicant-forms-preview-form').hide();
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
    show($('.'+tabName));
  }
