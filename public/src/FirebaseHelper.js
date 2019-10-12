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

  isLoggedIn() {
    
  }

  getCurrentUserID() {
    return this.auth.currentUser.uid;
  }

  generateFormID() {
    let test = this.auth.currentUser.uid + '' + Date.now();
    console.log(test);
    return test;
  }

  saveForm(formData, callback = null) {
	   let savedForm = this.database.ref('forms/' + this.auth.currentUser.uid + '/' + formData.id)
      .update(formData, (error) => {
        if (error) {
          // do something
        } else {
          // update published form
          this.getCurrentUserForm(formData.id, (newFormData) => {
            if (newFormData.published) {
              // update published form
              let path = this.getFormPathForUserAndFormID(this.auth.currentUser.uid, newFormData.id);
              const formRef = this.database.ref('/forms/' + formPath);
              this.updatePublishedForm(path, formRef, callback);
            }
          });
        }
      });
  }

  removeForm(id) {
  	return this.database.ref('forms/' + this.auth.currentUser.uid + '/' + id).remove();
  }

  setOnFormAdded(onFormAdded) {
  	const formsRef = this.database.ref('/forms/' + this.auth.currentUser.uid);
  	this.firebaseRefs.push(formsRef);
  	formsRef.on('child_added', (snapshot) => {
  		onFormAdded(snapshot.val());
    });
  }

  setOnFormRemoved(onFormRemoved) {
    const formsRef = this.database.ref('/forms/' + this.auth.currentUser.uid);
    formsRef.on('child_removed', (snapshot) => {
      onFormRemoved(snapshot.val());
    });    
  }

  setOnFormChanged(onFormChanged) {
    const formsRef = this.database.ref('/forms/' + this.auth.currentUser.uid);
    formsRef.on('child_changed', (snapshot) => {
      onFormChanged(snapshot.val());
    });
  }

  getCurrentUserForm(id, callback) {
    this.getUserForm(this.auth.currentUser.uid, id, callback);
  }

  getFormPathForUserAndFormID(formHostID, formID) {
    return formHostID + '/' + formID;
  }

  publishForm(id, onFinish) {
    let formPath = this.getFormPathForUserAndFormID(this.auth.currentUser.uid, id);

    // generate URL to publish form at
    let formURL = 'viewForm/viewForm.html?u=' + this.auth.currentUser.uid + "&name=" + id;

    // set form status to published
    const formRef = this.database.ref('/forms/' + formPath);
    formRef.update({'publishStatus': 'published', 'publishURL': formURL});
    this.updatePublishedForm(formPath, formRef, onFinish);
  }

  updatePublishedForm(formPath, formRef, callback) {
    // add form to list of publish forms
    let setPublicForm = function(onFinish, snapshot) {
      this.database.ref('public/' + formPath).set(snapshot.val());
      onFinish(snapshot.val());  
    };
    setPublicForm = setPublicForm.bind(this, callback);
    formRef.once('value').then(setPublicForm);     
  }

  unpublishForm(id, onFinish) {
    let formPath = this.auth.currentUser.uid + '/' + id;

    // set form status to published
    const formRef = this.database.ref('/forms/' + formPath);
    formRef.update({'publishStatus': 'unpublished', 'publishURL': ''});

    // remove form from list of publish forms
    let setPublicForm = function(onFinish, snapshot) {
      this.database.ref('public/' + formPath).remove();
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

  getFormSubmissions(formHostId, formId, callback) {
      const formRef = this.database.ref('/submissions/' + formHostId + "/" + formId);
      formRef.once('value').then(function(snapshot) {
        callback(snapshot.val());
    });  
  }

  setOnSubmissionAdded(onSubmissionAdded, formHostId, formId) {
    const submissionsRef = this.database.ref('/submissions/' + formHostId + "/" + formId).orderByChild('time');
    this.firebaseRefs.push(submissionsRef);
    submissionsRef.on('child_added', (snapshot) => {
      onSubmissionAdded(snapshot.val());
    });
  }

  setOnSubmissionFieldAdded(onFieldAdded, formHostId, formId, submissionId) {
    const fieldsRef = this.database.ref(
      '/submissions/' + formHostId + "/" + formId + "/" + submissionId + "/fields/",
    );
    this.firebaseRefs.push(fieldsRef);
    fieldsRef.on('child_added', (snapshot) => {
      onFieldAdded(snapshot);
    });
  }

  getPublicUserForm(userid, id, callback) {
    const formRef = this.database.ref('/public/' + userid + "/" + id);
    formRef.once('value').then(function(snapshot) {
      callback(snapshot.val());
    });     
  }

  uploadFileForForm(formHostId, formID, submissionID, inputId, file, callback) {
    console.log("saving file to " + formHostId + "/" + formID + "/" + submissionID + "/" + inputId)
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(formHostId + "/" + formID + "/" + submissionID + "/" + inputId);
    fileRef.put(file).then(function(snapshot) {
      callback(snapshot);
    });
  }

  getFileForForm(formHostId, formID, submissionID, inputId, callback, errorHandler) {
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(formHostId + "/" + formID + "/" + submissionID + "/" + inputId);
    fileRef.getDownloadURL().then((url) => {callback(url); }, errorHandler);
  }
  
}