import React from 'react';
import PropTypes from 'prop-types';
import DragAndDropFormUtils from './DragAndDropFormUtils.js';
import FIELD_METADATA from './componentFieldMetadata.js';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

class DeleteModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let item = this.props.item;
    return (
      <div>
        <div className="modal-body">
          <div className="edit-modal-input-preview">
            <label className="form-component-label">{item ? item.label : null}</label>
            {item ? DragAndDropFormUtils.getInputElementForType(item, 100) : null}
          </div>
        </div>
        <hr/>
        <div style={{margin: 20}}>
          <p className="text-muted">Delete this component?</p>
        </div>
        <div className="modal-footer">
          <Button onClick={this.props.onClose}>Close</Button>
          <Button onClick={() => {this.props.onDelete(item)}} data-dismiss="modal" bsStyle="primary">Delete</Button>
        </div>
      </div>
    );
  }
}

DeleteModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  item: PropTypes.shape({
        inputType: PropTypes.string,
        label: PropTypes.string,
        placeholder: PropTypes.string,
        content: PropTypes.string,
        options: PropTypes.array,
        editable: PropTypes.array,
  }),
};

export default DeleteModal;