import DragAndDropFormUtils from '../../babelOutput/DragAndDropFormUtils.js';

export default class SubmissionUtils {

	// render form submissions in given container
	static renderSubmissions(container, formHostID, formID, formName) {
		// update header
		$('.view-submissions-subheader').html('Submissions from <b>' + formName + '</b>');

		// populate table of submissions
		SubmissionUtils.startSubmissionLiveUpdaters(container, formHostID, formID);
	}

	static renderFormMetadata(container, formHostID, formID) {

	}

	static parseInputTypeFromSubmissionKey(fieldKey) {
		// submission fields have form <inputType>-"id"-<id relative to form>
		// return input type
		return fieldKey.split("-")[0];
	}

	static parseInputIDFromSubmissionKey(fieldKey) {
		// submission fields have form <inputType>-"id"-<id relative to form>
		// return id relative to form
		return parseInt(fieldKey.split("-")[2]);
	}

	static parseInputIDFromMultiAnswerSubmissionKey(fieldKey) {
		// multi-answer submission fields have form <inputType>-"id"-<id relative to form>:<id relative to field>
		// return id relative to form
		let idRelativeToFormAndField = fieldKey.split("-");
		if (idRelativeToFormAndField.length < 3) {
			return null;
		}
		idRelativeToFormAndField = idRelativeToFormAndField[2]; // should be like, 3:4
		if (!idRelativeToFormAndField) {
			return null;
		}
		return parseInt(idRelativeToFormAndField.split(":")[0]); // return  id relative to form
	}

	static appendFieldToValueContainer(type, keys, ii, submissionData, valueContainer, item, formHostID, formID) {
		if (type === "checkboxes") {
			let thing = SubmissionUtils.parseInputIDFromMultiAnswerSubmissionKey(keys[ii]);
			if (item.id === thing) {
				let selectedOption = document.createElement('div');
				selectedOption.innerHTML = submissionData.fields[keys[ii]];
				valueContainer.innerHTML = "";
				valueContainer.appendChild(selectedOption);
			}
	  	} else {
	      	if (item.id === SubmissionUtils.parseInputIDFromSubmissionKey(keys[ii])) {
				if (type === "shortText" || type === "longText" || type === "selects") {		
					// look up actual value in submission data
					if (submissionData.fields[keys[ii]] !== "") {
						valueContainer.innerHTML = submissionData.fields[keys[ii]];	
					} else {
						valueContainer.innerHTML = "No input provided";
					}
					return;
		      	}
		      	if (type === "fileInput") {
		      		valueContainer.innerHTML = "Loading file...";
		            window.firebaseHelper.getFileForForm(
		            	formHostID, 
		            	formID, 
		            	submissionData.submissionID, 
		            	keys[ii], 
		            	(url) => {
		            		valueContainer.innerHTML = "";
		            		if (url) {
			            		let downloadLink = document.createElement('a');
			            		downloadLink.setAttribute('href', url);
			            		downloadLink.setAttribute('target', '_blank');
			            		downloadLink.innerHTML = "Open in New Tab";
			            		valueContainer.appendChild(downloadLink);	
		            		}
		            	},
		            	(error) => {
		            		valueContainer.innerHTML = "";
	            			let fileError = document.createElement('div');
	            			fileError.innerHTML = 'No file found';
	            			fileError.style.fontStyle = 'italic';
	            			valueContainer.appendChild(fileError);
		            	}
		            );
		            return;
		      	}
		      	if (type === "staticText") {
		      		// return nothing here --  we just show the label
		      		// because nobody can submit anything for static text
		      		return;
		      	}
			}
		}	
	}

	static getViewSubmissionLink(submissionData) {
				let viewLink = document.createElement('a');
				let viewSubmissionModalBody = $('#viewSubmissionModal .modal-body');
				viewLink.setAttribute('data-toggle', "modal");
				viewLink.setAttribute('data-target', '#viewSubmissionModal');
				viewLink.innerHTML = 'View';
				let viewFunction = (submissionData, container, event) => {
					// configure logic for closing "view submission" window (clear content)
					container.empty();


					// instead of looping through submitted fields, loop through form fields and look in submission for answer
					window.firebaseHelper.getUserForm(formHostID, formID, (formData) => {
						let items = formData.items;
		              	items.map((item, index) => {
          					let labelContainer = document.createElement('div');
          					let valueContainer = document.createElement('div');
          					let type = item.inputType;

							labelContainer.className= "submission-field-label";
							labelContainer.innerHTML = item.label;
							container.append(labelContainer);
							container.append(valueContainer);

							// get value for field from submission data
							let value = "Input unavailable";
							let keys = Object.keys(submissionData.fields);
							valueContainer.innerHTML = "No answer provided";
							for (let ii = 0; ii < keys.length; ii++) {
								SubmissionUtils.appendFieldToValueContainer(
									type, keys, ii, submissionData, valueContainer, item, formHostID, formID);
							}
			          	});
					});
				};
				viewFunction = viewFunction.bind(null, submissionData, viewSubmissionModalBody);
				viewLink.addEventListener('click', viewFunction);
				return viewLink;
	}

	static startSubmissionLiveUpdaters(container, formHostID, formID) {
		let onSubmissionAdded = (submissionData) => {

			// configure notes section
			let notesRaw = submissionData.notes;
			let notesTd = document.createElement('td');
			if (notesRaw !== undefined) {
				let notesContent  = document.createElement('div');
				notesContent.innerHTML = notesRaw;
				notesTd.append(notesContent);
			}

			// remove loading indicator (might already be removed)
			$('.loading-submissions').empty();

			// configure time submitted
			let submitTime = new Date(submissionData.time);
			let submitDateString = submitTime.getMonth() + " / " + submitTime.getDay() + " / " + (submitTime.getYear() - 100 + 2000);

			// append table data elements to row
			let formTable = $('#dataTables-submissions').DataTable();
			// let tableRow = $(document.createElement('tr'));
			// tableRow.addClass('odd gradeX');
			// tableRow.addClass('submission-table-row-' + submissionData.id);

			// tableRow.append("<td>" + submitDateString + "</td>");
			// tableRow.append(notesTd);
			// tableRow.append(viewTd);
			// tableRow.append(markAsDoneLink);
			// formTable.append(tableRow);	
			let rowData = [
				submitDateString,
				notesRaw ? notesRaw : '',
				submissionData,
			];
			formTable.row.add(rowData).draw(false);
		};
		$('#dataTables-submissions').DataTable( {
			columnDefs: [
			        {
			            targets: 2,
			            render: function ( data, type, row, meta ) {
			                if(type === 'display'){
			                    let data = SubmissionUtils.getViewSubmissionLink(data).innerHTML;
			                }

			                return data;
			            }
			        }
			    ]   
    	});

		onSubmissionAdded = onSubmissionAdded.bind(this);
		window.firebaseHelper.setOnSubmissionAdded(
			onSubmissionAdded,
			formHostID,
			formID,
			);
		}
		// window.firebaseHelper.setOnFormRemoved(
		// 	(formData) => {
		// 		let tr = $('.form-table-row-' + formData.id);
		// 		if (tr) {
		// 			tr.remove();
		// 		}
		// 	},
		// );
		// window.firebaseHelper.setOnFormChanged(
		// 	(formData) => {
		// 		let tr = $('.form-table-row-' + formData.id);
		// 		tr.remove();
		// 		onFormAdded(formData);
		// 	});
		// }
}