import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardBody, Button } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { Progress } from "@nextui-org/react";


function FileUpload(props) {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const { theme } = useTheme();
  const shadowClass = theme === "dark" ? "shadow-white" : "shadow-black";
  const fileInputRef = useRef(null);
  let userData;
  const onFileChange = event => {
    setFile(event.target.files[0]);
    setUploadStatus('');
    setUploading(false);
  };

  const onFileUpload = () => {
    if (!file) {
      setUploadStatus('Please select a file first.');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
  
    axios.post('https://guarded-eyrie-17012-94648af88a8b.herokuapp.com/upload-aadhaar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      const extractedData = response.data.extracted_texts[0];
      userData = {
        aadharNumber: extractedData.texts.roi_1,
        name: extractedData.texts.roi_2,
        dateOfBirth: extractedData.texts.roi_3,
        gender: extractedData.texts.roi_4,
        phoneNumber: extractedData.texts.roi_5,
        residentAddress: extractedData.texts.roi_6.replace(/\n/g, ', ')
      };
      setExtractedData(extractedData);
      setUploadStatus('File uploaded successfully! Check below for details.');
      setUploading(false);
      props.setUserData(userData);
      console.log(userData);
      props.jsonObject(true);
    })
    .catch(error => {
      console.error('Error uploading file', error);
      setUploadStatus(`Error uploading file: ${error.message}`);
      setUploading(false);
    });
  };

  const handleClick = () => {
    fileInputRef.current.click();
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
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
            <div className="flex flex-col items-center mb-5">
              <h4 className="font-bold text-large">USER DOES NOT EXIST</h4>
              <h4 className="font-bold text-large">Upload Your Aadhar Card PDF From UIDAI</h4>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileChange}
              style={{ display: 'none' }}
            />
            <div className="flex items-center justify-center w-full">
              <Button color="success" auto onClick={handleClick}>
                Choose File
              </Button>
              {file && <span className="ml-2">{file.name}</span>}
            </div>
          </CardHeader>
          <CardBody className="flex flex-col items-center">
            {file && ( uploading ? <Progress
                                  size="sm"
                                  isIndeterminate
                                  color='secondary'
                                  aria-label="Loading..."
                                  className="max-w-md"
                                />:
              <Button onClick={onFileUpload} color="secondary" disabled={uploading} auto style={{ width: '50%' }}>
               Upload!
              </Button>
            )}
            <p>{uploadStatus}</p>
            {extractedData && (
              <div>
                <p><strong>Aadhar Number:</strong> {extractedData.texts.roi_1}</p>
                <p><strong>Name:</strong> {extractedData.texts.roi_2}</p>
                <p><strong>Date of Birth:</strong> {extractedData.texts.roi_3}</p>
                <p><strong>Gender:</strong> {extractedData.texts.roi_4}</p>
                <p><strong>Phone Number:</strong> {extractedData.texts.roi_5}</p>
                <p><strong>Address:</strong> {extractedData.texts.roi_6.replace(/\n/g, ', ')}</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default FileUpload;
