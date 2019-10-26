var React = require('react');	
var ReactDOM = require('react-dom');
import DragAndDropFormUtils from '../../babelOutput/DragAndDropFormUtils.js';

export class ViewForm extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.firebaseHelper = props.firebaseHelper;
    this.formID = props.id;
    this.submissionID = props.submissionID;
    this.formHostId = props.formHostId;
    this.state = { 
        loading: true, 
    		items: [],
    	};

     // bind handlers
     this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  fetchFormItems() {
    debugger;
      let props = this.props;
     // get items in form from databsae
     this.firebaseHelper.getPublicUserForm(props.formHostId, props.id, (formData) => {
      if (formData) {
        this.setState({
          items: formData.items,
          loading: false,
        });
      } else {
         // form not found. possibly because form hasn't been published.
        // check if viewer is form host
        this.firebaseHelper.getCurrentUserForm(props.id, (formData) => {
            if (formData) {
              this.setState({
                items: formData.items,
                loading: false,
              });                  
            } else {
                // show error message
            }
        });
      }
     });
  }

  handleFileUpload(event) {
    let file = event.target.files[0];
    let id = event.target.id;

    this.firebaseHelper.uploadFileForForm(
      this.formHostId, 
      this.formID, 
      this.submissionID, 
      "fileInput" + id, 
      file,
      (snapshot) => {
        debugger;
      });
  }

  render() {
    if (this.state.loading) {
      this.fetchFormItems();
      return (<div className="text-center">Loading...</div>);
    }
    return (<div>
	              {this.state.items.map((item, index) => {
	              	let input = null;
	              	let id = "-id-" + item.id;
	              	input = 
                    DragAndDropFormUtils.getInputElementForType(
                      item, 
                      id, 
                      false, 
                      false,
                      this.handleFileUpload, 
                      "view-form"
                    );
	              	return(
	   					     <div className="form-group">
		                  <div style={{display: "flex", flexDirection: "row"}}>
								        <label className="form-component-label" htmlFor={id}>{item.label}</label>
						          </div>
						          {input}
	                 </div>
		              );}		                
		             )
		         }
		       <div className="bottom-action-bar" style={{display: "flex", justifyContent: "flex-end"}}>
	              <button className="btn btn-primary btn-md" type="submit">Submit</button>
	          </div>	
     </div>
	);
  }
}
