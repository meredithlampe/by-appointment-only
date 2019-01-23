import React from 'react';
import PropTypes from 'prop-types';
import DragAndDropFormUtils from './DragAndDropFormUtils.js';
import FIELD_METADATA from './componentFieldMetadata.js';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

class EditModal extends React.Component {
  constructor(props) {
    super(props);
    let item = props.item;
    this.state = { 
      item: props.item, 
    };
  }

  getHelpTextForField(field) {
    if (field === 'options') {
      return 'Input options as comma-separated list. Ex: \'Monday, Tuesday, Wednesday\'';
    }
    return null;
  }

  parseInputForField(fieldContent, field) {
    if (field === 'options') {
      let options = fieldContent.explode(',');
      return options;
    }
    return fieldContent;
  }

  render() {
    let editingItem = this.state.item;
    return (
      <Modal show={this.props.show} onClose={this.props.onClose}>
        <Modal.Header>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-body">
            <div className="edit-modal-input-preview">
                <label className="form-component-label">{editingItem ? editingItem.label : null}</label>
                    {editingItem ? DragAndDropFormUtils.getInputElementForType(editingItem, 100) : null}
                  </div>
              </div>
              <hr/>
              <div style={{margin: 20}}>
                <p className="text-muted">Change the fields below to see how the form element will look above.</p>
                {editingItem ? DragAndDropFormUtils.getEditableFieldsForInputType(editingItem.inputType).map(editableField => {
                  let helpText = this.getHelpTextForField(editableField);
                  return (
                    <div key={editableField}>
                      <label className="form-component-label edit-form-component-field-label">{FIELD_METADATA[editableField].label}</label>
                      <input 
                        className="form-control" 
                        value={editingItem[editableField]}
                        onChange={event => {
                          let newValue = event.nativeEvent.target.value;
                          let newItem = JSON.parse(JSON.stringify(this.state.item));
                          newItem[editableField] = newValue;
                          this.setState({item: newItem});
                        }} />
                    </div>
                    );
                }) : null}
              </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onClose}>Close</Button>
          <Button bsStyle="primary">Save changes</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

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
        editable: PropTypes.array,
  }),
  itemID: PropTypes.string,
};

export default EditModal;