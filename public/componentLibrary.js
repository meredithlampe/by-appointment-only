export default [{
	inputType: 'shortText',
	label: 'Short Text',
	placeholder: 'Placeholder text',
	editable: ['placeholder', 'label']
}, {
	inputType: 'longText',
	label: 'Long Text',
	placeholder: 'Placeholder text',
	editable: ['placeholder', 'label']
}, {
	inputType: 'fileInput',
	label: 'File Input',
	placeholder: '',
	editable: ['label']
}, {
	inputType: 'staticText',
	label: 'Static Text',
	placeholder: '',
	content: 'Sample text containing instructions for filling out the form, disclaimer, etc.',
	editable: ['content', 'label']
}, {
	inputType: 'checkboxes',
	label: 'Checkboxes',
	placeholder: '',
	content: 'Description of checkboxes',
	options: [],
	editable: ['content', 'label', 'options']
}, {
	inputType: 'selects',
	label: 'Dropdown Selector',
	placeholder: '',
	content: 'Description of checkboxes',
	options: [],
	editable: ['content', 'label', 'options']
}];