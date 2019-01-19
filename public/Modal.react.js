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

var EditModal = function (_React$Component) {
  _inherits(EditModal, _React$Component);

  function EditModal(props) {
    _classCallCheck(this, EditModal);

    var _this = _possibleConstructorReturn(this, (EditModal.__proto__ || Object.getPrototypeOf(EditModal)).call(this, props));

    console.log("item in props");
    console.log(props.item);
    var item = props.item;
    _this.state = {
      item: props.item
    };
    return _this;
  }

  _createClass(EditModal, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var editingItem = this.state.item;
      return React.createElement(
        Modal,
        { show: this.props.show, onHide: this.hideModalEditComponent },
        React.createElement(
          Modal.Header,
          null,
          React.createElement(
            Modal.Title,
            null,
            'Modal title'
          )
        ),
        React.createElement(
          Modal.Body,
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
                editingItem ? editingItem.label : null
              ),
              editingItem ? DragAndDropFormUtils.getInputElementForType(editingItem.inputType, 100, editingItem.placeholder) : null
            )
          ),
          React.createElement('hr', null),
          React.createElement(
            'div',
            { style: { margin: 20 } },
            React.createElement(
              'p',
              { 'class': 'text-muted' },
              'Change the fields below to see how the form element will look above.'
            ),
            editingItem ? DragAndDropFormUtils.getEditableFieldsForInputType(editingItem.inputType).map(function (editableField) {
              return React.createElement(
                'div',
                null,
                React.createElement(
                  'label',
                  { className: 'form-component-label edit-form-component-field-label' },
                  FIELD_METADATA[editableField].label
                ),
                React.createElement('input', {
                  className: 'form-control',
                  value: editingItem[editableField],
                  onChange: function onChange(event) {
                    var newValue = event.nativeEvent.target.value;
                    var newItem = JSON.parse(JSON.stringify(_this2.state.item));
                    newItem[editableField] = newValue;
                    _this2.setState({ item: newItem });
                  } })
              );
            }) : null
          )
        ),
        React.createElement(
          Modal.Footer,
          null,
          React.createElement(
            Button,
            { onClick: this.props.onClose },
            'Close'
          ),
          React.createElement(
            Button,
            { bsStyle: 'primary' },
            'Save changes'
          )
        )
      );
    }
  }]);

  return EditModal;
}(React.Component);

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  title: PropTypes.string,
  item: PropTypes.shape({
    inputType: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    content: PropTypes.string,
    options: PropTypes.array,
    editable: PropTypes.array
  }),
  itemID: PropTypes.string
};

export default EditModal;