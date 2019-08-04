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
	editable: ['label']
}, {
	inputType: 'checkboxes',
	label: 'Checkboxes',
	placeholder: '',
	content: 'Description of checkboxes',
	options: ['Option1', 'Option2', 'Option3'],
	editable: ['content', 'label', 'options']
}, {
	inputType: 'selects',
	label: 'Dropdown Selector',
	placeholder: '',
	content: 'Description of selects',
	options: [],
	editable: ['content', 'label', 'options']
}];