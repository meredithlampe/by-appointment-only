import React from 'react';
import COMPONENT_LIBRARY from './componentLibrary.js';

export default class DragAndDropFormUtils {

	static 	getLabelForInputElementType(type) {
		for(let vv = 0; vv < COMPONENT_LIBRARY.length; vv++) {
			let component = COMPONENT_LIBRARY[vv];
			if (component.inputType === type) {
				return component.label;
			}
		}
		return null;
	}

	static getInputElementForType(item, inputId) {
		let type = item.inputType;
		let placeholder = item.placeholder;
		let id = inputId;
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
      		input = (<p className="text-muted" id={id}>{item.content}</p>)
      	}
      	if (type === "checkboxes") {
      		input = (
      			<div id={id}>
      				{
      				item.options.map(option => {
      					return (
			        		<div className="checkbox">
			                    <label>
			                        <input type="checkbox" value=""/><div className="text-muted">{option}</div>
			                    </label>
			                </div>
			             );
			         })
			     }
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

	static getEditableFieldsForInputType(inputType) {
		let found = COMPONENT_LIBRARY.find(function(item) {
			return item.inputType === inputType;
		});
		return found.editable;
	}

	static getTodaysDate() {
		let today = new Date();
		let dd = today.getDate();
		let mm = today.getMonth() + 1; //January is 0!
		let yyyy = today.getFullYear();

		if (dd < 10) {
		  dd = '0' + dd;
		}

		if (mm < 10) {
		  mm = '0' + mm;
		}

		return mm + '-' + dd + '-' + yyyy; 
	}
}	