var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import React from 'react';
import COMPONENT_LIBRARY from './componentLibrary.js';

var DragAndDropFormUtils = function () {
	function DragAndDropFormUtils() {
		_classCallCheck(this, DragAndDropFormUtils);
	}

	_createClass(DragAndDropFormUtils, null, [{
		key: 'getInputElementForType',
		value: function getInputElementForType(type, id, placeholder) {
			var input = null;
			if (type === "shortText") {
				input = React.createElement('input', { disabled: true, type: 'email', className: 'form-control', id: id, 'aria-describedby': 'emailHelp', placeholder: placeholder });
			}
			if (type === "longText") {
				input = React.createElement('textarea', { disabled: true, className: 'form-control', id: id, rows: '3', placeholder: placeholder });
			}
			if (type === "fileInput") {
				input = React.createElement('input', { disabled: true, id: id, type: 'file' });
			}
			if (type === "staticText") {
				input = React.createElement(
					'p',
					{ className: 'text-muted', id: id },
					placeholder
				);
			}
			if (type === "checkboxes") {
				input = React.createElement(
					'div',
					{ id: id },
					React.createElement(
						'div',
						{ className: 'checkbox' },
						React.createElement(
							'label',
							null,
							React.createElement('input', { type: 'checkbox', value: '' }),
							React.createElement(
								'div',
								{ className: 'text-muted' },
								'Checkbox 1'
							)
						)
					),
					React.createElement(
						'div',
						{ className: 'checkbox' },
						React.createElement(
							'label',
							null,
							React.createElement('input', { type: 'checkbox', value: '' }),
							React.createElement(
								'div',
								{ className: 'text-muted' },
								'Checkbox 2'
							)
						)
					),
					React.createElement(
						'div',
						{ className: 'checkbox' },
						React.createElement(
							'label',
							null,
							React.createElement('input', { type: 'checkbox', value: '' }),
							React.createElement(
								'div',
								{ className: 'text-muted' },
								'Checkbox 3'
							)
						)
					)
				);
			}
			if (type === 'selects') {
				input = React.createElement(
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
			return input;
		}
	}, {
		key: 'getEditableFieldsForInputType',
		value: function getEditableFieldsForInputType(inputType) {
			var found = COMPONENT_LIBRARY.find(function (item) {
				return item.inputType === inputType;
			});
			return found.editable;
		}
	}]);

	return DragAndDropFormUtils;
}();

export default DragAndDropFormUtils;