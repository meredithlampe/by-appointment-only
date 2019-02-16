import React from 'react';
import PropTypes from 'prop-types';
import DragAndDropFormUtils from './DragAndDropFormUtils.js';
import FIELD_METADATA from './componentFieldMetadata.js';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

class RenameFormModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      name: props.name, 
    };
    this.onSave = this.onSave.bind(this);
  }

  onSave() {
    this.props.onSave(this.state.name);
  }


  render() {
    return (
      <div>
          <div className="edit-modal-input-preview">
              <label className="form-component-label">Form Name</label>
              <input 
                className="form-control" 
                value={this.state.name} 
                onChange={event => {
                  let newValue = event.nativeEvent.target.value;
                  this.setState({name: newValue});
                }}/>
          </div>
        <div className="modal-footer">
            <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
            <div id="rename-modal-save-button" class="btn btn-primary" data-dismiss="modal" onClick={this.onSave}>Save Changes</div>
        </div>
      </div>
    );
  }
}

RenameFormModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  name: PropTypes.string,
};

export default RenameFormModal;