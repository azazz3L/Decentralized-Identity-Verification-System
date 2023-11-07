import React from "react";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";
import { useTheme } from "next-themes";
export default function RequesterCheckbox(props) {
  const { theme } = useTheme();

  // Using the theme.type to determine if the theme is dark
  const isDark = theme.type === 'dark';



  return (
    <CheckboxGroup label="Select Parameters" color="success" onValueChange={(value) => {props.value(value)}} >
      <Checkbox value="dob">Date Of Birth</Checkbox>
      <Checkbox value="address" >Address</Checkbox>
      <Checkbox value="name" >Name</Checkbox>
      <Checkbox value="phone" >Phone</Checkbox>
    </CheckboxGroup>
  );
}
