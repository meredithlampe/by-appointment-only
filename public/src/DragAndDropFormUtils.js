import React from 'react';
import COMPONENT_LIBRARY from './componentLibrary.js';

export default class DragAndDropFormUtils {

	static jsonDeepCopy(object) {
		return JSON.parse(JSON.stringify(object));
	}

	static getSafeName(name) {
		return name.replace(/\s/g, '-');
	}

	static 	getLabelForInputElementType(type) {
		for(let vv = 0; vv < COMPONENT_LIBRARY.length; vv++) {
			let component = COMPONENT_LIBRARY[vv];
			if (component.inputType === type) {
				return component.label;
			}
		}
		return null;
	}

	static getInputElementForType(item, inputId, disabled = true, required = false) {
		let type = item.inputType;
		let placeholder = item.placeholder;
		let id = inputId;
		let result = null;
      	if (type === "shortText") {
			result = (<input 
				disabled={disabled} 
				required={required} 
				type="email" 
				className="form-control" 
				id={id} aria-describedby="emailHelp" 
				placeholder={placeholder}/>
			);
      	}
      	if (type === "longText") {
      		result = (<textarea 
      			disabled={disabled} 
      			required={required}
      			className="form-control" 
      			id={id} rows="3" 
      			placeholder={placeholder}>
      		</textarea>);
      	}
      	if (type === "fileInput") {
            result = (<input 
            	disabled={disabled} 
            	required={required}
            	id={id} type="file"/>);
      	}
      	if (type === "staticText") {
      		result = (<p id={id}>
      				{item.content}
      			</p>)
      	}
      	if (type === "checkboxes") {
      		result = (
      			<div class="form-check" id={id}>
      				{
      				item.options.map(option => {
      					return (
			        		<div>
			                    <input 
			                    	className="form-check-input" 
			                    	id={inputId} 
			                    	type="checkbox" 
			                    	value=""/>
			                    <label className="form-check-label" htmlFor={inputId}>
			                    	{option}
			                    </label>
			                </div>
			             );
			         })
			     }
			   </div>
			  );
      	}
      	if (type === 'selects') {
      		result = (                                         
      			<select id={id} className="form-control">
	                <option>1</option>
	                <option>2</option>
	                <option>3</option>
	                <option>4</option>
	                <option>5</option>
                </select>
            );
      	}
      	return result;
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