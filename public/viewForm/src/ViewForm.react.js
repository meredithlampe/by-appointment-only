var React = require('react');	
var ReactDOM = require('react-dom');
import DragAndDropFormUtils from '../../babelOutput/DragAndDropFormUtils.js';

// drag and drop form creation for client forms
export class ViewForm extends React.Component {
  constructor(props) {
    super(props);
    this.firebaseHelper = props.firebaseHelper;
    this.formID = props.id;
    this.formHostId = props.formHostId;
    this.state = { 
    		items: [],
    	};

    // get items in form from databae
     this.firebaseHelper.getPublicUserForm(props.formHostId, props.id, (formData) => {
     	this.setState({
     		items: formData.items,
     	});
     }); 

     // bind handlers
     this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  handleFileUpload(event) {
    let file = event.target.files[0];
    let id = event.target.id;
    this.firebaseHelper.uploadFileForForm(this.formHostId, this.formID, 'testsubmissionID', id, file);
  }

  render() {
    return (<div>
	              {this.state.items.map((item, index) => {
	              	let input = null;
	              	let id = "input" + index;
	              	input = DragAndDropFormUtils.getInputElementForType(item, id, false, this.handleSelectedFile, this.handleFileUpload);
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
