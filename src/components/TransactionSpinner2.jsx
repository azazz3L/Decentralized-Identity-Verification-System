import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Spinner from "./Spinner";

export default function TransactionSpinner2({ loading, transactionComplete, transactionIncomplete }) {
  const [shouldRender, setShouldRender] = useState(loading);

  // Trigger re-render when loading state changes to handle showing/hiding the spinner.
  useEffect(() => {
    setShouldRender(loading);
  }, [loading]);

  // Handle displaying icons with a delay after loading is finished.
  useEffect(() => {
    let timerId;
    if (!loading && (transactionComplete || transactionIncomplete)) {
      setShouldRender(true); // Show the card immediately when transaction status is available
      timerId = setTimeout(() => {
        setShouldRender(false); // Hide the card after 2 seconds
      }, 4000);
    }
    // Cleanup timeout when component unmounts or if the loading state changes again
    return () => clearTimeout(timerId);
  }, [loading, transactionComplete, transactionIncomplete]);

  // Determine what content to render based on the props
  let content;
  if (loading) {
    content = <Spinner />;
  } else if (transactionComplete) {
    content = (
    <div className="flex flex-col items-center justify-center gap-4">
    <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#00e62e" }} className="text-7xl" />
    <h3 className="font-bold text-2xl" >Transaction Successful</h3>
    </div>
    );
  } else if (transactionIncomplete) {
    content = (
      <div className="flex flex-col items-center justify-center gap-4">
        <FontAwesomeIcon icon={faCircleXmark} className="text-red-500 text-7xl" />
        <h3 className="font-bold text-2xl" >Transaction Failed</h3>
      </div>
    );
  }

  // Render nothing if shouldRender is false
  if (!shouldRender) {
    return null;
  }

  // Only render the content if shouldRender is true
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw', // to center the card horizontally in the whole viewport
    }}>
      <Card 
        shadow="sm" 
        radius="lg" 
        fullWidth={false} 
        isBlurred={true}
        style={{
          minWidth: '300px',
          minHeight: '350px',
          backgroundColor: '#333', // for a dark theme card
          color: '#fff', // text color for the content
          display: 'flex', // to use flexbox for centering the content
          flexDirection: 'column', // stack children vertically
          justifyContent: 'center', // center children vertically
          alignItems: 'center', // center children horizontally
        }}
      >
          <CardHeader className="flex flex-col items-center justify-center pb-0 pt-2 px-4">
          <h4 className="font-bold text-2xl">Transaction Status</h4>
        </CardHeader>
        <CardBody className="flex justify-center items-center bottom-3">
          {content}
        </CardBody>
      </Card>
    </div>
  );
}
