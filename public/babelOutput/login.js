// authentication - sign in button
var signInButton = document.getElementById('sign-in-button');
signInButton.addEventListener('click', function () {
	var provider = new firebase.auth.GoogleAuthProvider();
	firebase.auth().signInWithPopup(provider);
});

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
	firebase.auth().onAuthStateChanged(onAuthStateChanged);

	try {
		var app = firebase.app();
		var features = ['auth', 'database'].filter(function (feature) {
			return typeof app[feature] === 'function';
		});
	} catch (e) {
		console.error(e);
	}
});

/**
 * Triggers every time there is a change in the Firebase auth state (i.e. user signed-in or user signed out).
 */
function onAuthStateChanged(user) {
	if (user) {
		currentUID = user.uid;

		// uesr has just signed in. redirect to home page.
		window.location.href = "index2.html";
	}
}