import React from 'react';
import PropTypes from 'prop-types';
import DragAndDropFormUtils from './DragAndDropFormUtils.js';
import FIELD_METADATA from './componentFieldMetadata.js';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

class RenameFormModal extends React.Component {
  constructor(props) {
    console.log("constructing modal");
    super(props);
    this.state = { 
      name: props.name, 
    };
  }

  render() {
    return (
      // <Modal show={this.props.show} onClose={this.props.onClose}>
      <div>
          <div className="modal-body">
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