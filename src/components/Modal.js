import React from "react";
import ReactDOM from "react-dom";

const Modal = props => {
  console.log('Modal show prop:', props.show);
  if (!props.show) return null;
  return ReactDOM.createPortal(
    <div
      className="modal fade show"
      id={props.id}
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
      tabIndex="-1"
      onClick={() => props.onDismiss()}
    >
      <div
        className="modal-dialog"
        onClick={e => e.stopPropagation()}
        role="document"
      >
        <div className="modal-content" style={{ border: '3px solid red' }}>
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
