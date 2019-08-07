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
		key: 'parseInputIDFromMultiAnswerSubmissionKey',
		value: function parseInputIDFromMultiAnswerSubmissionKey(fieldKey) {
			// multi-answer submission fields have form <inputType>-"id"-<id relative to form>:<id relative to field>
			// return id relative to form
			var idRelativeToFormAndField = fieldKey.split("-")[2]; // should be like, 3:4
			return parseInt(idRelativeToFormAndField.split(":")[0]); // return  id relative to form
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
						// let onFieldAdded = (container, formHostID,  formID, fieldKeyAndData) => {
						// debugger;
						// // append field to container
						// let fieldData = fieldKeyAndData.val();
						// let inputType = SubmissionUtils.parseInputTypeFromSubmissionKey(fieldKeyAndData.key);
						// let input = SubmissionUtils.appendSubmittedFieldForInputType(
						// 	inputType, 
						// 	formHostID,
						// 	formID,
						// 	fieldKeyAndData.key, // submission field ID
						// 	fieldKeyAndData.val(),  // submission field value (what the client wrote or indicated)
						// 	container,
						// );
						// };
						// onFieldAdded = onFieldAdded.bind(null, container, submissionData.formHostID, submissionData.formID);
						// window.firebaseHelper.setOnSubmissionFieldAdded(
						// 	onFieldAdded, 
						// 	submissionData.formHostID, 
						// 	submissionData.formID, 
						// 	submissionData.submissionID,
						// );

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
								var foundAnswer = false;
								for (var ii = 0; ii < keys.length; ii++) {
									if (type === "checkboxes") {
										var thing = SubmissionUtils.parseInputIDFromMultiAnswerSubmissionKey(keys[ii]);
										if (item.id === thing) {
											var selectedOption = document.createElement('div');
											selectedOption.innerHTML = submissionData.fields[keys[ii]];
											valueContainer.appendChild(selectedOption);
											foundAnswer = true;
											break;
										}
									} else {
										if (item.id === SubmissionUtils.parseInputIDFromSubmissionKey(keys[ii])) {
											debugger;
											if (type === "shortText" || type === "longText" || type === "selects") {
												// look up actual value in submission data
												if (submissionData.fields[keys[ii]] !== "") {
													valueContainer.innerHTML = submissionData.fields[keys[ii]];
												} else {
													valueContainer.innerHTML = "No input provided";
												}
												foundAnswer = true;
												break;
											}
											if (type === "fileInput") {
												window.firebaseHelper.getFileForForm(formHostID, formID, submissionData.id, keys[ii], function (url) {
													console.log(url);
													valueContainer.innerHTML = url;
												});
												foundAnswer = true;
												break;
											}
											if (type === "staticText") {
												// return nothing here --  we just show the label
												// because nobody can submit anything for static text
												foundAnswer = true;
												break;
											}
										}
									}
								}
								if (!foundAnswer) {
									valueContainer.innerHTML = "No input provided";
								}
							});
						});
					};
					viewFunction = viewFunction.bind(null, submissionData, viewSubmissionModalBody);
					viewLink.addEventListener('click', viewFunction);
					return viewLink;
				};

				// configure view link
				var viewSubmissionLink = getViewSubmissionLink(submissionData);
				var viewTd = document.createElement('td');
				viewTd.append(viewSubmissionLink);

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