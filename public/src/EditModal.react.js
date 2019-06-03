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
      let options = fieldContent.split(',');
      return options;
    }
    return fieldContent;
  }

  render() {
    let editingItem = this.state.item;
    return (
            <div className="edit-modal-input-preview">
                <div style={{margin: 20}}>
                  <label className="form-component-label">{editingItem ? editingItem.label : null}</label>
                  {editingItem ? DragAndDropFormUtils.getInputElementForType(editingItem.inputType, editingItem.placeholder, 100) : null}
                </div>
              <hr/>
              <div style={{margin: 20}}>
                <p className="text-muted">Change the fields below to see how the form element will look above.</p>
                {editingItem ? DragAndDropFormUtils.getEditableFieldsForInputType(editingItem.inputType).map(editableField => {
                  let helpText = this.getHelpTextForField(editableField);
                  let onInputChange = (event) => {
                          let newValue = event.nativeEvent.target.value;
                          let newItem = JSON.parse(JSON.stringify(this.state.item));
                          newItem[editableField] = this.parseInputForField(newValue, editableField);
                          this.setState({item: newItem});
                        };
                  onInputChange = onInputChange.bind(this);
                  return (
                    <div key={editableField}>
                      <label className="form-component-label edit-form-component-field-label">{FIELD_METADATA[editableField].label}</label>
                      <input 
                        className="form-control" 
                        value={editingItem[editableField]}
                        onChange={onInputChange} />
                    </div>
                    );
                }) : null}
              </div>
        <div className="modal-footer">
          <Button data-dismiss="modal" onClick={this.props.onClose}>Close</Button>
          <Button data-dismiss="modal" onClick={() => {this.props.onSave(this.state.item)}} bsStyle="primary">Save changes</Button>
        </div>
      </div>
    );
  }
}

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
        editable: PropTypes.array,
  }),
  itemID: PropTypes.string,
};

export default EditModal;