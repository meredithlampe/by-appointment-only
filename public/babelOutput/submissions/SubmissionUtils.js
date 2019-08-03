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
		value: function renderSubmissions(container, formHostID, formID, formName) {
			// update header
			$('.view-submissions-subheader').html('Submissions from <b>' + formName + '</b>');

			// populate table of submissions
			SubmissionUtils.startSubmissionLiveUpdaters(container, formHostID, formID);
		}
	}, {
		key: 'renderFormMetadata',
		value: function renderFormMetadata(container, formHostID, formID) {}
	}, {
		key: 'parseInputTypeFromSubmissionKey',
		value: function parseInputTypeFromSubmissionKey(fieldKey) {
			// submission fields have form <inputType>-"id"-<id relative to form>
			// return input type
			return fieldKey.split("-")[0];
		}
	}, {
		key: 'parseInputIDFromSubmissionKey',
		value: function parseInputIDFromSubmissionKey(fieldKey) {
			// submission fields have form <inputType>-"id"-<id relative to form>
			// return id relative to form
			return parseInt(fieldKey.split("-")[2]);
		}
	}, {
		key: 'startSubmissionLiveUpdaters',
		value: function startSubmissionLiveUpdaters(container, formHostID, formID) {

			var onSubmissionAdded = function onSubmissionAdded(submissionData) {

				var getViewSubmissionLink = function getViewSubmissionLink(submissionData) {
					var viewLink = document.createElement('a');
					var viewSubmissionModalBody = $('#viewSubmissionModal .modal-body');
					viewLink.setAttribute('data-toggle', "modal");
					viewLink.setAttribute('data-target', '#viewSubmissionModal');
					viewLink.innerHTML = 'View';
					var viewFunction = function viewFunction(submissionData, container, event) {
						// configure logic for closing "view submission" window (clear content)
						container.empty();
						var onFieldAdded = function onFieldAdded(container, formHostID, formID, fieldKeyAndData) {
							// append field to container
							var fieldData = fieldKeyAndData.val();
							var inputType = SubmissionUtils.parseInputTypeFromSubmissionKey(fieldKeyAndData.key);
							var input = SubmissionUtils.appendSubmittedFieldForInputType(inputType, formHostID, formID, fieldKeyAndData.key, // submission field ID
							fieldKeyAndData.val(), // submission field value (what the client wrote or indicated)
							container);
						};
						onFieldAdded = onFieldAdded.bind(null, container, submissionData.formHostID, submissionData.formID);
						window.firebaseHelper.setOnSubmissionFieldAdded(onFieldAdded, submissionData.formHostID, submissionData.formID, submissionData.submissionID);
					};
					viewFunction = viewFunction.bind(null, submissionData, viewSubmissionModalBody);
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
		key: 'appendSubmittedFieldForInputType',
		value: function appendSubmittedFieldForInputType(type, formHostID, formID, inputID, value, container) {
			var result = null;

			// get label for input ID
			SubmissionUtils.getLabelForInput(formHostID, formID, inputID, function (label) {
				var labelContainer = document.createElement('div');
				labelContainer.className = "submission-field-label";
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
					// but at least we could show it here? for context?
				}
				if (type === "checkboxes") {
					// figure out how to show checkboxes
				}
				if (type === 'selects') {}
				// figure out how to show selects

				// have to append data to container here instead of returning it
				return container;
			});
		}
	}, {
		key: 'getLabelForInput',
		value: function getLabelForInput(formHostID, formID, submissionKey, callback) {
			firebaseHelper.getUserForm(formHostID, formID, function (form) {
				// first, figure out what input ID we're looking for within form
				var inputID = SubmissionUtils.parseInputIDFromSubmissionKey(submissionKey);

				// then, using inputID, find input and look for label
				var items = form.items;
				for (var ii = 0; ii < items.length; ii++) {
					if (items[ii].id === inputID) {
						callback(items[ii].label);
					}
				}
			});
		}
	}]);

	return SubmissionUtils;
}();

export default SubmissionUtils;