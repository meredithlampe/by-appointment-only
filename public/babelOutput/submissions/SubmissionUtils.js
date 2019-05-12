var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SubmissionUtils = function () {
	function SubmissionUtils() {
		_classCallCheck(this, SubmissionUtils);
	}

	_createClass(SubmissionUtils, null, [{
		key: "renderSubmissions",


		// render form submissions in given container
		value: function renderSubmissions(container, formHostID, formID) {
			// then request submissions
			SubmissionUtils.startSubmissionLiveUpdaters(container, formHostID, formID);
			// then show submissions recieved from database
		}
	}, {
		key: "startSubmissionLiveUpdaters",
		value: function startSubmissionLiveUpdaters(container, formHostID, formID) {

			console.log("creating on submission added func w formHostID: " + formHostID + " and formID " + formID);

			var onSubmissionAdded = function onSubmissionAdded(submissionData) {

				var getViewSubmissionLink = function getViewSubmissionLink(submissionData) {
					var viewLink = document.createElement('a');
					viewLink.setAttribute('data-toggle', "modal");
					viewLink.setAttribute('data-target', '#viewSubmissionModal');
					viewLink.innerHTML = 'View';
					var viewFunction = function viewFunction(id, event) {
						// set body of modal
					};
					viewFunction = viewFunction.bind(null, submissionData.id);
					viewLink.addEventListener('click', viewFunction);
					return viewLink;
				};

				// configure view link
				var viewLink = getViewSubmissionLink(submissionData);
				var viewTd = document.createElement('td');
				viewTd.append(viewLink);

				// configure delete link
				// let markAsDoneLink = getMarkAsDoneLink(formData);
				// let deleteTd = document.createElement('td');
				// deleteTd.append(deleteLink);

				// remove loading indicator (might already be removed)
				$('.loading-submissions').empty();

				// append table data elements to row
				var formTable = $('.applicant-submissions-table-body');
				var tableRow = $(document.createElement('tr'));
				tableRow.addClass('odd gradeX');
				tableRow.addClass('submission-table-row-' + submissionData.id);
				tableRow.append("<td>" + submissionData.date + "</td>");
				tableRow.append(viewTd);
				// tableRow.append(markAsDoneLink);
				formTable.append(tableRow);
			};
			onSubmissionAdded = onSubmissionAdded.bind(this);
			window.firebaseHelper.setOnSubmissionAdded(onSubmissionAdded, formHostID, formID);
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

	}]);

	return SubmissionUtils;
}();

export default SubmissionUtils;