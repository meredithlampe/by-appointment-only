export default class SubmissionUtils {

	// render form submissions in given container
	static renderSubmissions(container, formID) {
		// then request submissions
		startSubmissionLiveUpdaters(container, formID);
		// then show submissions recieved from database
	}

	static startSubmissionLiveUpdaters(container, formID) {

		let onSubmissionAdded = (submissionData) => {

			let getViewSubmissionLink = (submissionData) => {
				let viewLink = document.createElement('a');
				viewLink.setAttribute('data-toggle', "modal");
				viewLink.setAttribute('data-target', '#viewSubmissionModal');
				viewLink.innerHTML = 'View';
				let viewFunction = (id, event) => {
					// set body of modal
				}
				viewFunction = viewFunction.bind(null, submissionData.id);
				viewLink.addEventListener('click', viewFunction);
				return viewLink;
			}

			// configure view link
			let viewLink = getViewSubmissionLink(formData, submissionID);
			let viewTd = document.createElement('td');
			viewTd.append(viewLink);

			// configure delete link
			// let markAsDoneLink = getMarkAsDoneLink(formData);
			// let deleteTd = document.createElement('td');
			// deleteTd.append(deleteLink);

			// remove loading indicator (might already be removed)
			$('.loading-forms').empty();

			// append table data elements to row
			let formTable = $('.applicant-submissions-table-body');
			let tableRow = $(document.createElement('tr'));
			tableRow.addClass('odd gradeX');
			tableRow.addClass('submission-table-row-' + submissionData.id);
			tableRow.append("<td>" + submissionData.date + "</td>");
			tableRow.append(viewTd);
			// tableRow.append(markAsDoneLink);
			formTable.append(tableRow);
		};
		onSubmissionAdded = onSubmissionAdded.bind(this);
		window.firebaseHelper.setOnSubmissionAdded(
			onSubmissionAdded,
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