import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardBody, Button } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import { useTheme } from "next-themes";

export default function SelectModal(props) {
  const { theme } = useTheme();
  const shadowClass = theme === "dark" ? "shadow-white" : "shadow-black";
  const buttonStyle =
    theme === "dark"
      ? "bg-black text-white border-white" // White background with black text for dark theme
      : "bg-white text-black border-black"; // Black background with white text for light theme

  const handleUserClick = () => {
    props.setUser(true);
  };

  const handleRequesterClick = () => {
    props.setRequester(true);
  };
  return (
    <>
      <div className="flex justify-center items-center py-20">
        <Card
          shadow="lg"
          className={`min-w-[475px] ${
            theme === "dark" ? "light" : "dark"
          } bg-background text-foreground ${shadowClass} py-3`}
        >
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <div className="w-full flex flex-col items-center mb-5">
              <h4 className="font-bold text-large ">SELECT OPERATION</h4>
            </div>
          </CardHeader>
          <CardBody className="overflow-visible py-2">
            <div className="flex h-5 items-center space-x-4">
              <Button
                to="/user"
                as={Link}
                size="md"
                className={`${buttonStyle} `}
                fullWidth="true"
                onClick={handleUserClick}
              >
                USER
              </Button>
              <Divider orientation="vertical" />
              <Button
                to="/requester"
                as={Link}
                size="md"
                className={`${buttonStyle} `}
                fullWidth="true"
                onClick={handleRequesterClick}
              >
                REQUESTER
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
