import React from 'react';
import PropTypes from 'prop-types';
import DragAndDropFormUtils from './DragAndDropFormUtils.js';
import FIELD_METADATA from './componentFieldMetadata.js';
import Button from 'react-bootstrap/lib/Button';

class FormPreview extends React.Component {
  constructor(props) {
    super(props);
    this.fetchFormItems = this.fetchFormItems.bind(this);
    this.firebaseHelper = this.props.firebaseHelper;
    this.formHostID = this.props.formHostID;
    this.id = this.props.formID;
    this.fetchFormItems();
    this.state = {
      loading: true,
      items: [],
    };
  }

  fetchFormItems() {
    firebaseHelper.getUserForm(this.formHostID, this.id, (form) => {
      this.setState({items: form.items, loading: false});
    });
  }

  render() {
    console.log("rendering form preview");
    let content = <div>loading</div>;
    if (!this.state.loading) {
      let items = this.state.items;
      let itemComponents = items.map((item) => { 
        let id = 200;
        let component =  
          (<div className="form-group">
            <label className="form-component-label" htmlFor={id}>{item.label}</label>
            {DragAndDropFormUtils.getInputElementForType(item, id)}
          </div>); 
        return component;
      });
      content = 
        (<div>
          {itemComponents}
        </div>);
    }
    return (            
      <div>
        <div className="row">
          <div className="col-lg-12 preview-form-header">
            <h2 className="page-header">Preview Form<small style={{marginLeft: 20}}><a onClick={this.props.onClose} className='create-form-cancel'>Cancel</a></small></h2>
          </div>
          <div className="col-lg-8">
            <p className="lead">This is how your form will appear.</p>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <div className="panel panel-default">
              <div className="panel-body">
                <div className="form-preview">
                  {content}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


FormPreview.propTypes = {
  onClose: PropTypes.func.isRequired,
  formName: PropTypes.string,
};

export default FormPreview;