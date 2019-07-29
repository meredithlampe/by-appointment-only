var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import DragAndDropFormUtils from '../../babelOutput/DragAndDropFormUtils.js';

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
		key: 'parseInputTypeFromSubmissionKey',
		value: function parseInputTypeFromSubmissionKey(fieldKey) {
			// submission fields have form <inputType>-"id"-<id relative to form>
			return fieldKey.split("-")[0];
		}
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
						console.log(submissionData);
						var onFieldAdded = function onFieldAdded(container, fieldKeyAndData) {
							// append field to container
							var fieldData = fieldKeyAndData.val();
							var inputType = SubmissionUtils.parseInputTypeFromSubmissionKey(fieldKeyAndData.key);
							var input = SubmissionUtils.getSubmittedFieldForInputType(inputType, fieldKeyAndData.key, fieldKeyAndData.val());
							console.log(input);
							container.append(input);
							var test = document.createElement('div');
							debugger;
							container.append(test);
						};
						onFieldAdded = onFieldAdded.bind(null, container);
						window.firebaseHelper.setOnSubmissionFieldAdded(onFieldAdded, submissionData.fields.formHostID, submissionData.fields.formID, submissionData.submissionID);
					};
					viewFunction = viewFunction.bind(null, submissionData, $('#viewSubmissionModal .modal-body'));
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

	}, {
		key: 'getSubmittedFieldForInputType',
		value: function getSubmittedFieldForInputType(type, label, value) {
			var result = null;
			var container = document.createElement('div');
			var labelContainer = document.createElement('div');
			labelContainer.innerHTML = label;
			var valueContainer = document.createElement('div');
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
	}]);

	return SubmissionUtils;
}();

export default SubmissionUtils;