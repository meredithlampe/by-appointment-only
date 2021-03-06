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

			// add submissions table
			/*                           
   	<table width="100%" class="table table-striped table-bordered table-hover" id="dataTables-submissions">
               <thead>
                   <tr>
                       <th>Date Submitted</th>
                       <th>Notes</th>
                       <th id="dataTables-submissions-th-view">View</th>
                   </tr>
               </thead>
               <tbody class="applicant-submissions-table-body">
               </tbody>
             </table> 
         */

			var tableHeadRow = $('<tr>').attr("class", "dataTable-submissions-header-row");
			var tableHeadRowHeaderDate = $('<th>').html('Date Submitted');
			var tableHeadRowHeaderNotes = $('<th>').html('Notes');
			var tableHeadRowHeaderView = $('<th>').html('View').attr("id", "dataTables-submissions-th-view");

			tableHeadRow.append(tableHeadRowHeaderDate);
			tableHeadRow.append(tableHeadRowHeaderNotes);
			tableHeadRow.append(tableHeadRowHeaderView);

			// pull first couple of text fields from form and add to table
			// to make it easier to differentiate between submissions in
			// aggregate view
			window.firebaseHelper.getUserForm(formHostID, formID, function (formData) {
				var items = formData.items;
				var textFields = [];
				for (var ii = 0; ii < items.length && textFields.length < 2; ii++) {
					var item = items[ii];
					if (item.inputType === "shortText" || item.inputType === "longText") {
						textFields[textFields.length] = item.id;
						var tableHeadRowHeaderTextField = $('<th>').html(item.label);
						tableHeadRow.append(tableHeadRowHeaderTextField);
					}
				}

				var table = $('<table>').attr("class", "table table-striped table-bordered table-hover").attr("id", "dataTables-submissions").attr("width", "100%");
				var tableHead = $('<thead>');
				var tableBody = $('<tbody>');

				tableHead.append(tableHeadRow);

				table.append(tableHead);
				table.append(tableBody);

				$('.submissions-table-container').append(table);

				// populate table of submissions
				SubmissionUtils.renderSubmissionRows(container, formHostID, formID, textFields);
			});
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
		key: 'parseInputIDFromMultiAnswerSubmissionKey',
		value: function parseInputIDFromMultiAnswerSubmissionKey(fieldKey) {
			// multi-answer submission fields have form <inputType>-"id"-<id relative to form>:<id relative to field>
			// return id relative to form
			var idRelativeToFormAndField = fieldKey.split("-");
			if (idRelativeToFormAndField.length < 3) {
				return null;
			}
			idRelativeToFormAndField = idRelativeToFormAndField[2]; // should be like, 3:4
			if (!idRelativeToFormAndField) {
				return null;
			}
			return parseInt(idRelativeToFormAndField.split(":")[0]); // return  id relative to form
		}
	}, {
		key: 'appendFieldToValueContainer',
		value: function appendFieldToValueContainer(type, keys, ii, submissionData, valueContainer, item, formHostID, formID) {
			if (type === "checkboxes") {
				var thing = SubmissionUtils.parseInputIDFromMultiAnswerSubmissionKey(keys[ii]);
				if (item.id === thing) {
					var selectedOption = document.createElement('div');
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
						window.firebaseHelper.getFileForForm(formHostID, formID, submissionData.submissionID, keys[ii], function (url) {
							valueContainer.innerHTML = "";
							if (url) {
								var downloadLink = document.createElement('a');
								downloadLink.setAttribute('href', url);
								downloadLink.setAttribute('target', '_blank');
								downloadLink.innerHTML = "Open in New Tab";
								valueContainer.appendChild(downloadLink);
							}
						}, function (error) {
							valueContainer.innerHTML = "";
							var fileError = document.createElement('div');
							fileError.innerHTML = 'No file found';
							fileError.style.fontStyle = 'italic';
							valueContainer.appendChild(fileError);
						});
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
	}, {
		key: 'getViewSubmissionLink',
		value: function getViewSubmissionLink(submissionData) {
			var viewLink = document.createElement('a');
			viewLink.setAttribute('data-toggle', "modal");
			viewLink.setAttribute('data-target', '#viewSubmissionModal');
			viewLink.setAttribute('submission-data', submissionData);
			viewLink.innerHTML = 'View';

			viewLink.setAttribute('onclick', SubmissionUtils.viewSubmission);
			return viewLink;
		}
	}, {
		key: 'viewSubmission',
		value: function viewSubmission(submissionData) {
			// configure logic for closing "view submission" window (clear content)
			var container = $('#viewSubmissionModal .modal-body');
			var formHostID = submissionData['formHostID'];
			var formID = submissionData['formID'];
			container.empty();

			// instead of looping through submitted fields, loop through form fields and look in submission for answer
			window.firebaseHelper.getUserForm(formHostID, formID, function (formData) {
				var items = formData.items;
				items.map(function (item, index) {
					var labelContainer = document.createElement('div');
					var valueContainer = document.createElement('div');
					var type = item.inputType;

					labelContainer.className = "submission-field-label";
					labelContainer.innerHTML = item.label;
					container.append(labelContainer);
					container.append(valueContainer);

					// get value for field from submission data
					var value = "Input unavailable";
					var keys = Object.keys(submissionData.fields);
					valueContainer.innerHTML = "No answer provided";
					for (var ii = 0; ii < keys.length; ii++) {
						SubmissionUtils.appendFieldToValueContainer(type, keys, ii, submissionData, valueContainer, item, formHostID, formID);
					}
				});
			});
		}
	}, {
		key: 'renderSubmissionRows',
		value: function renderSubmissionRows(container, formHostID, formID, textFields) {
			var onSubmissionAdded = function onSubmissionAdded(submissionData) {

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

				// configure time submitted
				var submitTime = new Date(submissionData.time);
				var submitDateString = submitTime.getMonth() + 1 + "/" + submitTime.getDate() + "/" + (submitTime.getYear() - 100 + 2000);

				// append table data elements to row
				var formTable = $('#dataTables-submissions').DataTable();
				var rowData = [submitDateString, notesRaw ? notesRaw : '', submissionData];

				// append extra text fields to row
				var fields = submissionData.fields;
				for (var ii = 0; ii < textFields.length; ii++) {
					// find data for this field
					var textFieldId = textFields[ii];
					var found = false;
					for (var fieldId in fields) {
						if (SubmissionUtils.parseInputIDFromSubmissionKey(fieldId) === textFieldId) {
							rowData[rowData.length] = fields[fieldId];
							found = true;
							break;
						}
					}
					if (!found) {
						rowData[rowData.length] = "No data found";
					}
				}

				formTable.row.add(rowData).draw(false);
			};
			var table = $('#dataTables-submissions').DataTable({
				columnDefs: [{
					targets: 2,
					render: function render(data, type, row, meta) {
						if (type === 'display') {
							var viewLink = SubmissionUtils.getViewSubmissionLink(data).outerHTML;
							return viewLink;
						}

						return data;
					}
				}]
			});

			$('#dataTables-submissions tbody').on('click', 'tr', function (a) {
				var data = table.row(this).data();
				debugger;
				var submissionData = data[2];
				SubmissionUtils.viewSubmission(submissionData);
			});

			onSubmissionAdded = onSubmissionAdded.bind(this);
			window.firebaseHelper.setOnSubmissionAdded(onSubmissionAdded, formHostID, formID);
		}
	}]);

	return SubmissionUtils;
}();

export default SubmissionUtils;