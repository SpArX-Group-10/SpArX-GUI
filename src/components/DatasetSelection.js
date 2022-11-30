import { Box, Button, Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";
import Papa from "papaparse";
import React, { useEffect } from "react";
import { useState } from "react";
import Dataset from "../classes/Dataset";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import NextButton from "./NextButton";

function FeatureSelection({ usableHeaders, setSelectedFeatures, selectedFeatures }) {
  const handleCheckboxesChange = (i) => {
    let newFeatures = selectedFeatures.slice();
    newFeatures[i] = !newFeatures[i];
    setSelectedFeatures(newFeatures);
  };

  const checkboxes = usableHeaders.map((header, i) => (
    <Box key={header + i} style={{}}>
      <FormControlLabel
        control={
          <Checkbox
            checked={selectedFeatures[i]}
            id={header}
            onChange={(_event) => handleCheckboxesChange(i)}
            sx={{
              color: "#1565C0",
              "&.Mui-checked": {
                color: "#1565C0",
              },
            }}
          />
        }
        label={header}
        labelPlacement="end"
      />
    </Box>
  ));

  return (
    <Box
      style={{
        textAlign: "left",
        justifyContent: "center",
        alignItems: "start",
        display: "flex",
        height: "100vh",
        overflow: "auto",
        marginTop: 20,
      }}
    >
      <Stack>{checkboxes}</Stack>
    </Box>
  );
}

function DatasetSelection({ selectedDatasetCallback }) {
  const [dataset, setDataset] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fileName, setFileName] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState(null);

  const datasetLoaded = (data) => {
    setDataset(data);
    setHeaders(Object.keys(data[0]));
  };

  const featureCallback = (features) => {
    let datasetData = Dataset.constructFilteredData(dataset, headers, features);
    selectedDatasetCallback(datasetData);
  };

  const changeHandler = (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    setFileName(event.target.files[0].name);
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: function (results) {
        setDataset(results.data);
        let usableHeaders = Object.keys(results.data[0]).slice(0, -1);
        setSelectedFeatures(Array(usableHeaders.length).fill(true));
        setHeaders(Object.keys(results.data[0]));
      },
    });
  };

  return (
    <Box style={{ height: "100%", width: "100%" }}>
      <Box
        style={{
          justifyContent: "center",
          alignItems: "start",
          display: "flex",
          height: "100%",
          width: "100%",
        }}
      >
        <Stack style={{ height: "100%", position: "relative" }}>
          <Stack direction={"row"} style={{ marginTop: 15, marginRight: 15 }}>
            {/* File Uploader */}
            <Button variant="contained" component="label" style={{ backgroundColor: "#1565C0" }}>
              <UploadFileIcon />
              Upload Dataset
              <input
                type="file"
                name="file"
                accept=".csv,.txt,.data"
                onChange={changeHandler}
                style={{ display: "none" }}
              />
            </Button>
            <Box
              style={{
                border: "1px solid black",
                borderRadius: "4px",
                marginLeft: 15,
                width: "300px",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            >
              <Typography>{fileName}</Typography>
            </Box>
          </Stack>
          <Typography style={{ marginTop: 35 }}>Select desired features</Typography>
          {headers.length !== 0 && (
            <FeatureSelection
              usableHeaders={headers.slice(0, -1)}
              setSelectedFeatures={setSelectedFeatures}
              selectedFeatures={selectedFeatures}
            />
          )}
          <NextButton onClick={() => featureCallback(selectedFeatures)} />
        </Stack>
      </Box>
    </Box>
  );
}

export default DatasetSelection;
