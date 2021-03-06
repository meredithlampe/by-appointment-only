var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import React from 'react';
import COMPONENT_LIBRARY from './componentLibrary.js';

var DragAndDropFormUtils = function () {
	function DragAndDropFormUtils() {
		_classCallCheck(this, DragAndDropFormUtils);
	}

	_createClass(DragAndDropFormUtils, null, [{
		key: 'jsonDeepCopy',
		value: function jsonDeepCopy(object) {
			return JSON.parse(JSON.stringify(object));
		}
	}, {
		key: 'getSafeName',
		value: function getSafeName(name) {
			return name.replace(/\s/g, '-');
		}
	}, {
		key: 'getLabelForInputElementType',
		value: function getLabelForInputElementType(type) {
			for (var vv = 0; vv < COMPONENT_LIBRARY.length; vv++) {
				var component = COMPONENT_LIBRARY[vv];
				if (component.inputType === type) {
					return component.label;
				}
			}
			return null;
		}
	}, {
		key: 'getInputElementForType',
		value: function getInputElementForType(item, inputId) {
			var disabled = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

			var type = item.inputType;
			var placeholder = item.placeholder;
			var id = inputId;
			var result = null;
			if (type === "shortText") {
				result = React.createElement('input', { disabled: disabled, type: 'email', className: 'form-control', id: id, 'aria-describedby': 'emailHelp', placeholder: placeholder });
			}
			if (type === "longText") {
				result = React.createElement('textarea', { disabled: disabled, className: 'form-control', id: id, rows: '3', placeholder: placeholder });
			}
			if (type === "fileInput") {
				result = React.createElement('input', { disabled: disabled, id: id, type: 'file' });
			}
			if (type === "staticText") {
				result = React.createElement(
					'p',
					{ className: 'text-muted', id: id },
					item.content
				);
			}
			if (type === "checkboxes") {
				result = React.createElement(
					'div',
					{ id: id },
					item.options.map(function (option) {
						return React.createElement(
							'div',
							{ className: 'checkbox' },
							React.createElement(
								'label',
								null,
								React.createElement('input', { type: 'checkbox', value: '' }),
								React.createElement(
									'div',
									{ className: 'text-muted' },
									option
								)
							)
						);
					})
				);
			}
			if (type === 'selects') {
				result = React.createElement(
					'select',
					{ id: id, className: 'form-control' },
					React.createElement(
						'option',
						null,
						'1'
					),
					React.createElement(
						'option',
						null,
						'2'
					),
					React.createElement(
						'option',
						null,
						'3'
					),
					React.createElement(
						'option',
						null,
						'4'
					),
					React.createElement(
						'option',
						null,
						'5'
					)
				);
			}
			return result;
		}
	}, {
		key: 'getEditableFieldsForInputType',
		value: function getEditableFieldsForInputType(inputType) {
			var found = COMPONENT_LIBRARY.find(function (item) {
				return item.inputType === inputType;
			});
			return found.editable;
		}
	}, {
		key: 'getTodaysDate',
		value: function getTodaysDate() {
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth() + 1; //January is 0!
			var yyyy = today.getFullYear();

			if (dd < 10) {
				dd = '0' + dd;
			}

			if (mm < 10) {
				mm = '0' + mm;
			}

			return mm + '-' + dd + '-' + yyyy;
		}
	}]);

	return DragAndDropFormUtils;
}();

export default DragAndDropFormUtils;