import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Textarea,
  Button,
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import RequesterCheckbox from "./RequesterCheckbox";
import { ethers } from "ethers";
import datarequestabi from "../Datarequestabi.json";
import ProgressBar from "./ProgressBar";

export default function CardUI(props) {
  //Blockchain Interaction
  const { theme } = useTheme();
  const [selectedFields, setSelectedFields] = useState([]);
  const contractAddress = import.meta.env.VITE_DATA_REQUEST_CONTRACT;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const dataRequestContract = new ethers.Contract(
    contractAddress,
    datarequestabi,
    signer
  );
  let [loading, setLoading] = useState(false);
  let [transactionComplete, setTransactionComplete] = useState(false);
  let [transactionIncomplete, setTransactionIncomplete] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const buttonStyle =
    theme === "dark"
      ? "bg-black text-white border-white" // White background with black text for dark theme
      : "bg-white text-black border-black"; // Black background with white text for light theme

  //Themes

  const shadowClass = theme === "dark" ? "shadow-white" : "shadow-black";
  const [value, setValue] = useState("");
  const [invalid, setInvalid] = useState(false);
  // You can add more styles or logic to handle other theme-dependent styling

  useEffect(() => {
    // Update the document title using the browser API
    value.startsWith("0x") && value.length === 42
      ? setInvalid(false)
      : setInvalid(true);
    value.startsWith("0x") && value.length === 42
      ? setSelectedUser(value)
      : setSelectedUser(null);
  }, [value]);

  // Functions
  const handleRequest = async () => {
    console.log(selectedFields);
    if (!selectedUser || selectedFields.length === 0) {
      props.notifyWarn(theme, "Please Select a User and Data Fields");
      return;
    }

    if (props.signerAddress == selectedUser) {
      props.notifyWarn(theme, "User and Signer Cannot be the same");
      return;
    }

    try {
      setLoading(true);
      const tx = await dataRequestContract.requestData(
        selectedUser,
        selectedFields
      );
      await tx.wait();
      setLoading(false);
      setTransactionIncomplete(false);
      setTransactionComplete(true);
      props.notifySuccess(theme, "Request Submitted Successfully");
    } catch (err) {
      console.error("Error submitting request:", err);
      props.notifyDanger(theme, "Request Unsuccessful");
      setLoading(false);
      setTransactionComplete(false);
      setTransactionIncomplete(true);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center py-20">
        <Card
          shadow="lg"
          className={`min-w-[475px] ${
            theme === "dark" ? "light" : "dark"
          } bg-background text-foreground ${shadowClass}`}
        >
          <CardHeader>
            <div className="w-full flex flex-col">
              <label
                htmlFor="user-address"
                className="mb-2"
                style={{ fontWeight: "bold" }}
              >
                Enter User Ethereum Address
              </label>
              <div className="flex items-center space-x-2">
                <Textarea
                  id="user-address"
                  variant="bordered"
                  placeholder="0x..."
                  maxRows={1}
                  isInvalid={invalid}
                  value={value}
                  onValueChange={setValue}
                />
              </div>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <RequesterCheckbox theme={theme} value={setSelectedFields} />
          </CardBody>
          <Divider />
          <CardFooter>
            <Button
              size="sm"
              className={`${buttonStyle}`}
              fullWidth="true"
              onClick={handleRequest}
            >
              Request Data
            </Button>
          </CardFooter>
          <Divider />
          {loading && <ProgressBar />}
        </Card>
      </div>
    </>
  );
}
