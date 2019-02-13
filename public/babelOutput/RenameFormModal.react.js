var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';
import DragAndDropFormUtils from './DragAndDropFormUtils.js';
import FIELD_METADATA from './componentFieldMetadata.js';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

var RenameFormModal = function (_React$Component) {
  _inherits(RenameFormModal, _React$Component);

  function RenameFormModal(props) {
    _classCallCheck(this, RenameFormModal);

    console.log("constructing modal");

    var _this = _possibleConstructorReturn(this, (RenameFormModal.__proto__ || Object.getPrototypeOf(RenameFormModal)).call(this, props));

    _this.state = {
      name: props.name
    };
    return _this;
  }

  _createClass(RenameFormModal, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return (
        // <Modal show={this.props.show} onClose={this.props.onClose}>
        React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { className: 'modal-body' },
            React.createElement(
              'div',
              { className: 'edit-modal-input-preview' },
              React.createElement(
                'label',
                { className: 'form-component-label' },
                'Form Name'
              ),
              React.createElement('input', {
                className: 'form-control',
                value: this.state.name,
                onChange: function onChange(event) {
                  var newValue = event.nativeEvent.target.value;
                  _this2.setState({ name: newValue });
                } })
            )
          )
        )
      );
    }
  }]);

  return RenameFormModal;
}(React.Component);

RenameFormModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  name: PropTypes.string
};

export default RenameFormModal;