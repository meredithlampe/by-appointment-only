var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import EditModal from './Modal.react.js';
import DragAndDropFormUtils from './DragAndDropFormUtils.js';
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
		console.log("saving firebase helper");
		console.log(props.firebaseHelper);
		_this.state = {
			items: props.formItems.items,
			name: props.formName,
			lastUnusedId: props.lastUnusedId,
			showModalEditComponent: false,
			editingItem: null
		};
		_this.onDragEnd = _this.onDragEnd.bind(_this);
		_this.openModalEditComponent = _this.openModalEditComponent.bind(_this);
		_this.hideModalEditComponent = _this.hideModalEditComponent.bind(_this);
		_this.saveForm = _this.saveForm.bind(_this);
		return _this;
	}

	_createClass(DragAndDropForm, [{
		key: 'onDragEnd',
		value: function onDragEnd(result) {
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
						var newFormItem = {
							id: this.state.lastUnusedId,
							idCopy: this.state.lastUnusedId,
							label: 'New Input',
							placeholder: 'Placeholder',
							inputType: inputType,
							options: componentNeedsOptions ? ['Option1', 'Option2', 'Option3'] : null,
							content: componentNeedsContent ? 'Description of this field' : null
						};
						var newItems = this.insert(this.state.items, newFormItem, result.destination.index);
						this.setState({ items: newItems, lastUnusedId: this.state.lastUnusedId + 1 });
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
		key: 'openModalEditComponent',
		value: function openModalEditComponent(itemId) {
			var id = itemId.match(/edit-(.*)/);
			var editingItem = this.getItemForId(parseInt(id[1]));
			this.setState({ showModalEditComponent: true, editingItem: editingItem });
		}
	}, {
		key: 'hideModalEditComponent',
		value: function hideModalEditComponent() {
			this.setState({ showModalEditComponent: false, editingItem: null });
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
			console.log("saving form");
			this.firebaseHelper.saveForm(this.state.name, this.state.items);
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

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

			var editingItem = this.state.editingItem;
			var editModal = this.state.showModalEditComponent ? React.createElement(EditModal, {
				show: this.state.showModalEditComponent,
				item: editingItem,
				onClose: this.hideModalEditComponent }) : null;

			return React.createElement(
				'div',
				{ style: { display: "flex" } },
				editModal,
				React.createElement(
					DragDropContext,
					{ onDragEnd: this.onDragEnd },
					React.createElement(
						Droppable,
						{ droppableId: 'component-library' },
						function (provided, snapshot) {
							return React.createElement(
								'div',
								{ className: 'well' },
								React.createElement(
									'p',
									{ className: 'lead' },
									'Form Element Library'
								),
								React.createElement(
									'div',
									{
										ref: provided.innerRef,
										style: {
											width: 300,
											borderRadius: 30
										}
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
													Object.assign({ className: 'form-group',
														ref: provided.innerRef
													}, provided.draggableProps, provided.dragHandleProps, {
														style: getItemStyle(snapshot.isDragging, provided.draggableProps.style)
													}),
													React.createElement(
														'label',
														{ className: 'form-component-label', htmlFor: id },
														item.label,
														React.createElement('i', { style: { marginLeft: 5 }, className: 'fa fa-arrows fa-fw' })
													),
													input
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
								{ className: 'panel panel-default', style: { marginLeft: 40, height: "fit-content" } },
								React.createElement(
									'div',
									{
										className: 'panel-body new-form-panel-body',
										ref: provided.innerRef,
										style: {
											width: 500,
											background: snapshot.isDraggingOver ? '#eaf7ed' : 'white'
										} },
									React.createElement(
										'p',
										{ className: 'lead', 'data-toggle': 'modal', 'data-target': '#myModal' },
										_this2.state.name,
										React.createElement(
											'small',
											{ style: { marginLeft: 20 } },
											React.createElement(
												'a',
												{ href: '#' },
												'Rename'
											)
										),
										React.createElement(
											'div',
											{ style: { float: "right" } },
											React.createElement(
												'button',
												{
													className: 'preview-form-link btn btn-outline btn-default',
													style: { display: "inline", marginLeft: 15 } },
												'Preview'
											),
											React.createElement(
												'button',
												{ onClick: _this2.saveForm, type: 'button', 'class': 'save-form-button btn btn-primary' },
												'Save'
											)
										)
									),
									_this2.state.items.map(function (item, index) {
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
															'div',
															null,
															React.createElement(
																'label',
																{ className: 'form-component-label', htmlFor: id },
																item.label
															),
															React.createElement(
																'div',
																{
																	className: 'form-component-link',
																	'data-toggle': 'modal',
																	'data-target': '#exampleModal',
																	onClick: function onClick(target) {
																		_this2.openModalEditComponent(target.nativeEvent.target.id);
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
																{ className: 'form-component-link', style: { display: "inline", marginLeft: 10 } },
																React.createElement(
																	'a',
																	null,
																	'Delete'
																)
															)
														),
														React.createElement('div', { style: { flexGrow: 1 } }),
														React.createElement(
															'div',
															null,
															React.createElement('i', { style: { marginLeft: 5 }, className: 'fa fa-arrows fa-fw' })
														)
													),
													input
												);
											}
										);
									}),
									provided.placeholder
								)
							);
						}
					)
				)
			);
		}
	}]);

	return DragAndDropForm;
}(React.Component);