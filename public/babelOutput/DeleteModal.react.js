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

var DeleteModal = function (_React$Component) {
  _inherits(DeleteModal, _React$Component);

  function DeleteModal(props) {
    _classCallCheck(this, DeleteModal);

    return _possibleConstructorReturn(this, (DeleteModal.__proto__ || Object.getPrototypeOf(DeleteModal)).call(this, props));
  }

  _createClass(DeleteModal, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var item = this.props.item;
      return React.createElement(
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
              item ? item.label : null
            ),
            item ? DragAndDropFormUtils.getInputElementForType(item, 100) : null
          )
        ),
        React.createElement('hr', null),
        React.createElement(
          'div',
          { style: { margin: 20 } },
          React.createElement(
            'p',
            { className: 'text-muted' },
            'Delete this component?'
          )
        ),
        React.createElement(
          'div',
          { className: 'modal-footer' },
          React.createElement(
            Button,
            { onClick: this.props.onClose },
            'Close'
          ),
          React.createElement(
            Button,
            { onClick: function onClick() {
                _this2.props.onDelete(item);
              }, 'data-dismiss': 'modal', bsStyle: 'primary' },
            'Delete'
          )
        )
      );
    }
  }]);

  return DeleteModal;
}(React.Component);

DeleteModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  item: PropTypes.shape({
    inputType: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    content: PropTypes.string,
    options: PropTypes.array,
    editable: PropTypes.array
  })
};

export default DeleteModal;