import React from "react";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";

export default function RequesterCheckbox(props) {
  return (
    <div>
      <label style={{ fontWeight: "bold" }}>Select Parameters</label>
      <CheckboxGroup
        onValueChange={(value) => props.value(value)}
        orientation="horizontal"
        color="secondary"
        className="pt-1"
      >
        <Checkbox value="aadharNumber">Aadhar Card Number</Checkbox>
        <Checkbox value="name">Name</Checkbox>
        <Checkbox value="gender">Gender</Checkbox>
        <Checkbox value="phone">Phone</Checkbox>
        <Checkbox value="dateOfBirth">Date Of Birth</Checkbox>
        <Checkbox value="residentAddress">Address</Checkbox>
      </CheckboxGroup>
    </div>
  );
}
