export default class SubmissionUtils {

	// render form submissions in given container
	static renderSubmissions(container, formHostID, formID) {
		SubmissionUtils.startSubmissionLiveUpdaters(container, formHostID, formID);
	}

	static renderFormMetadata(container, formHostID, formID) {

	}

	static startSubmissionLiveUpdaters(container, formHostID, formID) {

		let onSubmissionAdded = (submissionData) => {

			let getViewSubmissionLink = (submissionData) => {
				let viewLink = document.createElement('a');
				viewLink.setAttribute('data-toggle', "modal");
				viewLink.setAttribute('data-target', '#viewSubmissionModal');
				viewLink.innerHTML = 'View';
				let viewFunction = (submissionData, container, event) => {
					let onFieldAdded = (fieldData, container) => {
						// append field to container
						console.log(fieldData);
					};
					// TODO move form host ID and form ID out of fields
					window.firebaseHelper.setOnSubmissionFieldAdded(
						onFieldAdded, 
						submissionData.fields.formHostID, 
						submissionData.fields.formID, 
						submissionData.id,
					);
				}
				viewFunction = viewFunction.bind(null, submissionData, $('#viewSubmissionModal'));
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
}