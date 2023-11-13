import React from "react";
import { Spinner } from "@nextui-org/react";

export default function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <Spinner size="lg" label="Loading..." color="secondary" />
    </div>
  );
}
