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
        <Checkbox value="dob">Date Of Birth</Checkbox>
        <Checkbox value="address">Address</Checkbox>
        <Checkbox value="name">Name</Checkbox>
        <Checkbox value="phone">Phone</Checkbox>
      </CheckboxGroup>
    </div>
  );
}
