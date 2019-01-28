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
	// firebase.initializeApp(config);

	// Make firebase reachable through the console.
	window.firebase = firebase;

	let firebaseHelper = new FirebaseHelper(firebase);
		window.firebaseHelper = firebaseHelper;
	firebaseHelper.setOnAuthStateChanged(onAuthStateChanged);

    // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
    // firebase.messaging().requestPermission().then(() => { });
    // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });

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

// authentication - sign in button
let signInButton = document.getElementById('sign-in-button');
signInButton.addEventListener('click', function() {
	var provider = new firebase.auth.GoogleAuthProvider();
	firebase.auth().signInWithPopup(provider);
});

// authentication - sign out button
let signOutButton = document.getElementById('sign-out-button');
signOutButton.addEventListener('click', function() {
	firebase.auth().signOut();
});

// new form button
let newFormButton = $('.create-form-button');
newFormButton.click(function() {
	let sampleFormItems = {
		items: [
			{
				id: 0,
				idCopy: 0,
				label: "Name",
				placeholder: "Enter Name",
				inputType: "shortText",
			},
			{
				id: 1,
				idCopy: 1,
				label: "Email",
				placeholder: "Enter Email",
				inputType: "shortText",
			},
			{
				id: 2,
				idCopy: 3,
				label: "Comments",
				placeholder: "Provide any additional comments here",
				inputType: "longText",
			},
		],
	};

	let props = {
		formItems: sampleFormItems,
		formName: 'My New Form',
		lastUnusedId: 4,
		firebaseHelper: firebaseHelper,
	};
   const formInputArea = document.querySelector('.create-form-input-area');
	ReactDOM.render(React.createElement(DragAndDropForm, props), formInputArea);
	$('.applicant-forms-home').hide();
	$('.applicant-forms-create-form').show();
});

// cancel create new form
let cancelNewForm = $('.create-form-cancel').click(function() {
	$('.applicant-forms-create-form').hide();
	$('.applicant-forms-home').show();
	const formInputArea = document.querySelector('.create-form-input-area');
	ReactDOM.unmountComponentAtNode(formInputArea);
})

let previewFormLink = $('.preview-form-link');
previewFormLink.click(function() {
	$('.applicant-forms-create-form').hide();
	$('.applicant-forms-preview-form').show();
})

  // all tab click handlers
  $('.home-tab').click(() => {
    cleanupTabs();
    transitionToTab('home');
  });
  $('.calendar-tab').click(() => {
    cleanupTabs();
    transitionToTab('calendar');
  });
  $('.appointments-tab').click(() => {
    cleanupTabs();
    transitionToTab('appointments');
    renderAppointments();
  });
  $('.applicant-forms-tab').click(() => {
    cleanupTabs();
    transitionToTab('applicant-forms');
  });

/**
 * The ID of the currently signed-in User. We keep track of this to detect Auth state change events that are just
 * programmatic token refresh but not a User status change.
 */
var currentUID;

function startFormsLiveUpdaters() {
	window.firebaseHelper.setOnFormAdded(
		(formData) => {
			let name = formData.name;
			let lastEdited = formData.lastEdited;

			// configure edit link
			let editLink = document.createElement('a');
			editLink.innerHTML = 'Edit';
			let editFunction = (name, event) => {
				let props = {
					formName: name,
					lastUnusedId: 4,
					firebaseHelper: firebaseHelper,
				};
			   const formInputArea = document.querySelector('.create-form-input-area');
				ReactDOM.render(React.createElement(DragAndDropForm, props), formInputArea);
				$('.applicant-forms-home').hide();
				$('.applicant-forms-create-form').show();
			};
			let editFunctionWithParams = editFunction.bind(null, formData.name);
			editLink.addEventListener('click', editFunctionWithParams);
			let editTd = document.createElement('td');
			editTd.append(editLink);

			// configure delete link
			let deleteLink = document.createElement('a');
			deleteLink.setAttribute('data-toggle', "modal");
			deleteLink.setAttribute('data-target', '#deleteFormModal');
			deleteLink.innerHTML = 'Delete';
			let deleteFunction = (name, event) => {
				// set body of modal
				let modal = $('#deleteFormModal');
				let body = modal.find('.modal-body');
				body.html('Are you sure you want to delete <b>' + name + '</b>?');
				let deleteButton = modal.find('.delete-form-button');
				let removeFormFunction = (name) => {
					firebaseHelper.removeForm(name);
				};
				removeFormFunction = removeFormFunction.bind(null, name);
				deleteButton.click(removeFormFunction);
			}
			let deleteFunctionWithParams = deleteFunction.bind(null, formData.name);
			deleteLink.addEventListener('click', deleteFunctionWithParams);
			let deleteTd = document.createElement('td');
			deleteTd.append(deleteLink);

			// append table data elements to row
			let formTable = $('.applicant-forms-table-body');
			let tableRow = $(document.createElement('tr'));
			tableRow.addClass('odd gradeX');
			tableRow.addClass('form-table-row-' + DragAndDropFormUtils.getSafeName(name));
			tableRow.append("<td>" + name + "</td>");
			tableRow.append("<td>" + lastEdited + "</td>");
			tableRow.append("<td>Not available</td>");
			tableRow.append(editTd);
			tableRow.append(deleteTd);
			tableRow.append("<td class=\"center\"><a>Share</a></td>");
			formTable.append(tableRow);
		},
		(formData) => {
			let tr = $('.form-table-row-' + DragAndDropFormUtils.getSafeName(formData.name));
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
    show($('.'+tabName));
  }

  function renderAppointments() {
  	// get appointments from database


  	// render in table
  }
