var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';
import DragAndDropFormUtils from './DragAndDropFormUtils.js';
import FIELD_METADATA from './componentFieldMetadata.js';
import Button from 'react-bootstrap/lib/Button';

var FormPreview = function (_React$Component) {
  _inherits(FormPreview, _React$Component);

  function FormPreview(props) {
    _classCallCheck(this, FormPreview);

    var _this = _possibleConstructorReturn(this, (FormPreview.__proto__ || Object.getPrototypeOf(FormPreview)).call(this, props));

    _this.fetchFormItems = _this.fetchFormItems.bind(_this);
    _this.firebaseHelper = _this.props.firebaseHelper;
    _this.name = _this.props.formName;
    _this.fetchFormItems();
    _this.state = {
      loading: true,
      items: []
    };
    return _this;
  }

  _createClass(FormPreview, [{
    key: 'fetchFormItems',
    value: function fetchFormItems() {
      var _this2 = this;

      firebaseHelper.getItemsForForm(this.name, function (items) {
        _this2.setState({ items: items, loading: false });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var content = React.createElement(
        'div',
        null,
        'loading'
      );
      if (!this.state.loading) {
        var items = this.state.items;
        var itemComponents = items.map(function (item) {
          var id = 200;
          var component = React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement(
              'label',
              { className: 'form-component-label', htmlFor: id },
              item.label
            ),
            DragAndDropFormUtils.getInputElementForType(item, id)
          );
          return component;
        });
        content = React.createElement(
          'div',
          null,
          itemComponents
        );
      }
      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col-lg-12 preview-form-header' },
            React.createElement(
              'h2',
              { className: 'page-header' },
              'Preview Form',
              React.createElement(
                'small',
                { style: { marginLeft: 20 } },
                React.createElement(
                  'a',
                  { onClick: this.props.onClose, className: 'create-form-cancel' },
                  'Cancel'
                )
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'col-lg-8' },
            React.createElement(
              'p',
              { className: 'lead' },
              'This is how your form will appear.'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col-lg-6' },
            React.createElement(
              'div',
              { className: 'panel panel-default' },
              React.createElement(
                'div',
                { className: 'panel-body' },
                React.createElement(
                  'div',
                  { className: 'form-preview' },
                  content
                )
              )
            )
          )
        )
      );
    }
  }]);

  return FormPreview;
}(React.Component);

FormPreview.propTypes = {
  onClose: PropTypes.func.isRequired,
  formName: PropTypes.string
};

export default FormPreview;