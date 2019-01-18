import React from 'react';

export default class DragAndDropFormUtils {
	static getInputElementForType(type, id, placeholder) {
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
}	