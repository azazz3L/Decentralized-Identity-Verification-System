import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Divider, Textarea, Button } from "@nextui-org/react";
import { useTheme } from "next-themes";
import RequesterCheckbox from "./RequesterCheckbox";

export default function CardUI() {
  const { theme } = useTheme();
  const shadowClass = theme === 'dark' ? 'shadow-white' : 'shadow-black';
  const [value, setValue] = useState("");
  const [invalid, setInvalid] = useState(false)
  // You can add more styles or logic to handle other theme-dependent styling

  useEffect(() => {
    // Update the document title using the browser API
    value.startsWith("0x") ? setInvalid(false) : setInvalid(true)
  },[value]);

  const buttonStyle = theme === 'dark'
  ? 'bg-black text-white border-white' // White background with black text for dark theme
  : 'bg-white text-black border-black'; // Black background with white text for light theme


  return (
    <div className="flex justify-center items-center "> 
      <Card shadow="lg" className={`min-w-[475px] ${theme === 'dark' ? 'light' : 'dark'} bg-background text-foreground ${shadowClass}`} >
        <CardHeader>
          <div className="w-full flex flex-col">
            <label htmlFor="user-address" className="mb-2" >
              Enter User Ethereum Address:
            </label>
            <div className="flex items-center space-x-2">
              <Textarea
                id="user-address"
                variant="bordered"
                placeholder="0x..."
                minRows={1}
                isInvalid={invalid}
                value={value}
                onValueChange={setValue}
              />
              <Button size="sm" className={`${buttonStyle}`}>Select User</Button>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <RequesterCheckbox theme={theme}/>
        </CardBody>
        <CardFooter>
          {/* Footer content here */}
        </CardFooter>
      </Card>
    </div>
  );
}
