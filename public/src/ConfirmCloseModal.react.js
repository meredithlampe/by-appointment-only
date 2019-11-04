import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

class ConfirmCloseModal extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }

  render() {
    return (
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Unsaved Changes</h5>
            <button className="close dismiss-confirm-close-modal" type="button" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body"> 
            You have unsaved changes to this form. Are you sure you want to go back?
          </div>
          <div className="modal-footer">
            <Button data-dismiss="modal" bsStyle="primary">Cancel</Button>
            <Button data-dismiss="modal" className="btn btn-secondary" onClick={this.props.confirm}>Discard Changes</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ConfirmCloseModal;