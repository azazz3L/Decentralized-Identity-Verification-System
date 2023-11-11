import React from 'react'

export default function Alert1(props) {
  return (
    <div style={{ height: '50px', overflow: 'hidden' }}>
      {props.alert && (
        <div className={`alert alert-${props.alert.type}`} role="alert">
          <strong>{props.alert.message}</strong>
        </div>
      )}
    </div>
  );
}
