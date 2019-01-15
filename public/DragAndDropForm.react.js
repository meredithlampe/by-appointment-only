var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ModalEditFormComponent from './Modal.react.js';

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

		_this.state = {
			items: props.formItems.items,
			componentLibrary: props.componentLibrary.items,
			name: props.formName,
			lastUnusedId: props.lastUnusedId,
			showModalEditComponent: false
		};
		_this.onDragEnd = _this.onDragEnd.bind(_this);
		_this.openModalEditComponent = _this.openModalEditComponent.bind(_this);
		_this.hideModalEditComponent = _this.hideModalEditComponent.bind(_this);
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
						var newFormItem = {
							id: this.state.lastUnusedId, // FIXME
							label: 'New Input',
							placeholder: 'Placeholder',
							inputType: inputTypeMatch[1]
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
		value: function openModalEditComponent() {
			this.setState({ showModalEditComponent: true });
		}
	}, {
		key: 'hideModalEditComponent',
		value: function hideModalEditComponent() {
			this.setState({ showModalEditComponent: false });
		}
	}, {
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
			// const getRenameFormModal = () => {

			//    	return (
			// <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			//        <div className="modal-dialog">
			//            <div className="modal-content">
			//                <div className="modal-header">
			//                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
			//                    <h4 className="modal-title" id="myModalLabel">Create New Form</h4>
			//                </div>
			//                <div className="modal-body">
			//                  <form role="form">
			//                      <div className="form-group">
			//                          <label>Name</label>
			//                          <input className="form-control" placeholder="e.g. December Bookings"></input>
			//                          <p className="help-block">Only you will see the form name</p>
			//                      </div>
			//                      <div className="form-group">
			//                          <label>Form Content</label>
			//                          <p className="help-block">Configure how the form will appear for your applicants</p>
			//                      </div>
			//                  </form>
			//                </div>
			//                <div className="modal-footer">
			//                    <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
			//                    <button type="button" className="btn btn-primary">Create Form</button>
			//                </div>
			//            </div>
			//        </div>
			//     </div>
			//    );
			//    }

			return React.createElement(
				'div',
				{ style: { display: "flex" } },
				React.createElement(
					ModalEditFormComponent,
					{ show: this.state.showModalEditComponent,
						onClose: this.hideModalEditComponent },
					'Modal content'
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
									_this2.state.componentLibrary.map(function (item, index) {
										var input = null;
										var id = "component-library-" + item.inputType;
										input = _this2.getInputElementForType(item.inputType, id, item.placeholder);
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
											'button',
											{
												className: 'preview-form-link btn btn-outline btn-default',
												style: { display: "inline", marginLeft: 15, float: "right" } },
											'Preview'
										)
									),
									_this2.state.items.map(function (item, index) {
										var input = null;
										var id = "input" + index;
										input = _this2.getInputElementForType(item.inputType, id, item.placeholder);
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
																{ className: 'form-component-link', 'data-toggle': 'modal', 'data-target': '#exampleModal', onClick: _this2.openModalEditComponent, style: { display: "inline", marginLeft: 10 } },
																React.createElement(
																	'a',
																	null,
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