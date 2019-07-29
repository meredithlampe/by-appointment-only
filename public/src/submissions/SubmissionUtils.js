import DragAndDropFormUtils from '../../babelOutput/DragAndDropFormUtils.js';

export default class SubmissionUtils {

	// render form submissions in given container
	static renderSubmissions(container, formHostID, formID) {
		SubmissionUtils.startSubmissionLiveUpdaters(container, formHostID, formID);
	}

	static renderFormMetadata(container, formHostID, formID) {

	}

	static parseInputTypeFromSubmissionKey(fieldKey) {
		// submission fields have form <inputType>-"id"-<id relative to form>
		return fieldKey.split("-")[0];
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
					let onFieldAdded = (container, fieldKeyAndData) => {
						// append field to container
						let fieldData = fieldKeyAndData.val();
						let inputType = SubmissionUtils.parseInputTypeFromSubmissionKey(fieldKeyAndData.key);
						let input = SubmissionUtils.getSubmittedFieldForInputType(
							inputType, 
							fieldKeyAndData.key,
							fieldKeyAndData.val(), 
						);
						container.append(input);
					};
					onFieldAdded = onFieldAdded.bind(null, container);
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

	static getSubmittedFieldForInputType(type, label, value) {
		let result = null;
		let container = document.createElement('div');
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
      	return container;
	}
}