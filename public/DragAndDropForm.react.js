var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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

				_this.state = { items: props.formItems.items, componentLibrary: props.componentLibrary.items };
				_this.onDragEnd = _this.onDragEnd.bind(_this);
				return _this;
		}

		_createClass(DragAndDropForm, [{
				key: 'onDragEnd',
				value: function onDragEnd(result) {
						// dropped outside the list
						if (!result.destination) {
								return;
						}
						console.log(result);

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
														id: 5, // FIXME
														label: 'New Input',
														placeholder: 'Placeholder',
														inputType: inputTypeMatch[1]
												};
												console.log("dropping element with input type " + newFormItem.inputType);
												var newItems = this.insert(this.state.items, newFormItem, result.destination.index);
												this.setState({ items: newItems });
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
				key: 'render',
				value: function render() {
						var _this2 = this;

						console.log(this.state);

						var getItemStyle = function getItemStyle(isDragging, draggableStyle) {
								return Object.assign({
										// some basic styles to make the items look a bit nicer
										userSelect: 'none',

										// change background colour if dragging
										background: isDragging ? 'lightgrey' : 'white'

								}, draggableStyle);
						};

						var getListStyle = function getListStyle(isDraggingOver) {
								return {
										width: 500,
										borderRadius: 30
								};
						};

						return React.createElement(
								DragDropContext,
								{ onDragEnd: this.onDragEnd },
								React.createElement(
										Droppable,
										{ droppableId: 'component-library' },
										function (provided, snapshot) {
												return React.createElement(
														'div',
														{
																ref: provided.innerRef,
																style: getListStyle(snapshot.isDraggingOver)
														},
														_this2.state.componentLibrary.map(function (item, index) {
																var input = null;
																var id = "component-library-" + item.inputType;
																if (item.inputType === "shortText") {
																		input = React.createElement('input', { disabled: true, type: 'email', 'class': 'form-control', id: id, 'aria-describedby': 'emailHelp', placeholder: item.placeholder });
																}
																if (item.inputType === "longText") {
																		input = React.createElement('textarea', { disabled: true, 'class': 'form-control', id: id, rows: '3', placeholder: item.placeholder });
																}
																return React.createElement(
																		Draggable,
																		{ key: item.id, draggableId: id, index: index },
																		function (provided, snapshot) {
																				return React.createElement(
																						'div',
																						Object.assign({ 'class': 'form-group',
																								ref: provided.innerRef
																						}, provided.draggableProps, provided.dragHandleProps, {
																								style: getItemStyle(snapshot.isDragging, provided.draggableProps.style)
																						}),
																						React.createElement(
																								'label',
																								{ 'for': id },
																								item.label
																						),
																						input
																				);
																		}
																);
														}),
														provided.placeholder
												);
										}
								),
								React.createElement(
										Droppable,
										{ droppableId: 'form' },
										function (provided, snapshot) {
												return React.createElement(
														'div',
														{ className: 'panel panel-default', style: { marginLeft: 20 } },
														React.createElement(
																'div',
																{
																		className: 'panel-body',
																		ref: provided.innerRef,
																		style: getListStyle(snapshot.isDraggingOver)
																},
																_this2.state.items.map(function (item, index) {
																		var input = null;
																		var id = "input" + index;
																		if (item.inputType === "shortText") {
																				input = React.createElement('input', { disabled: true, type: 'email', 'class': 'form-control', id: id, 'aria-describedby': 'emailHelp', placeholder: item.placeholder });
																		}
																		if (item.inputType === "longText") {
																				input = React.createElement('textarea', { disabled: true, 'class': 'form-control', id: id, rows: '3', placeholder: item.placeholder });
																		}
																		return React.createElement(
																				Draggable,
																				{ key: item.id, draggableId: id, index: index },
																				function (provided, snapshot) {
																						return React.createElement(
																								'div',
																								Object.assign({ 'class': 'form-group',
																										ref: provided.innerRef
																								}, provided.draggableProps, provided.dragHandleProps, {
																										style: getItemStyle(snapshot.isDragging, provided.draggableProps.style)
																								}),
																								React.createElement(
																										'label',
																										{ 'for': id },
																										item.label
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
						);
				}
		}]);

		return DragAndDropForm;
}(React.Component);