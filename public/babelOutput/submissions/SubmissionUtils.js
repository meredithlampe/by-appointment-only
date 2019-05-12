var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SubmissionUtils = function () {
	function SubmissionUtils() {
		_classCallCheck(this, SubmissionUtils);
	}

	_createClass(SubmissionUtils, null, [{
		key: 'renderSubmissions',


		// render form submissions in given container
		value: function renderSubmissions(container, formHostID, formID) {
			SubmissionUtils.startSubmissionLiveUpdaters(container, formHostID, formID);
		}
	}, {
		key: 'renderFormMetadata',
		value: function renderFormMetadata(container, formHostID, formID) {}
	}, {
		key: 'startSubmissionLiveUpdaters',
		value: function startSubmissionLiveUpdaters(container, formHostID, formID) {

			var onSubmissionAdded = function onSubmissionAdded(submissionData) {

				var getViewSubmissionLink = function getViewSubmissionLink(submissionData) {
					var viewLink = document.createElement('a');
					viewLink.setAttribute('data-toggle', "modal");
					viewLink.setAttribute('data-target', '#viewSubmissionModal');
					viewLink.innerHTML = 'View';
					var viewFunction = function viewFunction(submissionData, container, event) {
						var onFieldAdded = function onFieldAdded(fieldData, container) {
							// append field to container
							console.log(fieldData);
						};
						// TODO move form host ID and form ID out of fields
						window.firebaseHelper.setOnSubmissionFieldAdded(onFieldAdded, submissionData.fields.formHostID, submissionData.fields.formID, submissionData.id);
					};
					viewFunction = viewFunction.bind(null, submissionData, $('#viewSubmissionModal'));
					viewLink.addEventListener('click', viewFunction);
					return viewLink;
				};

				// configure view link
				var viewLink = getViewSubmissionLink(submissionData);
				var viewTd = document.createElement('td');
				viewTd.append(viewLink);

				// configure notes section
				var notesRaw = submissionData.notes;
				var notesTd = document.createElement('td');
				if (notesRaw !== undefined) {
					var notesContent = document.createElement('div');
					notesContent.innerHTML = notesRaw;
					notesTd.append(notesContent);
				}

				// remove loading indicator (might already be removed)
				$('.loading-submissions').empty();

				// append table data elements to row
				var formTable = $('.applicant-submissions-table-body');
				var tableRow = $(document.createElement('tr'));
				tableRow.addClass('odd gradeX');
				tableRow.addClass('submission-table-row-' + submissionData.id);

				tableRow.append("<td>" + submissionData.date + "</td>");
				tableRow.append(notesTd);
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