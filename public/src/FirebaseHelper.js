import DragAndDropFormUtils from './DragAndDropFormUtils.js';

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

  generateFormID() {
    let test = this.auth.currentUser.uid + '' + Date.now();
    console.log(test);
    return test;
  }

  saveForm(formData) {
	   return this.database.ref('forms/' + this.auth.currentUser.uid + '/' + formData.id).set(formData);
  }

  removeForm(id) {
  	return this.database.ref('forms/' + this.auth.currentUser.uid + '/' + id).remove();
  }

  setOnFormAdded(onFormAdded, onFormRemoved) {
  	const formsRef = this.database.ref('/forms/' + this.auth.currentUser.uid);
  	this.firebaseRefs.push(formsRef);
  	formsRef.on('child_added', (snapshot) => {
      debugger;
  		onFormAdded(snapshot.val());
    });
    formsRef.on('child_removed', (snapshot) => {
    	onFormRemoved(snapshot.val());
    })
  }

  getCurrentUserForm(id, callback) {
    this.getUserForm(this.auth.currentUser.uid, id, callback);
  }

  publishForm(id, onFinish) {
    let formPath = this.auth.currentUser.uid + '/' + id;

    // generate URL to publish form at
    let formURL = 'viewForm/viewForm.html?u=' + this.auth.currentUser.uid + "&name=" + id;

    // set form status to published
    const formRef = this.database.ref('/forms/' + formPath);
    formRef.update({'publishStatus': 'published', 'publishURL': formURL});

    // add form to list of publish forms
    let setPublicForm = function(onFinish, snapshot) {
      this.database.ref('public/' + formPath).set(snapshot.val());
      onFinish(snapshot.val());  
    };
    setPublicForm = setPublicForm.bind(this, onFinish);
    formRef.once('value').then(setPublicForm);
    
  }

  getUserForm(userid, id, callback) {
    const formRef = this.database.ref('/forms/' + userid + "/" + id);
    formRef.once('value').then(function(snapshot) {
      callback(snapshot.val());
    }); 
  }
}