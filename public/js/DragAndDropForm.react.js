var React = require('react');	

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import EditModal from './EditModal.react.js';
import RenameFormModal from './RenameFormModal.react.js';
import DragAndDropFormUtils from './DragAndDropFormUtils.js';
import COMPONENT_LIBRARY from './componentLibrary.js';
import FIELD_METADATA from './componentFieldMetadata.js';

const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

// drag and drop form creation for client forms
export class DragAndDropForm extends React.Component {
  constructor(props) {
    super(props);
    this.firebaseHelper = props.firebaseHelper;
    this.state = { 
    	items: [],
    	name: props.formName,
    	lastUnusedId: props.lastUnusedId,
    	showModalEditComponent: false,
    	showModalRenameForm: false,
    	editingItem: null,
    };
    this.onDragEnd = this.onDragEnd.bind(this);
    this.openModalEditComponent = this.openModalEditComponent.bind(this);
    this.hideModalEditComponent = this.hideModalEditComponent.bind(this);
    this.openModalRenameForm = this.openModalRenameForm.bind(this);
    this.hideModalRenameForm = this.hideModalRenameForm.bind(this);
    this.setFormName = this.setFormName.bind(this);
    this.saveForm = this.saveForm.bind(this);

    // get items in form from databae
     this.firebaseHelper.getItemsForForm(props.formName, (items) => {
     	this.setState({items: items});
     }); 
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
				let inputType = inputTypeMatch[1];
				let componentNeedsOptions = inputType === 'checkboxes' || inputType === 'selects';
				let componentNeedsContent = inputType === 'checkboxes' || inputType=== 'selects' || inputType === 'staticText';
	    		let newFormItem = {
	    			id: this.state.lastUnusedId,
	    			idCopy: this.state.lastUnusedId,
	    			label: 'New Input',
	    			placeholder: 'Placeholder',
	    			inputType: inputType,
	    			options: componentNeedsOptions ? ['Option1', 'Option2', 'Option3'] : null,
	    			content: componentNeedsContent ? 'Description of this field' : null,
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

	openModalEditComponent(itemId) {
		let id = itemId.match(/edit-(.*)/);
		let editingItem = this.getItemForId(parseInt(id[1]));
		this.setState({showModalEditComponent: true, editingItem: editingItem});
	}
	hideModalEditComponent() {
		this.setState({showModalEditComponent: false, editingItem: null});
	}

	openModalRenameForm() {
		this.setState({showModalRenameForm: true});
	}

	hideModalRenameForm() {
		this.setState({showModalRenameForm: false});
	}
	setFormName(name) {
		this.setState({name: name});
	}

	getItemForId(id) {
		for(let ii = 0; ii < this.state.items.length; ii++) {
			let item = this.state.items[ii];
			if (item.id === id) {
				return item;
			}
		}
		return null;
	}

	saveForm() {
		this.firebaseHelper.saveForm(
			this.state.name, 
			{
				items: this.state.items,
				name: this.state.name,
				lastEdited: DragAndDropFormUtils.getTodaysDate(),
			});
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

	let editingItem = this.state.editingItem;
	let editModal = this.state.showModalEditComponent ? 
		<EditModal 
			show={this.state.showModalEditComponent} 
			item={editingItem} 
			onClose={this.hideModalEditComponent} /> 
		: null;

	let renameModal = this.state.showModalRenameForm ?
		<RenameFormModal 
			show={this.state.showModalRenameForm}
			name={this.state.name} 
			onClose={this.hideModalRenameForm} 
			onSave={this.setFormName}
		/> : null;

    return (
    	<div style={{display: "flex"}}>
	  	  {editModal}
	  	  {renameModal}
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
	            {COMPONENT_LIBRARY.map((item, index) => {
	              	let input = null;
	              	let id = "component-library-" + item.inputType;
	              	input = DragAndDropFormUtils.getInputElementForType(item, id);
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
					<p className="lead">
						{this.state.name}
						<small style={{marginLeft: 20}}>
							<div style={{display: "inline"}}
								onClick={this.openModalRenameForm}>
								<a>Rename</a>
							</div>
						</small>
						<div style={{float: "right"}}>
							<button 
								className="preview-form-link btn btn-outline btn-default" 
								style={{display: "inline", marginLeft: 15}}>
									Preview
							</button>
							<button onClick={this.saveForm} type="button" class="save-form-button btn btn-primary">Save</button>
						</div>
					</p>
	              {this.state.items.map((item, index) => {
	              	let input = null;
	              	let id = "input" + index;
	              	input = DragAndDropFormUtils.getInputElementForType(item, id);
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
								     <div 
								     	className="form-component-link" 
								     	data-toggle="modal" 
								     	data-target="#exampleModal" 
								     	onClick={(target) => {
								     		this.openModalEditComponent(target.nativeEvent.target.id);
								     	}} 
								     	style={{display: "inline", marginLeft: 10}}><a id={'edit-' + item.id}>Edit</a></div>
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
