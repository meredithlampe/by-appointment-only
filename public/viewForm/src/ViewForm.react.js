var React = require('react');	
var ReactDOM = require('react-dom');
import DragAndDropFormUtils from '../../babelOutput/DragAndDropFormUtils.js';

// drag and drop form creation for client forms
export class ViewForm extends React.Component {
  constructor(props) {
    super(props);
    this.firebaseHelper = props.firebaseHelper;
    this.state = { 
    		items: [],
    	};

    // get items in form from databae
     this.firebaseHelper.getPublicUserForm(props.formHostId, props.id, (formData) => {
     	this.setState({
     		items: formData.items,
     	});
     }); 
  }

  onSubmit() {

  }

  render() {
    return (<div className="panel panel-default">
            <div
            className="panel-body new-form-panel-body">
              {this.state.items.map((item, index) => {
              	let input = null;
              	let id = "input" + index;
              	input = DragAndDropFormUtils.getInputElementForType(item, id, false);
              	return(
   					<div className="form-group">
	                    <div style={{display: "flex", flexDirection: "row"}}>
		                    <div>
							     <label className="form-component-label" htmlFor={id}>{item.label}</label>
						    </div>
					     </div>
					     {input}
					     <div className="invalid-feedback">{"This field is required."}</div>
                   </div>
	                  )}		                
	             )
	         }
	       <div className="bottom-action-bar" style={{display: "flex", justifyContent: "flex-end"}}>
              <button className="btn btn-primary btn-md" type="submit">Submit</button>
          </div>	
     	</div>
     </div>
	);
  }
}
