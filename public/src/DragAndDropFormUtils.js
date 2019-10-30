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

	static getInputElementForType(
		item,
		inputID,
		disabled = true, 
		required = false, 
		handleFileUpload = null,
		formDOMID = null,
	) {
		let placeholder = item.placeholder;
		let type = item.inputType;
		let result = null;
      	if (type === "shortText") {
			result = (<input 
				name={"shortText" + inputID}
				disabled={disabled}
				required={required} 
				className="form-control" 
				id={inputID} aria-describedby="emailHelp" 
				placeholder={placeholder}/>
			);
      	}
      	if (type === "longText") {
      		result = (<textarea 
      			name={"longText" + inputID}
      			disabled={disabled} 
      			required={required}
      			className="form-control" 
      			id={inputID} rows="3" 
      			placeholder={placeholder}>
      		</textarea>);
      	}
      	if (type === "fileInput") {
      		// wrapping file input in a div so that it line breaks
            result = (
            	<div>
	            	<input
						onChange={handleFileUpload}
		            	name={"fileInput" + inputID} 
		            	disabled={disabled} 
		            	required={required}
		            	id={inputID} type="file"
		            />
		         </div>
		     );
      	}
      	if (type === "staticText") {
      		result = null; // static text is just the label
      	}
      	if (type === "checkboxes") {
      		let checkboxFunc = (inputID, option, index) => {
				let checkboxName = "checkbox" + inputID + ":" + index;
				return (
	        		<div>
	                    <input 
	                    	name={checkboxName}
	                    	className="form-check-input" 
	                    	id={inputID + "-" + index} 
	                    	type="checkbox" 
	                    	value={option}/>
	                    <label className="form-check-label" htmlFor={inputID}>
	                    	{option}
	                    </label>
	                </div>
	             );
	         };
			checkboxFunc = checkboxFunc.bind(null, inputID);
      		result = (
      			<div className="form-check" id={inputID}>
      				{
      				item.options.map(checkboxFunc)
			     }
			   </div>
			  );
      	}
      	if (type === 'selects') {
      		let selectsFunc = (inputID, option, index) => {
				return (
        			<option
                    	className="form-check-input" 
                    	id={inputID} 
                    	value={option}>
        				{option}
        			</option>
	             );
	         };
			selectsFunc = selectsFunc.bind(null, inputID);
      		result = (                                         
      			<select 
      				name={"selects" + inputID} 
      				form={formDOMID}
      				id={inputID} 
      				className="form-control">
	                {item.options.map(selectsFunc)}
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