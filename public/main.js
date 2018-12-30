var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var DND = require('react-beautiful-dnd');
var ReactDOM = require('react-dom');
// import { DragDropContext, Droppable, Draggable } from '../node_modules/react-beautiful-dnd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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

// handle page load
document.addEventListener('DOMContentLoaded', function () {
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  // // The Firebase SDK is initialized and available here!
  //
  // Listen for auth state changes
  firebase.auth().onAuthStateChanged(onAuthStateChanged);
  // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
  // firebase.messaging().requestPermission().then(() => { });
  // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
  //
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

  try {
    var app = firebase.app();
    var features = ['auth', 'database', 'messaging', 'storage'].filter(function (feature) {
      return typeof app[feature] === 'function';
    });
  } catch (e) {
    console.error(e);
    document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
  }
});

var getItems = function getItems(count) {
  return Array.from({ length: count }, function (v, k) {
    return k;
  }).map(function (k) {
    return {
      id: 'item-' + k,
      content: 'item ' + k
    };
  });
};

// drag and drop form creation for client forms

var DragAndDropForm = function (_React$Component) {
  _inherits(DragAndDropForm, _React$Component);

  function DragAndDropForm(props) {
    _classCallCheck(this, DragAndDropForm);

    var _this = _possibleConstructorReturn(this, (DragAndDropForm.__proto__ || Object.getPrototypeOf(DragAndDropForm)).call(this, props));

    _this.state = { items: props.items };
    _this.onDragEnd = _this.onDragEnd.bind(_this);
    return _this;
  }

  _createClass(DragAndDropForm, [{
    key: 'onDragEnd',
    value: function onDragEnd() {
      console.log("on drag end");
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var getItemStyle = function getItemStyle(isDragging, draggableStyle) {
        return Object.assign({
          // some basic styles to make the items look a bit nicer
          userSelect: 'none',

          // change background colour if dragging
          background: isDragging ? 'lightgrey' : 'white'

        }, draggableStyle);
      };

      var getListStyle = function getListStyle(isDraggingOver) {
        return {
          padding: grid,
          width: 500,
          borderRadius: 30
        };
      };

      var grid = 8;
      // if (this.state.liked) {
      //   return React.createElement(
      //     'button', 
      //     { onClick: () => this.setState({ liked: false }) }, 
      //     'Liked'
      //   );
      // }

      // console.log(DragDropContext);
      // return React.createElement(
      //   'DragAndDropContext',
      //   { onClick: () => this.setState({ liked: true }) },
      //   'Like'
      // );

      return React.createElement(
        DragDropContext,
        { onDragEnd: this.onDragEnd },
        React.createElement(
          Droppable,
          { droppableId: 'droppable' },
          function (provided, snapshot) {
            return React.createElement(
              'div',
              {
                ref: provided.innerRef,
                style: getListStyle(snapshot.isDraggingOver)
              },
              _this2.state.items.map(function (item, index) {
                var input = null;
                if (item.inputType === "shortText") {
                  input = React.createElement('input', { disabled: true, type: 'email', 'class': 'form-control', id: 'exampleInputEmail1', 'aria-describedby': 'emailHelp', placeholder: item.placeholder });
                }
                if (item.inputType === "longText") {
                  input = React.createElement('textarea', { disabled: true, 'class': 'form-control', id: 'exampleFormControlTextarea1', rows: '3', placeholder: item.placeholder });
                }
                return React.createElement(
                  Draggable,
                  { key: item.id, draggableId: item.id, index: index },
                  function (provided, snapshot) {
                    return React.createElement(
                      'div',
                      Object.assign({ 'class': 'form-group',
                        ref: provided.innerRef
                      }, provided.draggableProps, provided.dragHandleProps, {
                        style: getItemStyle(snapshot.isDragging, provided.draggableProps.style)
                      }),
                      React.createElement(
                        'label',
                        { 'for': 'exampleInputEmail1' },
                        item.label
                      ),
                      input
                    );
                  }
                );
              }),
              provided.placeholder
            );
          }
        )
      );
    }
  }]);

  return DragAndDropForm;
}(React.Component);

var sampleFormItems = {
  items: [{
    id: 0,
    label: "Name",
    placeholder: "Enter Name",
    inputType: "shortText"
  }, {
    id: 1,
    label: "Email",
    placeholder: "Enter Email",
    inputType: "shortText"
  }, {
    id: 2,
    label: "Comments",
    placeholder: "Provide any additional comments here",
    inputType: "longText"
  }]
};

var domContainer = document.querySelector('.create-form-input-area');
ReactDOM.render(React.createElement(DragAndDropForm, sampleFormItems), domContainer);