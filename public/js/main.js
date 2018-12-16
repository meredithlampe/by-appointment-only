
			// hide all components initially
			cleanupUI();
			transitionToScreen('sign-in');

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
			}

			function transitionToScreen(className) {
				$('.' + className).show();
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
