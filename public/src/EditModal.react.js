import React from 'react';
import PropTypes from 'prop-types';
import DragAndDropFormUtils from './DragAndDropFormUtils.js';
import FIELD_METADATA from './componentFieldMetadata.js';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

class EditModal extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};

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
  }

  setItem(item) {
    this.setState({item: item});
  }

  getHelpTextForInputType(inputType, editableField) {
    if (editableField === 'options' && (inputType === 'checkboxes' || inputType === 'selects')) {
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
    if (!this.props.item) {
      return null;
    } else if (this.props.item && !this.state.item || (this.props.item.id !== this.state.item.id)) {
      // opened modal to edit new field but haven't updated state
      // bc constructor wasn't hit
      this.setState({item: this.props.item});
    }
    let editingItem = this.state.item;
    if (!editingItem) {
      return null;
    }
    return (
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Edit</h5>
            <button className="close dismiss-edit-modal" type="button" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body edit-form-component-react-container"> 
            <div className="edit-modal-input-preview">
              <div style={{margin: 20}}>
                <label className="form-component-label">{editingItem ? editingItem.label : null}</label>
                {editingItem ? DragAndDropFormUtils.getInputElementForType(editingItem, 100) : null}
              </div>
              <hr/>
              <div style={{margin: 20}}>
                <p className="text-muted" style={{fontSize: "14px"}}>Change the fields below to see how the form element will look above.</p>
                {editingItem ? DragAndDropFormUtils.getEditableFieldsForInputType(editingItem.inputType).map(editableField => {
                  let helpText = this.getHelpTextForInputType(editingItem.inputType, editableField);
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
                      <p className="text-muted" style={{fontSize: "14px"}}>{helpText}</p>
                    </div>
                    );
                }) : null}
              </div>
            <div className="modal-footer">
              <Button data-dismiss="modal">Close</Button>
              <Button data-dismiss="modal" onClick={() => {this.props.onSave(this.state.item)}} bsStyle="primary">Save changes</Button>
            </div>
          </div>
        </div>
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
};

export default EditModal;