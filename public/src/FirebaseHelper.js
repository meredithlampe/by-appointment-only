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

  saveForm(name, formData) {
	 return this.database.ref('forms/' + this.auth.currentUser.uid + '/' + DragAndDropFormUtils.getSafeName(name)).set(formData);
  }

  removeForm(name) {
  	return this.database.ref('forms/' + this.auth.currentUser.uid + '/' + DragAndDropFormUtils.getSafeName(name)).remove();
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
    this.getItemsForUserForm(this.auth.currentUser.uid, name, callback);
  }

  publishForm(name) {
    // generate URL to publish form at
    let safeName = DragAndDropFormUtils.getSafeName(name);
    let formURL = this.auth.currentUser.uid + '/' + safeName;

    // set form status to published
    const formRef = this.database.ref('/forms/' + this.auth.currentUser.uid + '/' + safeName);
    formRef.update({'publishStatus': 'published', 'publishURL': formURL});

    // add form to list of publish forms
    let setPublicForm = function(snapshot) {
      this.database.ref('public/' + this.auth.currentUser.uid + '/' + safeName).set(snapshot.val());  
    };
    setPublicForm = setPublicForm.bind(this);
    formRef.once('value').then(setPublicForm);
    
  }

  getFormForUser(userid, name, callback) {
    const formRef = this.database.ref('/forms/' + userid + "/" + DragAndDropFormUtils.getSafeName(name));
    formRef.once('value').then(function(snapshot) {
      let formData = snapshot.val();
      callback(formData);
    });
  }

  getItemsForUserForm(userid, name, callback) {
    const formRef = this.database.ref('/forms/' + userid + "/" + DragAndDropFormUtils.getSafeName(name));
    formRef.once('value').then(function(snapshot) {
      let items = snapshot.val().items;
      callback(items);
    }); 
  }
}