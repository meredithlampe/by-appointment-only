var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactDOM = require('react-dom');
import DragAndDropFormUtils from '../../babelOutput/DragAndDropFormUtils.js';

// drag and drop form creation for client forms
export var ViewForm = function (_React$Component) {
  _inherits(ViewForm, _React$Component);

  function ViewForm(props) {
    _classCallCheck(this, ViewForm);

    var _this = _possibleConstructorReturn(this, (ViewForm.__proto__ || Object.getPrototypeOf(ViewForm)).call(this, props));

    _this.firebaseHelper = props.firebaseHelper;
    _this.state = {
      items: []
    };

    // get items in form from databae
    _this.firebaseHelper.getPublicUserForm(props.formHostId, props.id, function (formData) {
      _this.setState({
        items: formData.items
      });
    });
    return _this;
  }

  _createClass(ViewForm, [{
    key: 'onSubmit',
    value: function onSubmit() {}
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'panel panel-default' },
        React.createElement(
          'div',
          {
            className: 'panel-body new-form-panel-body' },
          React.createElement(
            'form',
            { 'class': 'needs-validation' },
            this.state.items.map(function (item, index) {
              var input = null;
              var id = "input" + index;
              input = DragAndDropFormUtils.getInputElementForType(item, id, false);
              return React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement(
                  'div',
                  { style: { display: "flex", flexDirection: "row" } },
                  React.createElement(
                    'label',
                    { className: 'form-component-label', htmlFor: id },
                    item.label
                  )
                ),
                input,
                React.createElement(
                  'div',
                  { className: 'invalid-feedback' },
                  "This field is required."
                )
              );
            }),
            React.createElement(
              'div',
              { className: 'bottom-action-bar', style: { display: "flex", justifyContent: "flex-end" } },
              React.createElement(
                'button',
                { className: 'btn btn-primary btn-md', type: 'submit' },
                'Submit'
              )
            )
          )
        )
      );
    }
  }]);

  return ViewForm;
}(React.Component);