var React = require('react');
var DND = require('react-beautiful-dnd');
var ReactDOM = require('react-dom');
// import { DragDropContext, Droppable, Draggable } from '../node_modules/react-beautiful-dnd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
	$('.applicant-forms-home').hide();
	$('.applicant-forms-create-form').show();
});

// cancel create new form
let cancelNewForm = $('.create-form-cancel').click(function() {
	$('.applicant-forms-create-form').hide();
	$('.applicant-forms-home').show();
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
    show($('.'+tabName));
  }

		// handle page load
  document.addEventListener('DOMContentLoaded', function() {
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
      let app = firebase.app();
      let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
    } catch (e) {
      console.error(e);
      document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
    }
  });



const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));




// drag and drop form creation for client forms
class DragAndDropForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: props.items };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd() { console.log("on drag end"); }

  render() {

	const getItemStyle = (isDragging, draggableStyle) => ({
	  // some basic styles to make the items look a bit nicer
	  userSelect: 'none',

	  // change background colour if dragging
	  background: isDragging ? 'lightgrey' : 'white',

	  // styles we need to apply on draggables
	  ...draggableStyle,
	});

	const getListStyle = isDraggingOver => ({
	  padding: grid,
	  width: 500,
	  borderRadius: 30,
	});	

	const grid = 8;
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

    return (
    	<DragDropContext onDragEnd={this.onDragEnd}>
    	 <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.state.items.map((item, index) => {
              	let input = null;
              	if (item.inputType === "shortText") {
					input = (<input disabled type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder={item.placeholder}/>);
              	}
              	if (item.inputType === "longText") {
              		input = (<textarea disabled class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder={item.placeholder}></textarea>);
              	}
              	return(
	                <Draggable key={item.id} draggableId={item.id} index={index}>
	                  {(provided, snapshot) => (
	   					<div class="form-group"
	                      ref={provided.innerRef}
	                      {...provided.draggableProps}
	                      {...provided.dragHandleProps}
	                      style={getItemStyle(
	                        snapshot.isDragging,
	                        provided.draggableProps.style
	                      )}
	                    >
					     <label for="exampleInputEmail1">{item.label}</label>
					     {input}
	                   </div>
	                  )}
	                </Draggable>
	             );
	         })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        </DragDropContext>
    );

  }
}

let sampleFormItems = {
	items: [
		{
			id: 0,
			label: "Name",
			placeholder: "Enter Name",
			inputType: "shortText",
		},
		{
			id: 1,
			label: "Email",
			placeholder: "Enter Email",
			inputType: "shortText",
		},
		{
			id: 2,
			label: "Comments",
			placeholder: "Provide any additional comments here",
			inputType: "longText",
		},
	],
};

const domContainer = document.querySelector('.create-form-input-area');
ReactDOM.render(React.createElement(DragAndDropForm, sampleFormItems), domContainer);
