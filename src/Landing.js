import { useEffect, useState } from "react";
import { Box, Button, Stack, Typography, Paper } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { QRCodeCanvas } from "qrcode.react";

import DatasetSelection from "./components/DatasetSelection";
import ModelSetup from "./components/ModelSetup";
import TrainingSetup from "./components/TrainingSetup";
import SparxSetup from "./components/SparxSetup";

import Dataset from "./classes/Dataset";
import ModelInfo from "./classes/ModelInfo";
import TrainingInfo from "./classes/TrainingInfo";
import SparxInfo from "./classes/SparxInfo";

const API_ENDPOINT = "http://127.0.0.1:5000/api/sparx";
const DATABASE_ENDPOINT = "https://sparx-vis.herokuapp.com/api/save_vis";
const VIS_ENDPOINT = "https://sparx-vis.herokuapp.com/";

function BackComponent({ backCallback }) {
  return (
    <Box>
      <Button
        variant="contained"
        style={{
          borderRadius: "50%",
          height: "65px",
          width: "20px",
          backgroundColor: "#1565C0",
          color: "white",
        }}
        onClick={backCallback}
      >
        <ArrowBackIcon />
      </Button>
    </Box>
  );
}

function Landing() {
  const [componentsIndex, setComponentsIndex] = useState(0);
  const [inOutShape, setInOutShape] = useState([0, 0]);

  const [dataset, setDataset] = useState(Dataset.empty());
  const [modelInfo, setModelInfo] = useState(ModelInfo.empty());
  const [trainingInfo, setTrainingInfo] = useState(TrainingInfo.empty());
  const [sparxInfo, setSparxInfo] = useState(SparxInfo.empty());

  const [loading, setLoading] = useState(false);
  const [displayURL, setDisplayURL] = useState("");
  const [shortenedURL, setShortenedURL] = useState("");

  useEffect(() => {
    if (displayURL.length > 0) {
      fetch("https://api-ssl.bitly.com/v4/shorten", {
        method: "POST",
        headers: {
          Authorization: "Bearer 1a7269c040b9af522c8c8ac58a52e34aea129539",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          long_url: displayURL,
          domain: "bit.ly",
          group_guid: "Bn1agpOxm5n",
        }),
      }).then((response) => {
        response.json().then((j) => {
          setShortenedURL(j["link"]);
        });
      });
    }
  }, [displayURL]);

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

  const backCallback = () => {
    setComponentsIndex(componentsIndex - 1);
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
    <ModelSetup inOutShape={inOutShape} modelCallback={modelCallback} backCallback={backCallback} />,
    <TrainingSetup trainingSetupCallback={trainingSetupCallback} backCallback={backCallback} />,
    <SparxSetup dataset={dataset} sparxSetupCallback={sparxSetupCallback} backCallback={backCallback} />,
    loading ? (
      <p>Waiting for server to respond</p>
    ) : (
      <div>
        <QRCodeCanvas value={displayURL} style={{ margin: 10 }} size={160} />
        <p>
          Shortened URL: <a href={shortenedURL}>{shortenedURL}</a>
        </p>
        <p>
          <a href={displayURL}>Click here to view visualisation</a>
        </p>
        <BackComponent backCallback={backCallback} />
      </div>
    ),
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#001e3c",
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
