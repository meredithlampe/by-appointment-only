export default class FirebaseHelper {
	/**
   * Initializes this Firebase facade.
   * @constructor
   */
  constructor(firebase) {
    // Firebase SDK.
    this.database = firebase.database();
    this.storage = firebase.storage();
    this.auth = firebase.auth();

    // Firebase references that are listened to.
    this.firebaseRefs = [];
  }

  setOnAuthStateChanged(onAuthStateChanged) {
  	this.auth.onAuthStateChanged(onAuthStateChanged);
  }

  saveForm(name, items) {
	return this.database.ref('forms/' + this.auth.currentUser.uid + '/' + name).push(items);
  }

  setOnFormAdded(onFormAdded) {
  	const formsRef = this.database.ref('/forms/' + this.auth.currentUser.uid);
	this.firebaseRefs.push(formsRef);
	formsRef.on('child_added', (formData) => {
		onFormAdded(formData);
    });
  }
}