var React = require('react');
var DND = require('react-beautiful-dnd');
var ReactDOM = require('react-dom');
import FirebaseHelper from '../../babelOutput/FirebaseHelper';
import DragAndDropFormUtils from '../../babelOutput/DragAndDropFormUtils.js';
import { ViewForm } from './ViewForm.react.js';

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value;
  });
  return vars;
}

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
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
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

  // get form info from URL
  var user = getUrlVars()['u'];
  var formName = getUrlVars()['name'];

  // try to fetch form from firebase
  firebaseHelper.getPublicUserForm(user, formName, function (formData) {

    // header
    $('.form-header').html(formData.name);
    $('#form-id-input-hidden').attr('value', formData.id);

    // body
    var props = {
      firebaseHelper: firebaseHelper,
      id: formData.id,
      name: formData.name,
      formHostId: user
    };
    var formContainer = document.querySelector('.form-body');
    ReactDOM.render(React.createElement(ViewForm, props), formContainer);
  });
});