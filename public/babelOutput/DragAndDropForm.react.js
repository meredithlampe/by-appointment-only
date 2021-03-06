var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactDOM = require('react-dom');

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import EditModal from './EditModal.react.js';
import RenameFormModal from './RenameFormModal.react.js';
import ConfirmCloseModal from './ConfirmCloseModal.react.js';
import DeleteModal from './DeleteModal.react.js';
import DragAndDropFormUtils from './DragAndDropFormUtils.js';
import FormPreview from './FormPreview.react.js';
import COMPONENT_LIBRARY from './componentLibrary.js';
import FIELD_METADATA from './componentFieldMetadata.js';

var getItems = function getItems(count) {
	return Array.from({ length: count }, function (v, k) {
		return k;
	}).map(function (k) {
		return {
			id: 'item-' + k,
			content: 'item ' + k
		};
	});
};

// drag and drop form creation for client forms
export var DragAndDropForm = function (_React$Component) {
	_inherits(DragAndDropForm, _React$Component);

	function DragAndDropForm(props) {
		_classCallCheck(this, DragAndDropForm);

		var _this = _possibleConstructorReturn(this, (DragAndDropForm.__proto__ || Object.getPrototypeOf(DragAndDropForm)).call(this, props));

		_this.firebaseHelper = props.firebaseHelper;
		_this.databaseID = props.databaseID;
		_this.state = {
			items: [],
			name: '',
			lastUnusedId: -1,
			showModalEditComponent: false,
			showModalRenameForm: false,
			showModalDeleteComponent: false,
			editingItem: null,
			lastSavedForm: {
				items: [],
				name: ''
			}
		};
		_this.onDragEnd = _this.onDragEnd.bind(_this);
		_this.openModalEditComponent = _this.openModalEditComponent.bind(_this);
		_this.openModalEditComponentForHTMLID = _this.openModalEditComponentForHTMLID.bind(_this);
		_this.hideModalEditComponent = _this.hideModalEditComponent.bind(_this);
		_this.openModalRenameForm = _this.openModalRenameForm.bind(_this);
		_this.hideModalRenameForm = _this.hideModalRenameForm.bind(_this);
		_this.openModalDeleteComponent = _this.openModalDeleteComponent.bind(_this);
		_this.hideModalDeleteComponent = _this.hideModalDeleteComponent.bind(_this);
		_this.setFormName = _this.setFormName.bind(_this);
		_this.saveForm = _this.saveForm.bind(_this);

		_this.editModal = React.createRef();

		var maybeClose = function maybeClose() {
			if (this.formHasPendingChanges()) {
				// show 'are you sure' dialog
				$("#confirmCloseEditModal").modal("show");
				return;
			}
			this.close();
		};
		maybeClose = maybeClose.bind(_this);
		_this.maybeClose = maybeClose;

		// get items in form from databae
		if (!props.newForm) {
			_this.firebaseHelper.getCurrentUserForm(props.databaseID, function (formData) {
				_this.setState({
					name: formData.name,
					lastUnusedId: formData.lastUnusedId !== undefined ? formData.lastUnusedId : 0,
					items: formData.items,
					lastSavedForm: {
						items: DragAndDropFormUtils.jsonDeepCopy(formData.items),
						name: formData.name
					}
				});
			});
		} else {
			// is new form
			_this.state.name = 'My New Form';
			_this.state.lastUnusedId = 0;
		}
		return _this;
	}

	_createClass(DragAndDropForm, [{
		key: 'close',
		value: function close() {
			// navigate back to main screen
			$('.create-form').addClass('hidden');
			$('.home').removeClass('hidden');

			// clear new form page
			var formInputArea = document.querySelector('.create-form');
			ReactDOM.unmountComponentAtNode(formInputArea);
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			// configure preview link
			var previewLink = $('.preview-form-link');
			previewLink.attr("href", "/viewForm/viewForm.html?u=" + this.firebaseHelper.getCurrentUserID() + "&name=" + this.databaseID);
		}
	}, {
		key: 'onDragEnd',
		value: function onDragEnd(result) {
			var _this2 = this;

			// dropped outside the list
			if (!result.destination) {
				return;
			}

			if (result.source.droppableId === 'component-library') {
				if (result.destination.droppableId === 'component-library') {
					// user is trying to reorder component library? idk. do nothing.
					return;
				}
				if (result.destination.droppableId === 'form') {
					// user is dragging component library element into form    		
					// create new item formed like this:
					// 	{
					//		id: 1,
					//		label: "Email",
					//		placeholder: "Enter Email",
					//		inputType: "shortText",
					//	},
					var inputTypeMatch = result.draggableId.match(/component-library-(.*)/);
					if (inputTypeMatch && inputTypeMatch.length > 1) {
						var inputType = inputTypeMatch[1];
						var componentNeedsOptions = inputType === 'checkboxes' || inputType === 'selects';
						var componentNeedsContent = inputType === 'checkboxes' || inputType === 'selects' || inputType === 'staticText';
						var newId = this.state.lastUnusedId;
						var newFormItem = {
							id: newId,
							idCopy: newId,
							label: 'New Input',
							placeholder: 'Placeholder',
							inputType: inputType,
							options: componentNeedsOptions ? ['Option1', 'Option2', 'Option3'] : null,
							content: componentNeedsContent ? 'Description of this field' : null
						};
						var newItems = this.insert(this.state.items, newFormItem, result.destination.index);

						this.setState({ items: newItems, lastUnusedId: this.state.lastUnusedId + 1 }, function () {
							// auto-open edit modal when new field is added
							$("#editFormComponentModal").modal('show');
							_this2.openModalEditComponent(newId);
						});
					} else {
						//show error
					}
				}
			}

			if (result.source.droppableId === 'form') {
				if (result.destination.droppableId === 'form') {
					var items = this.reorder(this.state.items, result.source.index, result.destination.index);
					this.setState({
						items: items
					});
				}
			}
		}
	}, {
		key: 'insert',
		value: function insert(list, newItem, destinationIndex) {
			var result = Array.from(list);
			result.splice(destinationIndex, 0, newItem);
			return result;
		}
	}, {
		key: 'remove',
		value: function remove(list, item) {
			var result = Array.from(list);
			var index = result.indexOf(item);
			if (index !== -1) {
				result.splice(index, 1);
			}
			return [index, result];
		}
	}, {
		key: 'reorder',
		value: function reorder(list, startIndex, endIndex) {
			var result = Array.from(list);

			var _result$splice = result.splice(startIndex, 1),
			    _result$splice2 = _slicedToArray(_result$splice, 1),
			    removed = _result$splice2[0];

			result.splice(endIndex, 0, removed);

			return result;
		}
	}, {
		key: 'openModalEditComponentForHTMLID',


		// itemId, ex: "edit-5"
		value: function openModalEditComponentForHTMLID(itemId) {
			var id = itemId.match(/edit-(.*)/);
			this.openModalEditComponent(parseInt(id[1]));
		}

		// ex: 5

	}, {
		key: 'openModalEditComponent',
		value: function openModalEditComponent(numericId) {
			var editingItem = this.getItemForId(numericId);
			this.setState({ showModalEditComponent: true, editingItem: editingItem });
		}
	}, {
		key: 'hideModalEditComponent',
		value: function hideModalEditComponent() {
			this.setState({ showModalEditComponent: false, editingItem: null });
			var editModal = document.querySelector('.edit-form-component-react-container');
			ReactDOM.unmountComponentAtNode(editModal);
		}
	}, {
		key: 'openModalDeleteComponent',
		value: function openModalDeleteComponent(itemId) {
			var _this3 = this;

			var id = itemId.match(/delete-(.*)/);
			var deleteItem = this.getItemForId(parseInt(id[1]));
			this.setState({ showModalDeleteComponent: true, deletingItem: deleteItem });
			var deleteModal = document.querySelector('.delete-form-component-react-container');
			ReactDOM.render(React.createElement(DeleteModal, {
				show: this.state.showModalDeleteComponent,
				item: deleteItem,
				onClose: this.hideModalDeleteComponent,
				onDelete: function onDelete() {
					var newItems = _this3.remove(_this3.state.items, _this3.state.deletingItem)[1];
					_this3.setState({ items: newItems });
					_this3.hideModalDeleteComponent();
				}
			}), deleteModal);
		}
	}, {
		key: 'hideModalDeleteComponent',
		value: function hideModalDeleteComponent() {
			this.setState({ showModalDeleteComponent: false, deletingItem: null });
			var deleteModal = document.querySelector('.delete-form-component-react-container');
			ReactDOM.unmountComponentAtNode(deleteModal);
		}
	}, {
		key: 'openModalRenameForm',
		value: function openModalRenameForm() {
			var renameModal = document.querySelector('.rename-form-react-container');
			ReactDOM.render(React.createElement(RenameFormModal, {
				show: this.state.showModalRenameForm,
				name: this.state.name,
				onClose: this.hideModalRenameForm,
				onSave: this.setFormName
			}), renameModal);
		}
	}, {
		key: 'hideModalRenameForm',
		value: function hideModalRenameForm() {
			this.setState({ showModalRenameForm: false });
			var renameModal = document.querySelector('#renameFormModal');
			ReactDOM.unmountComponentAtNode(renameModal);
		}
	}, {
		key: 'setFormName',
		value: function setFormName(name) {
			this.setState({ name: name });
		}
	}, {
		key: 'getItemForId',
		value: function getItemForId(id) {
			for (var ii = 0; ii < this.state.items.length; ii++) {
				var item = this.state.items[ii];
				if (item.id === id) {
					return item;
				}
			}
			return null;
		}
	}, {
		key: 'saveForm',
		value: function saveForm() {
			this.firebaseHelper.saveForm({
				id: this.databaseID,
				items: this.state.items,
				name: this.state.name,
				lastEdited: DragAndDropFormUtils.getTodaysDate(),
				lastUnusedId: this.state.lastUnusedId
			});

			// dangerous--looks like we've saved the items before the round trip is actually finished
			this.setState({
				lastSavedForm: {
					items: DragAndDropFormUtils.jsonDeepCopy(this.state.items),
					name: this.state.name
				}
			});
		}
	}, {
		key: 'formHasPendingChanges',
		value: function formHasPendingChanges() {

			// compare form names
			if (this.state.lastSavedForm.name !== this.state.name) {
				return true;
			}

			// compare length of forms
			var hasSameNumberOfFormItems = this.state.items.length === this.state.lastSavedForm.items.length;
			if (!hasSameNumberOfFormItems) {
				return true;
			}

			// compare individual items within forms
			for (var ii = 0; ii < this.state.items.length; ii++) {
				if (JSON.stringify(this.state.items[ii]) !== JSON.stringify(this.state.lastSavedForm.items[ii])) {
					return true;
				}
			}

			// current form is the same as the last saved form
			return false;
		}
	}, {
		key: 'render',
		value: function render() {
			var _this4 = this;

			var getItemStyle = function getItemStyle(isDragging, draggableStyle) {
				return Object.assign({
					userSelect: 'none',
					marginTop: 20

				}, draggableStyle);
			};

			var getListStyle = function getListStyle(isDraggingOver) {
				return {
					width: 300,
					borderRadius: 30
				};
			};

			return React.createElement(
				'div',
				null,
				React.createElement(
					'div',
					{ className: 'row' },
					React.createElement(
						'div',
						{ className: 'col-2' },
						React.createElement(
							'div',
							{ className: 'create-form-cancel', style: { textAlign: "right", cursor: "pointer" }, onClick: this.maybeClose },
							React.createElement(
								'h4',
								null,
								React.createElement('i', { style: { marginLeft: 5 }, className: 'fa fa-arrow-left fa-fw' }),
								' Back'
							)
						)
					),
					React.createElement(
						'div',
						{ className: 'col-sm-6 mb-4' },
						'Drag elements from the form component library on the left to your form on the right. You many also rearrange components within your form by dragging them.'
					),
					React.createElement('div', { 'class': 'col-sm-4' })
				),
				React.createElement(
					'div',
					{ className: 'row create-form-input-area' },
					React.createElement('div', { className: 'col-sm-1' }),
					React.createElement(
						'div',
						{ 'class': 'col-sm-10 create-form-column' },
						React.createElement(
							'div',
							{ style: { display: "flex", margin: "auto" } },
							React.createElement(
								'div',
								{ className: 'modal', id: 'editFormComponentModal', tabIndex: '-1', role: 'dialog', 'aria-labelledby': 'exampleModalLabel', 'aria-hidden': 'true' },
								React.createElement(EditModal, {
									item: this.state.editingItem,
									onClose: this.hideModalEditComponent,
									onSave: function onSave(newItem) {
										var removeResult = _this4.remove(_this4.state.items, _this4.state.editingItem);
										var index = removeResult[0];
										var result = removeResult[1];
										_this4.setState({ items: _this4.insert(result, newItem, index), showModalEditComponent: false });
									},
									show: this.state.showModalEditComponent
								})
							),
							React.createElement(
								'div',
								{ className: 'modal', id: 'confirmCloseEditModal', tabIndex: '-1', role: 'dialog', 'aria-labelledby': 'exampleModalLabel', 'aria-hidden': 'true' },
								React.createElement(ConfirmCloseModal, { confirm: this.close })
							),
							React.createElement(
								DragDropContext,
								{ onDragEnd: this.onDragEnd },
								React.createElement(
									Droppable,
									{ droppableId: 'component-library' },
									function (provided, snapshot) {
										return React.createElement(
											'div',
											{ className: 'card shadow' },
											React.createElement(
												'div',
												{ className: 'card-header py-3 d-flex flex-row align-items-center justify-content-between' },
												React.createElement(
													'h6',
													{ className: 'm-0 font-weight-bold text-primary' },
													'Form Element Library'
												)
											),
											React.createElement(
												'div',
												{
													className: 'card-body',
													ref: provided.innerRef
												},
												COMPONENT_LIBRARY.map(function (item, index) {
													var input = null;
													var id = "component-library-" + item.inputType;
													input = DragAndDropFormUtils.getInputElementForType(item, id);
													return React.createElement(
														Draggable,
														{ key: item.id, draggableId: id, index: index },
														function (provided, snapshot) {
															return React.createElement(
																'div',
																Object.assign({ className: 'form-group card mb-4 py-3 border-left-primary shadow',
																	ref: provided.innerRef
																}, provided.draggableProps, provided.dragHandleProps, {
																	style: getItemStyle(snapshot.isDragging, provided.draggableProps.style)
																}),
																React.createElement(
																	'div',
																	{ style: { paddingLeft: 15, paddingRight: 15 } },
																	React.createElement(
																		'label',
																		{
																			className: 'form-component-label d-flex flex-row justify-content-between',
																			htmlFor: id, style: { width: "100%" } },
																		item.label,
																		React.createElement('i', { style: { marginLeft: 5 }, className: 'fa fa-arrows-alt fa-fw' })
																	),
																	input
																)
															);
														}
													);
												}),
												provided.placeholder
											)
										);
									}
								),
								React.createElement(
									Droppable,
									{ droppableId: 'form' },
									function (provided, snapshot) {
										return React.createElement(
											'div',
											{
												className: 'panel panel-default col-sm-7 card shadow',
												id: 'form-drop-zone',
												style: { marginLeft: 40, height: "fit-content", background: snapshot.isDraggingOver ? '#eaf7ed' : 'white' } },
											React.createElement(
												'div',
												{
													className: 'panel-body new-form-panel-body d-flex flex-column',
													ref: provided.innerRef,
													style: {} },
												React.createElement(
													'div',
													{ className: 'd-flex' },
													React.createElement(
														'div',
														{ className: 'form-title' },
														React.createElement(
															'h4',
															null,
															_this4.state.name
														)
													),
													React.createElement(
														'div',
														{ className: 'form-controls-container' },
														React.createElement(
															'div',
															{ className: 'rename-form-link',
																onClick: _this4.openModalRenameForm,
																'data-toggle': 'modal',
																'data-target': '#renameFormModal' },
															React.createElement(
																'a',
																null,
																'Rename'
															)
														),
														React.createElement(
															'a',
															{ className: 'preview-form-link btn btn-outline-secondary',
																target: '_blank',
																href: '' },
															'Preview'
														),
														React.createElement(
															'button',
															{
																disabled: !_this4.formHasPendingChanges(),
																onClick: _this4.saveForm,
																type: 'button',
																className: 'save-form-button btn btn-primary' },
															'Save'
														)
													)
												),
												React.createElement(
													'form',
													null,
													_this4.state.items.length === 0 ? React.createElement(
														'div',
														{ className: 'drag-components-here' },
														'Drag components from the left side here'
													) : null,
													_this4.state.items.map(function (item, index) {
														var input = null;
														var id = "input" + index;
														input = DragAndDropFormUtils.getInputElementForType(item, id);
														return React.createElement(
															Draggable,
															{ key: item.id, draggableId: id, index: index },
															function (provided, snapshot) {
																return React.createElement(
																	'div',
																	Object.assign({ className: 'form-group',
																		ref: provided.innerRef
																	}, provided.draggableProps, provided.dragHandleProps, {
																		style: getItemStyle(snapshot.isDragging, provided.draggableProps.style)
																	}),
																	React.createElement(
																		'div',
																		{ style: { display: "flex", flexDirection: "row" } },
																		React.createElement(
																			'label',
																			{ className: 'form-component-label', htmlFor: id },
																			item.label
																		),
																		React.createElement('div', { style: { flexGrow: 1 } }),
																		React.createElement(
																			'div',
																			{ style: { minWidth: 130 }, className: 'form-component-edit-delete-move-icons-container' },
																			React.createElement(
																				'div',
																				{
																					className: 'form-component-link',
																					'data-toggle': 'modal',
																					'data-target': '#editFormComponentModal',
																					onClick: function onClick(target) {
																						_this4.openModalEditComponentForHTMLID(target.nativeEvent.target.id);
																					},
																					style: { display: "inline", marginLeft: 10 } },
																				React.createElement(
																					'a',
																					{ id: 'edit-' + item.id },
																					'Edit'
																				)
																			),
																			React.createElement(
																				'div',
																				{
																					className: 'form-component-link',
																					'data-toggle': 'modal',
																					'data-target': '#deleteFormComponentModal',
																					style: { display: "inline", marginLeft: 10 },
																					onClick: function onClick(target) {
																						_this4.openModalDeleteComponent(target.nativeEvent.target.id);
																					} },
																				React.createElement(
																					'a',
																					{ id: 'delete-' + item.id },
																					'Delete'
																				)
																			),
																			React.createElement('i', { style: { marginLeft: 5 }, className: 'fa fa-arrows-alt fa-fw' })
																		)
																	),
																	input
																);
															}
														);
													})
												),
												provided.placeholder
											)
										);
									}
								)
							)
						)
					),
					React.createElement('div', { className: 'col-sm-1' })
				)
			);
		}
	}]);

	return DragAndDropForm;
}(React.Component);