import React from "react";
import {Spinner} from "@nextui-org/react";

export default function SpinnerModal() {
  return (
    <div className="flex gap-4">
      <Spinner size="lg" style={{ transform: 'scale(1.5)' }} label="Loading" color="primary" labelColor="primary" />

    </div> 
  );
}
