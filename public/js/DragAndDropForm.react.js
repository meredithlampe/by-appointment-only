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
    this.state = { items: props.items };
    this.onDragEnd = this.onDragEnd.bind(this);
  }


 onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = this.reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items,
    });
  }


	// a little function to help us with reordering the result
	reorder(list, startIndex, endIndex) {
	  const result = Array.from(list);
	  const [removed] = result.splice(startIndex, 1);
	  result.splice(endIndex, 0, removed);

	  return result;
	};

  render() {

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
    	 <Droppable droppableId="droppable">
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
