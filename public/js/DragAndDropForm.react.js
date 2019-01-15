var React = require('react');
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ModalEditFormComponent from './Modal.react.js';

const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

// drag and drop form creation for client forms
export class DragAndDropForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
    	items: props.formItems.items, 
    	componentLibrary: props.componentLibrary.items,
    	name: props.formName,
    	lastUnusedId: props.lastUnusedId,
    	showModalEditComponent: false,
    };
    this.onDragEnd = this.onDragEnd.bind(this);
    this.openModalEditComponent = this.openModalEditComponent.bind(this);
    this.hideModalEditComponent = this.hideModalEditComponent.bind(this);
  }


 onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    if (result.source.droppableId === 'component-library') {
    	if (result.destination.droppableId === 'component-library') {
    		// user is trying to reorder component library? idk. do nothing.
    		return;
    	}
    	if (result.destination.droppableId === 'form') {
    		// user is dragging component library element into form    		
    		// create new item formed like this:
    		// 	{
			//		id: 1,
			//		label: "Email",
			//		placeholder: "Enter Email",
			//		inputType: "shortText",
			//	},
			let inputTypeMatch = result.draggableId.match(/component-library-(.*)/);
			if (inputTypeMatch && inputTypeMatch.length > 1) {
	    		let newFormItem = {
	    			id: this.state.lastUnusedId, // FIXME
	    			label: 'New Input',
	    			placeholder: 'Placeholder',
	    			inputType: inputTypeMatch[1],
	    		};
	    		let newItems = this.insert(this.state.items, newFormItem, result.destination.index);				
	    		this.setState({items: newItems, lastUnusedId: this.state.lastUnusedId + 1,})
			} else {
				//show error
			}
    	}
    }

   	if (result.source.droppableId === 'form') {
   		if (result.destination.droppableId === 'form') {
   			const items = this.reorder(
		      this.state.items,
		      result.source.index,
		      result.destination.index,
		    );
   			this.setState({
		      items,
		    });
   		}
   	}
  }

  insert(list, newItem, destinationIndex) {
  	const result = Array.from(list);
  	result.splice(destinationIndex, 0, newItem);
  	return result;
  }

	reorder(list, startIndex, endIndex) {
	  const result = Array.from(list);
	  const [removed] = result.splice(startIndex, 1);
	  result.splice(endIndex, 0, removed);

	  return result;
	};

	openModalEditComponent() {
		this.setState({showModalEditComponent: true});
	}
	hideModalEditComponent() {
		this.setState({showModalEditComponent: false});
	}

	getInputElementForType(type, id, placeholder) {
		let input = null;
      	if (type === "shortText") {
			input = (<input disabled type="email" className="form-control" id={id} aria-describedby="emailHelp" placeholder={placeholder}/>);
      	}
      	if (type === "longText") {
      		input = (<textarea disabled className="form-control" id={id} rows="3" placeholder={placeholder}></textarea>);
      	}
      	if (type === "fileInput") {
            input = (<input disabled id={id} type="file"/>);
      	}
      	if (type === "staticText") {
      		input = (<p className="text-muted" id={id}>{placeholder}</p>)
      	}
      	if (type === "checkboxes") {
      		input = (
      			<div id={id}>
	                <div className="checkbox">
	                    <label>
	                        <input type="checkbox" value=""/><div className="text-muted">Checkbox 1</div>
	                    </label>
	                </div>
	                <div className="checkbox">
	                    <label>
	                        <input type="checkbox" value=""/><div className="text-muted">Checkbox 2</div>
	                    </label>
	                </div>
	                <div className="checkbox">
	                    <label>
	                        <input type="checkbox" value=""/><div className="text-muted">Checkbox 3</div>
	                    </label>
	                </div>
	             </div>
            );
      	}
      	if (type === 'selects') {
      		input = (                                         
      			<select id={id} className="form-control">
	                <option>1</option>
	                <option>2</option>
	                <option>3</option>
	                <option>4</option>
	                <option>5</option>
                </select>
            );
      	}
      	return input;
	}

  render() {

	const getItemStyle = (isDragging, draggableStyle) => ({
	  userSelect: 'none',
	  marginTop: 20,

	  // styles we need to apply on draggables
	  ...draggableStyle,
	});

	const getListStyle = isDraggingOver => ({
	  width: 300,
	  borderRadius: 30,
	});	
	 // const getRenameFormModal = () => {

  //    	return (
		// <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	 //        <div className="modal-dialog">
	 //            <div className="modal-content">
	 //                <div className="modal-header">
	 //                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
	 //                    <h4 className="modal-title" id="myModalLabel">Create New Form</h4>
	 //                </div>
	 //                <div className="modal-body">
	 //                  <form role="form">
	 //                      <div className="form-group">
	 //                          <label>Name</label>
	 //                          <input className="form-control" placeholder="e.g. December Bookings"></input>
	 //                          <p className="help-block">Only you will see the form name</p>
	 //                      </div>
	 //                      <div className="form-group">
	 //                          <label>Form Content</label>
	 //                          <p className="help-block">Configure how the form will appear for your applicants</p>
	 //                      </div>
	 //                  </form>
	 //                </div>
	 //                <div className="modal-footer">
	 //                    <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
	 //                    <button type="button" className="btn btn-primary">Create Form</button>
	 //                </div>
	 //            </div>
	 //        </div>
	 //     </div>
	 //    );
  //    }

    return (
    	<div style={{display: "flex"}}>
    	  	<ModalEditFormComponent show={this.state.showModalEditComponent}
	          onClose={this.hideModalEditComponent}>
	          Modal content
        	</ModalEditFormComponent>
    	<DragDropContext onDragEnd={this.onDragEnd}>
    	  <Droppable droppableId="component-library">
    	  {(provided, snapshot) => (
    	  	<div className="well">
	    	  	<p className="lead">Form Element Library</p>
	            <div
	              ref={provided.innerRef}
	              style={{
					  width: 300,
					  borderRadius: 30,
					}}
	            >
	            {this.state.componentLibrary.map((item, index) => {
	              	let input = null;
	              	let id = "component-library-" + item.inputType;
	              	input = this.getInputElementForType(item.inputType, id, item.placeholder);
	              	return(
		                <Draggable key={item.id} draggableId={id} index={index}>
		                  {(provided, snapshot) => (
		   					<div className="form-group"
		                      ref={provided.innerRef}
		                      {...provided.draggableProps}
		                      {...provided.dragHandleProps}
		                      style={getItemStyle(
		                        snapshot.isDragging,
		                        provided.draggableProps.style
		                      )}
		                    >
						     <label className="form-component-label" htmlFor={id}>{item.label}<i style={{marginLeft: 5}} className="fa fa-arrows fa-fw"></i></label>
						     {input}
		                   </div>
		                  )}
		                </Draggable>
		             );
		         })}
	              {provided.placeholder}
	            </div>
            </div>
            )}
    	 </Droppable>    
    	 <Droppable droppableId="form">
          {(provided, snapshot) => (
          	<div className="panel panel-default" style={{marginLeft: 40, height: "fit-content"}}>
	            <div
	            className="panel-body new-form-panel-body"
	              ref={provided.innerRef}
	              style={
	              	{
					  width: 500,
					  background: snapshot.isDraggingOver ? '#eaf7ed' : 'white',
					}
					}>
					<p className="lead" data-toggle="modal" data-target="#myModal">
						{this.state.name}
						<small style={{marginLeft: 20}}>
							<a href="#">Rename</a>
						</small>
						<button 
							className="preview-form-link btn btn-outline btn-default" 
							style={{display: "inline", marginLeft: 15, float: "right"}}>
								Preview
						</button>
					</p>
	              {this.state.items.map((item, index) => {
	              	let input = null;
	              	let id = "input" + index;
	              	input = this.getInputElementForType(item.inputType, id, item.placeholder);
	              	return(
		                <Draggable key={item.id} draggableId={id} index={index}>
		                  {(provided, snapshot) => (
		   					<div className="form-group"
		                      ref={provided.innerRef}
		                      {...provided.draggableProps}
		                      {...provided.dragHandleProps}
		                      style={getItemStyle(
		                        snapshot.isDragging,
		                        provided.draggableProps.style
		                      )}
		                    >
		                    <div style={{display: "flex", flexDirection: "row"}}>
			                    <div>
								     <label className="form-component-label" htmlFor={id}>{item.label}</label>
								     <div className="form-component-link" data-toggle="modal" data-target="#exampleModal" onClick={this.openModalEditComponent} style={{display: "inline", marginLeft: 10}}><a>Edit</a></div>
								   	<div className="form-component-link" style={{display: "inline", marginLeft: 10}}><a>Delete</a></div>
							    </div>
							    <div style={{flexGrow: 1}} />
							    <div>
								     <i style={{marginLeft: 5}} className="fa fa-arrows fa-fw"></i>
							    </div>
						     </div>
						     {input}
		                   </div>
		                  )}
		                </Draggable>
		             );
		         })}
	              {provided.placeholder}
	            </div>
	         </div>
          )}
        </Droppable>
        </DragDropContext>
        </div>
    );

  }
}
