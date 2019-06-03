var React = require('react');	
var ReactDOM = require('react-dom');

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import EditModal from './EditModal.react.js';
import RenameFormModal from './RenameFormModal.react.js';
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
    this.hideModalEditComponent = this.hideModalEditComponent.bind(this);
    this.openModalRenameForm = this.openModalRenameForm.bind(this);
    this.hideModalRenameForm = this.hideModalRenameForm.bind(this);
    this.openModalDeleteComponent = this.openModalDeleteComponent.bind(this);
    this.hideModalDeleteComponent = this.hideModalDeleteComponent.bind(this);
    this.setFormName = this.setFormName.bind(this);
    this.saveForm = this.saveForm.bind(this);
    this.showPreview = this.showPreview.bind(this);
    this.hidePreview = this.hidePreview.bind(this);

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

	openModalEditComponent(itemId) {
		let id = itemId.match(/edit-(.*)/);
		let editingItem = this.getItemForId(parseInt(id[1]));
		this.setState({showModalEditComponent: true, editingItem: editingItem});
		const editModal = document.querySelector('.edit-form-component-react-container');
		ReactDOM.render(React.createElement(EditModal, {
			show: this.state.showModalEditComponent,
			item: editingItem,
			onClose: this.hideModalEditComponent,
			onSave: (newItem) => {
				let removeResult = this.remove(this.state.items, this.state.editingItem);
				let index = removeResult[0];
				let result = removeResult[1];
				this.setState({items: this.insert(result, newItem, index), showModalEditComponent: false});
			},
		}), editModal);
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

	showPreview() {
		// construct form preview
		const formPreviewArea = document.querySelector('.applicant-forms-preview-form');
		let props = {
			formName: this.state.name,
			firebaseHelper: this.firebaseHelper,
			onClose: this.hidePreview,
		};
		ReactDOM.render(React.createElement(FormPreview, props), formPreviewArea);

		// show preview
		$('.applicant-forms-create-form').hide();
		$('.applicant-forms-preview-form').show();
	}
	hidePreview() {
		$('.applicant-forms-preview-form').hide();	
		$('.applicant-forms-create-form').show();
		const formPreviewArea = document.querySelector('.applicant-forms-preview-form');
		ReactDOM.unmountComponentAtNode(formInputArea);
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
    	<div style={{display: "flex", margin: "auto"}}>
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
	              	input = DragAndDropFormUtils.getInputElementForType(item.inputType, item.placeholder, id);
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
          		style={{marginLeft: 40, height: "fit-content"}}>
	            <div
	            className="panel-body new-form-panel-body d-flex flex-column"
	              ref={provided.innerRef}
	              style={
	              	{
					  background: snapshot.isDraggingOver ? '#eaf7ed' : 'white',
					}
					}>
					<h4>
						{this.state.name}
						<small style={{marginLeft: 20}}>
							<div style={{display: "inline"}}
								onClick={this.openModalRenameForm}
								data-toggle="modal"
								data-target="#renameFormModal">
								<a>Rename</a>
							</div>
						</small>
						<div style={{float: "right"}}>
							<button 
								onClick={this.showPreview}
								className="preview-form-link btn btn-outline btn-default" 
								style={{display: "inline", marginLeft: 15}}>
									Preview
							</button>
							<button disabled={!this.formHasPendingChanges()} onClick={this.saveForm} type="button" className="save-form-button btn btn-primary">Save</button>
						</div>
					</h4>
				<form>
					{this.state.items.length === 0 ? 
						<div className="drag-components-here">
							Drag components from the left side here
						</div> : null}
	              {this.state.items.map((item, index) => {
	              	let input = null;
	              	let id = "input" + index;
	              	input = DragAndDropFormUtils.getInputElementForType(item.inputType, item.placeholder, id);
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
								     	data-target="#editFormComponentModal" 
								     	onClick={(target) => {
								     		this.openModalEditComponent(target.nativeEvent.target.id);
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
							    </div>
							    <div style={{flexGrow: 1}} />
							    <div>
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
    );

  }
}
