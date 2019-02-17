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
    key: 'generateFormID',
    value: function generateFormID() {
      var test = this.auth.currentUser.uid + '' + Date.now();
      console.log(test);
      return test;
    }
  }, {
    key: 'saveForm',
    value: function saveForm(formData) {
      return this.database.ref('forms/' + this.auth.currentUser.uid + '/' + formData.id).set(formData);
    }
  }, {
    key: 'removeForm',
    value: function removeForm(id) {
      return this.database.ref('forms/' + this.auth.currentUser.uid + '/' + id).remove();
    }
  }, {
    key: 'setOnFormAdded',
    value: function setOnFormAdded(onFormAdded, onFormRemoved) {
      var formsRef = this.database.ref('/forms/' + this.auth.currentUser.uid);
      this.firebaseRefs.push(formsRef);
      formsRef.on('child_added', function (snapshot) {
        onFormAdded(snapshot.val());
      });
      formsRef.on('child_removed', function (snapshot) {
        onFormRemoved(snapshot.val());
      });
    }
  }, {
    key: 'getCurrentUserForm',
    value: function getCurrentUserForm(id, callback) {
      this.getUserForm(this.auth.currentUser.uid, id, callback);
    }
  }, {
    key: 'publishForm',
    value: function publishForm(id) {
      // generate URL to publish form at
      var formURL = this.auth.currentUser.uid + '/' + id;

      // set form status to published
      var formRef = this.database.ref('/forms/' + formURL);
      formRef.update({ 'publishStatus': 'published', 'publishURL': formURL });

      // add form to list of publish forms
      var setPublicForm = function setPublicForm(snapshot) {
        this.database.ref('public/' + formURL).set(snapshot.val());
      };
      setPublicForm = setPublicForm.bind(this);
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
  }]);

  return FirebaseHelper;
}();

export default FirebaseHelper;