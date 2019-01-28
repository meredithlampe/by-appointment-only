var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    key: 'saveForm',
    value: function saveForm(name, formData) {
      return this.database.ref('forms/' + this.auth.currentUser.uid + '/' + name).set(formData);
    }
  }, {
    key: 'removeForm',
    value: function removeForm(name) {
      return this.database.ref('forms/' + this.auth.currentUser.uid + '/' + name).remove();
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
    key: 'getItemsForForm',
    value: function getItemsForForm(name, callback) {
      var formRef = this.database.ref('/forms/' + this.auth.currentUser.uid + "/" + name);
      formRef.once('value').then(function (snapshot) {
        var items = snapshot.val().items;
        console.log("calling callback");
        callback(items);
      });
    }
  }]);

  return FirebaseHelper;
}();

export default FirebaseHelper;