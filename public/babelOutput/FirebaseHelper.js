var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import DragAndDropFormUtils from './DragAndDropFormUtils.js';

var FirebaseHelper = function () {
  /**
    * Initializes this Firebase facade.
    * @constructor
    */
  function FirebaseHelper(firebase) {
    _classCallCheck(this, FirebaseHelper);

    // Firebase SDK.
    this.database = firebase.database();
    this.storage = firebase.storage();
    this.auth = firebase.auth();

    // Firebase references that are listened to.
    this.firebaseRefs = [];
  }

  _createClass(FirebaseHelper, [{
    key: 'setOnAuthStateChanged',
    value: function setOnAuthStateChanged(onAuthStateChanged) {
      this.auth.onAuthStateChanged(onAuthStateChanged);
    }
  }, {
    key: 'isLoggedIn',
    value: function isLoggedIn() {}
  }, {
    key: 'getCurrentUserID',
    value: function getCurrentUserID() {
      return this.auth.currentUser.uid;
    }
  }, {
    key: 'generateFormID',
    value: function generateFormID() {
      var test = this.auth.currentUser.uid + '' + Date.now();
      console.log(test);
      return test;
    }
  }, {
    key: 'saveForm',
    value: function saveForm(formData) {
      var _this = this;

      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var savedForm = this.database.ref('forms/' + this.auth.currentUser.uid + '/' + formData.id).update(formData, function (error) {
        if (error) {
          // do something
        } else {
          // update published form
          _this.getCurrentUserForm(formData.id, function (newFormData) {
            if (newFormData.published) {
              // update published form
              var path = _this.getFormPathForUserAndFormID(_this.auth.currentUser.uid, newFormData.id);
              var formRef = _this.database.ref('/forms/' + formPath);
              _this.updatePublishedForm(path, formRef, callback);
            }
          });
        }
      });
    }
  }, {
    key: 'removeForm',
    value: function removeForm(id) {
      return this.database.ref('forms/' + this.auth.currentUser.uid + '/' + id).remove();
    }
  }, {
    key: 'setOnFormAdded',
    value: function setOnFormAdded(onFormAdded) {
      var formsRef = this.database.ref('/forms/' + this.auth.currentUser.uid);
      this.firebaseRefs.push(formsRef);
      formsRef.on('child_added', function (snapshot) {
        onFormAdded(snapshot.val());
      });
    }
  }, {
    key: 'setOnFormRemoved',
    value: function setOnFormRemoved(onFormRemoved) {
      var formsRef = this.database.ref('/forms/' + this.auth.currentUser.uid);
      formsRef.on('child_removed', function (snapshot) {
        onFormRemoved(snapshot.val());
      });
    }
  }, {
    key: 'setOnFormChanged',
    value: function setOnFormChanged(onFormChanged) {
      var formsRef = this.database.ref('/forms/' + this.auth.currentUser.uid);
      formsRef.on('child_changed', function (snapshot) {
        onFormChanged(snapshot.val());
      });
    }
  }, {
    key: 'getCurrentUserForm',
    value: function getCurrentUserForm(id, callback) {
      this.getUserForm(this.auth.currentUser.uid, id, callback);
    }
  }, {
    key: 'getFormPathForUserAndFormID',
    value: function getFormPathForUserAndFormID(formHostID, formID) {
      return formHostID + '/' + formID;
    }
  }, {
    key: 'publishForm',
    value: function publishForm(id, onFinish) {
      var formPath = this.getFormPathForUserAndFormID(this.auth.currentUser.uid, id);

      // generate URL to publish form at
      var formURL = 'viewForm/viewForm.html?u=' + this.auth.currentUser.uid + "&name=" + id;

      // set form status to published
      var formRef = this.database.ref('/forms/' + formPath);
      formRef.update({ 'publishStatus': 'published', 'publishURL': formURL });
      this.updatePublishedForm(formPath, formRef, onFinish);
    }
  }, {
    key: 'updatePublishedForm',
    value: function updatePublishedForm(formPath, formRef, callback) {
      // add form to list of publish forms
      var setPublicForm = function setPublicForm(onFinish, snapshot) {
        this.database.ref('public/' + formPath).set(snapshot.val());
        onFinish(snapshot.val());
      };
      setPublicForm = setPublicForm.bind(this, callback);
      formRef.once('value').then(setPublicForm);
    }
  }, {
    key: 'unpublishForm',
    value: function unpublishForm(id, onFinish) {
      var formPath = this.auth.currentUser.uid + '/' + id;

      // set form status to published
      var formRef = this.database.ref('/forms/' + formPath);
      formRef.update({ 'publishStatus': 'unpublished', 'publishURL': '' });

      // remove form from list of publish forms
      var setPublicForm = function setPublicForm(onFinish, snapshot) {
        this.database.ref('public/' + formPath).remove();
        onFinish(snapshot.val());
      };
      setPublicForm = setPublicForm.bind(this, onFinish);
      formRef.once('value').then(setPublicForm);
    }
  }, {
    key: 'getUserForm',
    value: function getUserForm(userid, id, callback) {
      var formRef = this.database.ref('/forms/' + userid + "/" + id);
      formRef.once('value').then(function (snapshot) {
        callback(snapshot.val());
      });
    }
  }, {
    key: 'getFormSubmissions',
    value: function getFormSubmissions(formHostId, formId, callback) {
      var formRef = this.database.ref('/submissions/' + formHostId + "/" + formId);
      formRef.once('value').then(function (snapshot) {
        callback(snapshot.val());
      });
    }
  }, {
    key: 'setOnSubmissionAdded',
    value: function setOnSubmissionAdded(onSubmissionAdded, formHostId, formId) {
      var submissionsRef = this.database.ref('/submissions/' + formHostId + "/" + formId).orderByChild('time');
      this.firebaseRefs.push(submissionsRef);
      submissionsRef.on('child_added', function (snapshot) {
        onSubmissionAdded(snapshot.val());
      });
    }
  }, {
    key: 'setOnSubmissionFieldAdded',
    value: function setOnSubmissionFieldAdded(onFieldAdded, formHostId, formId, submissionId) {
      var fieldsRef = this.database.ref('/submissions/' + formHostId + "/" + formId + "/" + submissionId + "/fields/");
      this.firebaseRefs.push(fieldsRef);
      fieldsRef.on('child_added', function (snapshot) {
        onFieldAdded(snapshot);
      });
    }
  }, {
    key: 'getPublicUserForm',
    value: function getPublicUserForm(userid, id, callback) {
      var formRef = this.database.ref('/public/' + userid + "/" + id);
      formRef.once('value').then(function (snapshot) {
        callback(snapshot.val());
      });
    }
  }, {
    key: 'uploadFileForForm',
    value: function uploadFileForForm(formHostId, formID, submissionID, inputId, file, callback) {
      console.log("saving file to " + formHostId + "/" + formID + "/" + submissionID + "/" + inputId);
      var storageRef = firebase.storage().ref();
      var fileRef = storageRef.child(formHostId + "/" + formID + "/" + submissionID + "/" + inputId);
      fileRef.put(file).then(function (snapshot) {
        callback(snapshot);
      });
    }
  }, {
    key: 'getFileForForm',
    value: function getFileForForm(formHostId, formID, submissionID, inputId, callback, errorHandler) {
      var storageRef = firebase.storage().ref();
      var fileRef = storageRef.child(formHostId + "/" + formID + "/" + submissionID + "/" + inputId);
      fileRef.getDownloadURL().then(function (url) {
        callback(url);
      }, errorHandler);
    }
  }, {
    key: 'cloneForm',
    value: function cloneForm(formHostId, formId, callback) {
      this.getUserForm(formHostId, formId, function (oldFormData) {
        firebaseHelper.saveForm({
          id: firebaseHelper.generateFormID(),
          name: oldFormData.name + ' (1)',
          items: oldFormData.items,
          lastEdited: DragAndDropFormUtils.getTodaysDate()
        }, callback);
      });
    }
  }]);

  return FirebaseHelper;
}();

export default FirebaseHelper;