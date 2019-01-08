var React = require('react');
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

// drag and drop form creation for client forms
export class DragAndDropForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: props.formItems.items, componentLibrary: props.componentLibrary.items};
    this.onDragEnd = this.onDragEnd.bind(this);
  }


 onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    console.log(result);

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
	    			id: 5, // FIXME
	    			label: 'New Input',
	    			placeholder: 'Placeholder',
	    			inputType: inputTypeMatch[1],
	    		};
	    		console.log("dropping element with input type " + newFormItem.inputType);
	    		let newItems = this.insert(this.state.items, newFormItem, result.destination.index);				
	    		this.setState({items: newItems})
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

  render() {

  	console.log(this.state);

	const getItemStyle = (isDragging, draggableStyle) => ({
	  // some basic styles to make the items look a bit nicer
	  userSelect: 'none',

	  // change background colour if dragging
	  background: isDragging ? 'lightgrey' : 'white',

	  // styles we need to apply on draggables
	  ...draggableStyle,
	});

	const getListStyle = isDraggingOver => ({
	  padding: 8,
	  width: 500,
	  borderRadius: 30,
	});	



    return (
    	<DragDropContext onDragEnd={this.onDragEnd}>
    	  <Droppable droppableId="component-library">
    	  {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
            {this.state.componentLibrary.map((item, index) => {
              	let input = null;
              	let id = "component-library-" + item.inputType;
              	if (item.inputType === "shortText") {
					input = (<input disabled type="email" class="form-control" id={id} aria-describedby="emailHelp" placeholder={item.placeholder}/>);
              	}
              	if (item.inputType === "longText") {
              		input = (<textarea disabled class="form-control" id={id} rows="3" placeholder={item.placeholder}></textarea>);
              	}
              	return(
	                <Draggable key={item.id} draggableId={id} index={index}>
	                  {(provided, snapshot) => (
	   					<div class="form-group"
	                      ref={provided.innerRef}
	                      {...provided.draggableProps}
	                      {...provided.dragHandleProps}
	                      style={getItemStyle(
	                        snapshot.isDragging,
	                        provided.draggableProps.style
	                      )}
	                    >
					     <label for={id}>{item.label}</label>
					     {input}
	                   </div>
	                  )}
	                </Draggable>
	             );
	         })}
              {provided.placeholder}
            </div>
            )}
    	 </Droppable>
    	 <Droppable droppableId="form">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.state.items.map((item, index) => {
              	let input = null;
              	let id = "input" + index;
              	if (item.inputType === "shortText") {
					input = (<input disabled type="email" class="form-control" id={id} aria-describedby="emailHelp" placeholder={item.placeholder}/>);
              	}
              	if (item.inputType === "longText") {
              		input = (<textarea disabled class="form-control" id={id} rows="3" placeholder={item.placeholder}></textarea>);
              	}
              	return(
	                <Draggable key={item.id} draggableId={id} index={index}>
	                  {(provided, snapshot) => (
	   					<div class="form-group"
	                      ref={provided.innerRef}
	                      {...provided.draggableProps}
	                      {...provided.dragHandleProps}
	                      style={getItemStyle(
	                        snapshot.isDragging,
	                        provided.draggableProps.style
	                      )}
	                    >
					     <label for={id}>{item.label}</label>
					     {input}
	                   </div>
	                  )}
	                </Draggable>
	             );
	         })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        </DragDropContext>
    );

  }
}
