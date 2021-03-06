	var React = require('react');	
var ReactDOM = require('react-dom');

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import EditModal from './EditModal.react.js';
import RenameFormModal from './RenameFormModal.react.js';
import ConfirmCloseModal from './ConfirmCloseModal.react.js';
import DeleteModal from './DeleteModal.react.js';
import DragAndDropFormUtils from './DragAndDropFormUtils.js';
import FormPreview from './FormPreview.react.js';
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
    this.databaseID = props.databaseID;
    this.state = {
    	items: [],
    	name: '',
    	lastUnusedId: -1,
    	showModalEditComponent: false,
    	showModalRenameForm: false,
    	showModalDeleteComponent: false,
    	editingItem: null,
    	lastSavedForm: {
	    	items: [],
	    	name: '',
    	},
    };
    this.onDragEnd = this.onDragEnd.bind(this);
    this.openModalEditComponent = this.openModalEditComponent.bind(this);
    this.openModalEditComponentForHTMLID = this.openModalEditComponentForHTMLID.bind(this);
    this.hideModalEditComponent = this.hideModalEditComponent.bind(this);
    this.openModalRenameForm = this.openModalRenameForm.bind(this);
    this.hideModalRenameForm = this.hideModalRenameForm.bind(this);
    this.openModalDeleteComponent = this.openModalDeleteComponent.bind(this);
    this.hideModalDeleteComponent = this.hideModalDeleteComponent.bind(this);
    this.setFormName = this.setFormName.bind(this);
    this.saveForm = this.saveForm.bind(this);

    this.editModal = React.createRef();

    let maybeClose = function() {
		if (this.formHasPendingChanges()) {
		 	// show 'are you sure' dialog
		 	$("#confirmCloseEditModal").modal("show");
		 	return;
		}
		this.close();
	};
	maybeClose = maybeClose.bind(this);
	this.maybeClose = maybeClose;

    // get items in form from databae
    if (!props.newForm) {
	    this.firebaseHelper.getCurrentUserForm(props.databaseID, (formData) => {
	     	this.setState({
	     		name: formData.name,
	     		lastUnusedId: formData.lastUnusedId !== undefined ? formData.lastUnusedId : 0,
	     		items: formData.items,
	     		lastSavedForm: {
	     			items: DragAndDropFormUtils.jsonDeepCopy(formData.items),
	     			name: formData.name,
	     		},
	     	});
	     });
    } else {
    	// is new form
    	this.state.name = 'My New Form';
    	this.state.lastUnusedId = 0;
    }
  }

  close() {
	// navigate back to main screen
	$('.create-form').addClass('hidden');
	$('.home').removeClass('hidden');

	// clear new form page
	const formInputArea = document.querySelector('.create-form');
	ReactDOM.unmountComponentAtNode(formInputArea);
  }

  componentDidMount() {
    // configure preview link
    let previewLink = $('.preview-form-link');
    previewLink.attr("href", "/viewForm/viewForm.html?u=" + this.firebaseHelper.getCurrentUserID() + "&name=" + this.databaseID);
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
				let newId = this.state.lastUnusedId;
	    		let newFormItem = {
	    			id: newId,
	    			idCopy: newId,
	    			label: 'New Input',
	    			placeholder: 'Placeholder',
	    			inputType: inputType,
	    			options: componentNeedsOptions ? ['Option1', 'Option2', 'Option3'] : null,
	    			content: componentNeedsContent ? 'Description of this field' : null,
	    		};
	    		let newItems = this.insert(this.state.items, newFormItem, result.destination.index);				

	    		this.setState(
	    			{items: newItems, lastUnusedId: this.state.lastUnusedId + 1,}, 	   
		    		() => {
			    		// auto-open edit modal when new field is added
			    		$("#editFormComponentModal").modal('show');
		    			this.openModalEditComponent(newId);	
		    		},
		    	); 		
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

	  remove(list, item) {
	  	const result = Array.from(list);
	  	let index = result.indexOf(item);
	  	if (index !== -1) {
	  		result.splice(index, 1);
	  	}
	  	return [index, result];
	  }

	reorder(list, startIndex, endIndex) {
	  const result = Array.from(list);
	  const [removed] = result.splice(startIndex, 1);
	  result.splice(endIndex, 0, removed);

	  return result;
	};

	// itemId, ex: "edit-5"
	openModalEditComponentForHTMLID(itemId) {
		let id = itemId.match(/edit-(.*)/);
		this.openModalEditComponent(parseInt(id[1]));
	}

	// ex: 5
	openModalEditComponent(numericId) {
		let editingItem = this.getItemForId(numericId);
		this.setState({showModalEditComponent: true, editingItem: editingItem});
	}

	hideModalEditComponent() {
		this.setState({showModalEditComponent: false, editingItem: null});
		const editModal = document.querySelector('.edit-form-component-react-container');
		ReactDOM.unmountComponentAtNode(editModal);
	}

	openModalDeleteComponent(itemId) {
		let id = itemId.match(/delete-(.*)/);
		let deleteItem = this.getItemForId(parseInt(id[1]));
		this.setState({showModalDeleteComponent: true, deletingItem: deleteItem});
		const deleteModal = document.querySelector('.delete-form-component-react-container');
		ReactDOM.render(
			React.createElement(DeleteModal, {
				show: this.state.showModalDeleteComponent,
				item: deleteItem,
				onClose: this.hideModalDeleteComponent,
				onDelete: () => { 
						let newItems = this.remove(this.state.items, this.state.deletingItem)[1];
						this.setState({items: newItems});
						this.hideModalDeleteComponent();
					},
				},
			),
			deleteModal,
		);
	}

	hideModalDeleteComponent() {
		this.setState({showModalDeleteComponent: false, deletingItem: null});
		const deleteModal = document.querySelector('.delete-form-component-react-container');
		ReactDOM.unmountComponentAtNode(deleteModal);
	}

	openModalRenameForm() {
		const renameModal = document.querySelector('.rename-form-react-container');
		ReactDOM.render(React.createElement(RenameFormModal, {
			show: this.state.showModalRenameForm,
			name: this.state.name,
			onClose: this.hideModalRenameForm,
			onSave: this.setFormName,
		}), renameModal);
	}

	hideModalRenameForm() {
		this.setState({showModalRenameForm: false});
		const renameModal = document.querySelector('#renameFormModal');
		ReactDOM.unmountComponentAtNode(renameModal);
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
			{
				id: this.databaseID,
				items: this.state.items,
				name: this.state.name,
				lastEdited: DragAndDropFormUtils.getTodaysDate(),
				lastUnusedId: this.state.lastUnusedId,
			});

		// dangerous--looks like we've saved the items before the round trip is actually finished
		this.setState({
			lastSavedForm: {
				items: DragAndDropFormUtils.jsonDeepCopy(this.state.items),
				name: this.state.name,
			}
		})
	}

	formHasPendingChanges() {

		// compare form names
		if (this.state.lastSavedForm.name !== this.state.name) {
			return true;
		}

		// compare length of forms
		let hasSameNumberOfFormItems = this.state.items.length === this.state.lastSavedForm.items.length;
		if (!hasSameNumberOfFormItems) {
			return true;
		}

		// compare individual items within forms
		for (let ii = 0; ii < this.state.items.length; ii++) {
			if (JSON.stringify(this.state.items[ii]) !== JSON.stringify(this.state.lastSavedForm.items[ii])) {
				return true;
			}
		}

		// current form is the same as the last saved form
		return false;
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

    return (
    	<div>
    	<div className="row">
        	<div className="col-2">
               <div className="create-form-cancel" style={{textAlign: "right", cursor: "pointer"}} onClick={this.maybeClose}>
                    <h4>
                    	<i style={{marginLeft: 5}} className="fa fa-arrow-left fa-fw"></i> Back
                    </h4>
                </div>
              </div>
              <div className="col-sm-6 mb-4">
                Drag elements from the form component library on the left to your form on the right.
                You many also rearrange components within your form by dragging them.
              </div>
             <div class="col-sm-4"></div>
           </div>
    	<div className="row create-form-input-area">
        	<div className="col-sm-1"></div>
             <div class="col-sm-10 create-form-column">
		<div style={{display: "flex", margin: "auto"}}>
    		<div className="modal" id="editFormComponentModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
	        		<EditModal
			    		item={this.state.editingItem}
			    		onClose={this.hideModalEditComponent}
			    		onSave={(newItem) => {
							let removeResult = this.remove(this.state.items, this.state.editingItem);
							let index = removeResult[0];
							let result = removeResult[1];
							this.setState({items: this.insert(result, newItem, index), showModalEditComponent: false});
						}}
						show={this.state.showModalEditComponent}
			    	/> 
		  	</div>

		  	 <div className="modal" id="confirmCloseEditModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
		  	 	<ConfirmCloseModal confirm={this.close} />
		  	</div>
	    
    	<DragDropContext onDragEnd={this.onDragEnd}>
    	  <Droppable droppableId="component-library">
    	  {(provided, snapshot) => (
    	  	<div className="card shadow">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">Form Element Library</h6>
                 </div>
	            <div
	            	className="card-body"
	              ref={provided.innerRef}
	            >
	            {COMPONENT_LIBRARY.map((item, index) => {
	              	let input = null;
	              	let id = "component-library-" + item.inputType;
	              	input = DragAndDropFormUtils.getInputElementForType(item, id);
	              	return(
		                <Draggable key={item.id} draggableId={id} index={index}>
		                  {(provided, snapshot) => (
		   					<div className="form-group card mb-4 py-3 border-left-primary shadow"
		                      ref={provided.innerRef}
		                      {...provided.draggableProps}
		                      {...provided.dragHandleProps}
		                      style={getItemStyle(
		                        snapshot.isDragging,
		                        provided.draggableProps.style
		                      )}
		                    >
		                    <div style={{paddingLeft: 15, paddingRight: 15}}>
							     <label 
							     	className="form-component-label d-flex flex-row justify-content-between" 
							     	htmlFor={id} style={{width: "100%"}}>
						     		{item.label}
							     	<i style={{marginLeft: 5}} className="fa fa-arrows-alt fa-fw"></i>
							     </label>
							     {input}
						     </div>
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
          	<div 
          		className="panel panel-default col-sm-7 card shadow" 
          		id="form-drop-zone"
          		style={{marginLeft: 40, height: "fit-content",  background: snapshot.isDraggingOver ? '#eaf7ed' : 'white',}}>
	            <div
	            className="panel-body new-form-panel-body d-flex flex-column"
	              ref={provided.innerRef}
	              style={
	              	{
					 
					}
					}>
					<div className="d-flex">
						<div className="form-title"><h4>{this.state.name}</h4></div>
						<div className="form-controls-container">
							<div className="rename-form-link"
								onClick={this.openModalRenameForm}
								data-toggle="modal"
								data-target="#renameFormModal">
								<a>Rename</a>
							</div>
							<a className="preview-form-link btn btn-outline-secondary"
								target="_blank"
								href="">
								Preview
							</a>
							<button 
								disabled={!this.formHasPendingChanges()} 
								onClick={this.saveForm} 
								type="button" 
								className="save-form-button btn btn-primary">
								Save
							</button>
						</div>

					</div>
				<form>
					{this.state.items.length === 0 ? 
						<div className="drag-components-here">
							Drag components from the left side here
						</div> : null}
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
		                    	<label className="form-component-label" htmlFor={id}>{item.label}</label>
							    <div style={{flexGrow: 1}} />
							    <div style={{minWidth: 130}} className="form-component-edit-delete-move-icons-container">
							    	<div 
								     	className="form-component-link" 
								     	data-toggle="modal" 
								     	data-target="#editFormComponentModal" 
								     	onClick={(target) => {
								     		this.openModalEditComponentForHTMLID(target.nativeEvent.target.id);
								     	}} 
								     	style={{display: "inline", marginLeft: 10}}><a id={'edit-' + item.id}>Edit</a></div>
								   	<div 
								   		className="form-component-link"
								     	data-toggle="modal" 
								     	data-target="#deleteFormComponentModal" 								   		
								   		style={{display: "inline", marginLeft: 10}}
								   		onClick={(target) => {
								   			this.openModalDeleteComponent(target.nativeEvent.target.id);
								   		}}>
								   		<a id={'delete-' + item.id}>Delete</a>
								   	</div>
								     <i style={{marginLeft: 5}} className="fa fa-arrows-alt fa-fw"></i>
							    </div>
						     </div>
						     {input}
		                   </div>
		                  )}
		                </Draggable>
		             );
		         })}
		         </form>
	              {provided.placeholder}
	            </div>
	         </div>
          )}
        </Droppable>
        </DragDropContext>
        </div>
        </div>
        <div className="col-sm-1"></div>
        </div>
        </div>
    );

  }
}
