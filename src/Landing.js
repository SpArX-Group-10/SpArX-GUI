import { useState } from "react";

import DatasetSelection from "./components/DatasetSelection";
import ModelSetup from "./components/ModelSetup";
import TrainingSetup from "./components/TrainingSetup";
import SparxSetup from "./components/SparxSetup";

import Dataset from "./classes/Dataset";
import ModelInfo from "./classes/ModelInfo";
import TrainingInfo from "./classes/TrainingInfo";
import SparxInfo from "./classes/SparxInfo";
import React from "react";
import { Box, Stack, Typography, Paper } from "@mui/material";

const ISDEV = process.env.NODE_ENV === "development";

const API_ENDPOINT = "http://127.0.0.1:5000/api/sparx";
const DATABASE_ENDPOINT = ISDEV ? "http://127.0.0.1:5001/api/save_vis" : "https://sparx-vis.herokuapp.com/api/save_vis";
const VIS_ENDPOINT = ISDEV ? "http://127.0.0.1:3000/" : "https://sparx-vis.herokuapp.com/";

function Landing() {
  const [componentsIndex, setComponentsIndex] = useState(0);
  const [inOutShape, setInOutShape] = useState([0, 0]);

  const [dataset, setDataset] = useState(Dataset.empty());
  const [modelInfo, setModelInfo] = useState(ModelInfo.empty());
  const [trainingInfo, setTrainingInfo] = useState(TrainingInfo.empty());
  const [sparxInfo, setSparxInfo] = useState(SparxInfo.empty());

  const [loading, setLoading] = useState(false);
  const [displayURL, setDisplayURL] = useState("");

  const devMode = false;

  const selectedDatasetCallback = (rDatasetData) => {
    setDataset(rDatasetData);
    setComponentsIndex(componentsIndex + 1);
    setInOutShape(rDatasetData.getInOutShape());
  };

  const modelCallback = (rModel) => {
    setModelInfo(rModel);
    setComponentsIndex(componentsIndex + 1);
  };

  const trainingSetupCallback = (rTrainingInfo) => {
    setTrainingInfo(rTrainingInfo);
    setComponentsIndex(componentsIndex + 1);
  };

  const sparxSetupCallback = (rSparxInfo) => {
    setSparxInfo(rSparxInfo);
    setComponentsIndex(componentsIndex + 1);

    sendToServer(rSparxInfo);
  };

  const sendToServer = (sparxInfo) => {
    // sparxs info is passed in because otherwise it won't be updated in time
    const data = {
      dataset: dataset,
      modelInfo: modelInfo,
      trainingInfo: trainingInfo,
      sparxInfo: sparxInfo,
    };

    setLoading(true);
    fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(
        // (data) => console.log("Success:", data)
        // navigate("/visualisation", { state: { graphJSON: data } })
        (data) =>
          fetch(DATABASE_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          })
            .then((response) => response.text())
            .then((data) => {
              setDisplayURL(VIS_ENDPOINT + data);
              setLoading(false);
            })
      );
  };

  let components = [
    <DatasetSelection selectedDatasetCallback={selectedDatasetCallback} />,
    <ModelSetup inOutShape={inOutShape} modelCallback={modelCallback} />,
    <TrainingSetup trainingSetupCallback={trainingSetupCallback} />,
    <SparxSetup dataset={dataset} sparxSetupCallback={sparxSetupCallback} />,
    loading ? <p>Waiting for server to respond</p> : <a href={displayURL}>Click here to view visualisation</a>,
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#1565C0",
        height: "100vh",
        width: "100vw",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        textAlign: "center",
      }}
    >
      <Stack gap={10}>
        <Typography variant="h3" color="white">
          Welcome to SpArX!
        </Typography>
        <Paper
          elevation={10}
          style={{
            height: "350px",
            width: "600px",
            backgroundColor: "#c7e8fb",
            borderRadius: "20px",
          }}
        >
          {components[componentsIndex]}
        </Paper>
        {devMode && (
          <div>
            <p>{JSON.stringify(dataset)}</p>
            <p>{JSON.stringify(modelInfo)}</p>
            <p>{JSON.stringify(trainingInfo)}</p>
            <p>{JSON.stringify(sparxInfo)}</p>
          </div>
        )}
      </Stack>
    </Box>
  );
}

export default Landing;
