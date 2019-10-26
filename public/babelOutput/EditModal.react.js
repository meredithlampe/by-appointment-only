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

    console.log("in constructor");

    var _this = _possibleConstructorReturn(this, (EditModal.__proto__ || Object.getPrototypeOf(EditModal)).call(this, props));

    var item = props.item;
    _this.props = props;
    _this.state = {
      item: props.item,
      itemID: props.itemID
    };

    // let onCloseFunction = function (props, e) {
    //   console.log("in on close");
    //   debugger;
    //   props.onClose();
    // };
    // onCloseFunction = onCloseFunction.bind(null, props);
    // $('#editFormComponentModal').on('hidden.bs.modal', function() {console.log("in close")});
    // $('#editFormComponentModal').find('modal-dialog').on('hidden.bs.modal', function() {console.log("in close")});

    // $(document).on('hide.bs.modal', '#editFormComponentModal', function() {
    //     console.log("in on close");
    //     debugger;
    //     props.onClose();
    // });
    return _this;
  }

  _createClass(EditModal, [{
    key: 'setItem',
    value: function setItem(item) {
      this.setState({ item: item });
    }
  }, {
    key: 'getHelpTextForInputType',
    value: function getHelpTextForInputType(inputType, editableField) {
      if (editableField === 'options' && (inputType === 'checkboxes' || inputType === 'selects')) {
        return 'Input options as comma-separated list. Ex: \'Monday, Tuesday, Wednesday\'';
      }
      return null;
    }
  }, {
    key: 'parseInputForField',
    value: function parseInputForField(fieldContent, field) {
      if (field === 'options') {
        var options = fieldContent.split(',');
        return options;
      }
      return fieldContent;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      if (this.props.item.id !== this.state.item.id) {
        // opened modal to edit new field but haven't updated state
        // bc constructor wasn't hit
        this.setState({ item: this.props.item });
      }
      var editingItem = this.state.item;
      if (!editingItem) {
        return null;
      }
      return React.createElement(
        'div',
        { className: 'edit-modal-input-preview' },
        React.createElement(
          'div',
          { style: { margin: 20 } },
          React.createElement(
            'label',
            { className: 'form-component-label' },
            editingItem ? editingItem.label : null
          ),
          editingItem ? DragAndDropFormUtils.getInputElementForType(editingItem, 100) : null
        ),
        React.createElement('hr', null),
        React.createElement(
          'div',
          { style: { margin: 20 } },
          React.createElement(
            'p',
            { className: 'text-muted', style: { fontSize: "14px" } },
            'Change the fields below to see how the form element will look above.'
          ),
          editingItem ? DragAndDropFormUtils.getEditableFieldsForInputType(editingItem.inputType).map(function (editableField) {
            var helpText = _this2.getHelpTextForInputType(editingItem.inputType, editableField);
            var onInputChange = function onInputChange(event) {
              var newValue = event.nativeEvent.target.value;
              var newItem = JSON.parse(JSON.stringify(_this2.state.item));
              newItem[editableField] = _this2.parseInputForField(newValue, editableField);
              _this2.setState({ item: newItem });
            };
            onInputChange = onInputChange.bind(_this2);
            return React.createElement(
              'div',
              { key: editableField },
              React.createElement(
                'label',
                { className: 'form-component-label edit-form-component-field-label' },
                FIELD_METADATA[editableField].label
              ),
              React.createElement('input', {
                className: 'form-control',
                value: editingItem[editableField],
                onChange: onInputChange }),
              React.createElement(
                'p',
                { className: 'text-muted', style: { fontSize: "14px" } },
                helpText
              )
            );
          }) : null
        ),
        React.createElement(
          'div',
          { className: 'modal-footer' },
          React.createElement(
            Button,
            { 'data-dismiss': 'modal' },
            'Close'
          ),
          React.createElement(
            Button,
            { 'data-dismiss': 'modal', onClick: function onClick() {
                _this2.props.onSave(_this2.state.item);
              }, bsStyle: 'primary' },
            'Save changes'
          )
        )
      );
    }
  }]);

  return EditModal;
}(React.Component);

EditModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
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