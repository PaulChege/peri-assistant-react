import React from "react";
import ReactDOM from "react-dom";

const Modal = props => {
  return ReactDOM.createPortal(
    <div
      className="modal fade"
      id="primaryModal"
      onClick={() => props.onDismiss()}
    >
      <div
        className="modal-dialog"
        onClick={e => e.stopPropagation()}
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">{props.title}</div>
          <div className="modal-body">{props.content}</div>
          <div className="modal-footer">{props.actions}</div>
        </div>
      </div>
    </div>,
    document.querySelector("#modal")
  );
};

export default Modal;
