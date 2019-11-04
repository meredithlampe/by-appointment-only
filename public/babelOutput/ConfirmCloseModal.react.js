var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

var ConfirmCloseModal = function (_React$Component) {
  _inherits(ConfirmCloseModal, _React$Component);

  function ConfirmCloseModal(props) {
    _classCallCheck(this, ConfirmCloseModal);

    var _this = _possibleConstructorReturn(this, (ConfirmCloseModal.__proto__ || Object.getPrototypeOf(ConfirmCloseModal)).call(this, props));

    _this.props = props;
    _this.state = {};
    return _this;
  }

  _createClass(ConfirmCloseModal, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'modal-dialog', role: 'document' },
        React.createElement(
          'div',
          { className: 'modal-content' },
          React.createElement(
            'div',
            { className: 'modal-header' },
            React.createElement(
              'h5',
              { className: 'modal-title', id: 'exampleModalLabel' },
              'Unsaved Changes'
            ),
            React.createElement(
              'button',
              { className: 'close dismiss-confirm-close-modal', type: 'button', 'data-dismiss': 'modal', 'aria-label': 'Close' },
              React.createElement(
                'span',
                { 'aria-hidden': 'true' },
                '\xD7'
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'modal-body' },
            'You have unsaved changes to this form. Are you sure you want to go back?'
          ),
          React.createElement(
            'div',
            { className: 'modal-footer' },
            React.createElement(
              Button,
              { 'data-dismiss': 'modal', bsStyle: 'primary' },
              'Cancel'
            ),
            React.createElement(
              Button,
              { 'data-dismiss': 'modal', className: 'btn btn-secondary', onClick: this.props.confirm },
              'Discard Changes'
            )
          )
        )
      );
    }
  }]);

  return ConfirmCloseModal;
}(React.Component);

export default ConfirmCloseModal;