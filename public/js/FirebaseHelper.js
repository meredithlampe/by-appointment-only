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

  saveForm(name, formData) {
	return this.database.ref('forms/' + this.auth.currentUser.uid + '/' + name).set(formData);
  }

  removeForm(name) {
  	return this.database.ref('forms/' + this.auth.currentUser.uid + '/' + name).remove();
  }

  setOnFormAdded(onFormAdded, onFormRemoved) {
  	const formsRef = this.database.ref('/forms/' + this.auth.currentUser.uid);
	this.firebaseRefs.push(formsRef);
	formsRef.on('child_added', (snapshot) => {
		onFormAdded(snapshot.val());
    });
    formsRef.on('child_removed', (snapshot) => {
    	onFormRemoved(snapshot.val());
    })
  }

  getItemsForForm(name, callback) {
    const formRef = this.database.ref('/forms/' + this.auth.currentUser.uid + "/" + name);
    formRef.once('value').then(function(snapshot) {
		let items = snapshot.val().items;
		console.log("calling callback");
		callback(items);
    });	
  }
}