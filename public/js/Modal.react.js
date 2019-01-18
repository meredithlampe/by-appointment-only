import React from 'react';
import PropTypes from 'prop-types';
import DragAndDropFormUtils from './DragAndDropFormUtils.js';
import FIELD_METADATA from './componentFieldMetadata.js';

class Modal extends React.Component {
  constructor(props) {
    super(props);
    console.log("item in props");
    console.log(props.itemID);
    let item = props.item;
    this.state = { 
      item: props.item, 
    };
  }

  render() {
    console.log("item in modal");
    let item = this.state.item;
    console.log(this.props.itemID);
    return (
      <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" style={{display: "inline"}} id="exampleModalLabel">{this.props.title}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="edit-modal-input-preview">
                <label className="form-component-label">{item.label}</label>
                {DragAndDropFormUtils.getInputElementForType(item.inputType, 100, item.placeholder)}
              </div>
              <hr/>
              <div style={{margin: 20}}>
                <p class="text-muted">Change the fields below to see how the form element will look above.</p>
                {DragAndDropFormUtils.getEditableFieldsForInputType(this.props.item.inputType).map(editableField => {
                  return (
                    <div>
                      <label className="form-component-label edit-form-component-field-label">{FIELD_METADATA[editableField].label}</label>
                      <input 
                        className="form-control" 
                        value={item[editableField]}
                        onChange={event => {
                          console.log(event.nativeEvent.target.value);
                          let newValue = event.nativeEvent.target.value;
                          let newItem = this.state.item;
                          newItem[editableField] = newValue;
                          this.setState({item: newItem});
                        }} />
                    </div>
                    );
                })}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
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

export default Modal;