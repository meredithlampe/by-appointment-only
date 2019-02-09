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
     this.firebaseHelper.getItemsForUserForm(props.formHostId, props.name, (items) => {
     	this.setState({
     		items: items,
     	});
     }); 
  }

  render() {

    return (
          	<div className="panel panel-default" style={{padding: 10}}>
	            <div
	            className="panel-body new-form-panel-body"
	              style={
	              	{
					  width: 500,
					  background: 'white',
					}
					}>
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
