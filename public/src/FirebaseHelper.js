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

  generateFormID(uid) {
    return uid + '' + Date.now();
  }

  saveForm(formData) {
    let id = this.generateFormID(this.auth.currentUser.uid);
    formData.id = id;
	   return this.database.ref('forms/' + this.auth.currentUser.uid + '/' + id).set(formData);
  }

  removeForm(id) {
  	return this.database.ref('forms/' + this.auth.currentUser.uid + '/' + id).remove();
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

  getCurrentUserForm(id, callback) {
    this.getUserForm(this.auth.currentUser.uid, id, callback);
  }

  publishForm(id) {
    // generate URL to publish form at
    let formURL = this.auth.currentUser.uid + '/' + id;

    // set form status to published
    const formRef = this.database.ref('/forms/' + formURL);
    formRef.update({'publishStatus': 'published', 'publishURL': formURL});

    // add form to list of publish forms
    let setPublicForm = function(snapshot) {
      this.database.ref('public/' + formURL).set(snapshot.val());  
    };
    setPublicForm = setPublicForm.bind(this);
    formRef.once('value').then(setPublicForm);
    
  }

  getUserForm(userid, id, callback) {
    const formRef = this.database.ref('/forms/' + userid + "/" + id);
    formRef.once('value').then(function(snapshot) {
      callback(snapshot.val());
    }); 
  }
}