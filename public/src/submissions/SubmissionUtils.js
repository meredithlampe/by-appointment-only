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

	static startSubmissionLiveUpdaters(container, formHostID, formID) {

		let onSubmissionAdded = (submissionData) => {

			let getViewSubmissionLink = (submissionData) => {
				let viewLink = document.createElement('a');
				let viewSubmissionModalBody = $('#viewSubmissionModal .modal-body');
				viewLink.setAttribute('data-toggle', "modal");
				viewLink.setAttribute('data-target', '#viewSubmissionModal');
				viewLink.innerHTML = 'View';
				let viewFunction = (submissionData, container, event) => {
					// configure logic for closing "view submission" window (clear content)
					container.empty();
					let onFieldAdded = (container, formHostID,  formID, fieldKeyAndData) => {
						// append field to container
						let fieldData = fieldKeyAndData.val();
						let inputType = SubmissionUtils.parseInputTypeFromSubmissionKey(fieldKeyAndData.key);
						let input = SubmissionUtils.appendSubmittedFieldForInputType(
							inputType, 
							formHostID,
							formID,
							fieldKeyAndData.key, // submission field ID
							fieldKeyAndData.val(),  // submission field value (what the client wrote or indicated)
							container,
						);
					};
					onFieldAdded = onFieldAdded.bind(null, container, submissionData.formHostID, submissionData.formID);
					window.firebaseHelper.setOnSubmissionFieldAdded(
						onFieldAdded, 
						submissionData.formHostID, 
						submissionData.formID, 
						submissionData.submissionID,
					);
				}
				viewFunction = viewFunction.bind(null, submissionData, viewSubmissionModalBody);
				viewLink.addEventListener('click', viewFunction);
				return viewLink;
			}

			// configure view link
			let viewLink = getViewSubmissionLink(submissionData);
			let viewTd = document.createElement('td');
			viewTd.append(viewLink);

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

			// append table data elements to row
			let formTable = $('.applicant-submissions-table-body');
			let tableRow = $(document.createElement('tr'));
			tableRow.addClass('odd gradeX');
			tableRow.addClass('submission-table-row-' + submissionData.id);

			tableRow.append("<td>" + submissionData.date + "</td>");
			tableRow.append(notesTd);
			tableRow.append(viewTd);
			// tableRow.append(markAsDoneLink);
			formTable.append(tableRow);	
		};
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

	static appendSubmittedFieldForInputType(type, formHostID, formID, inputID, value, container) {
		let result = null;

		// get label for input ID
		SubmissionUtils.getLabelForInput(formHostID, formID, inputID, (label) => {
			let labelContainer = document.createElement('div');
			labelContainer.innerHTML = label;
			let valueContainer = document.createElement('div');
			container.append(labelContainer);
			container.append(valueContainer);

	      	if (type === "shortText" || type === "longText") {
				valueContainer.innerHTML = value;
	      	}
	      	if (type === "fileInput") {
	            // figure out how to display file input
	      	}
	      	if (type === "staticText") {
	      		// throw error? nobody should have submitted this
	      	}
	      	if (type === "checkboxes") {
	      		// figure out how to show checkboxes
	      	}
	      	if (type === 'selects') {
	      		// figure out how to show selects
	      	}
	      	// have to append data to container here instead of returning it
	      	return container;
		});

	}


  	static getLabelForInput(formHostID, formID, submissionKey, callback) {
	   firebaseHelper.getUserForm(formHostID, formID, (form) => {
	   		// first, figure out what input ID we're looking for within form
	   		let inputID = SubmissionUtils.parseInputIDFromSubmissionKey(submissionKey);

	   		// then, using inputID, find input and look for label
	   		let items = form.items;
	   		for (let ii = 0; ii < items.length; ii++) {
	   			if (items[ii].id === inputID) {
	   				callback(items[ii].label);
	   			}
	   		}

	   });
  }
}