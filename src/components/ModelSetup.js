import { Box, Button, Typography, Input, Select, MenuItem } from "@mui/material";
import { useState } from "react";
import { ActivationFunction } from "../classes/Enums";
import BackComponent from "./BackButton";

import LayerInfo from "../classes/LayerInfo";
import ModelInfo from "../classes/ModelInfo";

function LayerInfoComponent({
  layerInfo,
  layerIndex,
  layerName,
  nueronCountCallback,
  activationCallback,
  removeCallback,
  lockCount = false,
  lockActivation = false,
}) {
  let activationOptions = Object.entries(ActivationFunction).map(([key, value]) => (
    <option key={"activation" + layerIndex + value} value={value}>
      {key}
    </option>
  ));

  return (
    <div>
      <Typography variant="h6"> {layerName} </Typography>
      Neuron Count:{" "}
      <Input
        type="number"
        value={layerInfo.nueronCount}
        disabled={lockCount}
        onChange={(e) => nueronCountCallback(layerIndex, e.target.value)}
        width="50px"
      />{" "}
      | Activation Function:{" "}
      <Select
        value={layerInfo.activationFunction}
        disabled={lockActivation}
        onChange={(e) => {
          activationCallback(layerIndex, e.target.value);
        }}
      >
        {activationOptions.map((activationOption) => {
          return (
            <MenuItem key={activationOption.key} value={activationOption.props.value}>
              {activationOption.props.children}
            </MenuItem>
          );
        })}
      </Select>
      {!lockCount && !lockActivation && (
        <Button
          variant="contained"
          component="label"
          style={{ backgroundColor: "#1565C0" }}
          onClick={() => removeCallback(layerIndex)}
        >
          {" "}
          Remove{" "}
        </Button>
      )}
    </div>
  );
}

function ModelSetup({ inOutShape, modelCallback, backCallback }) {
  const [inputLayerInfo, _] = useState(new LayerInfo(inOutShape[0], ActivationFunction.None));
  const [layerInfos, setLayerInfos] = useState([]);
  const [outputLayerInfo, setOutputLayerInfo] = useState(new LayerInfo(inOutShape[1], ActivationFunction.Sigmoid));

  const addNewInfoLayer = () => {
    let newLayerInfos = [...layerInfos];
    newLayerInfos.push(new LayerInfo(4, ActivationFunction.ReLU));
    setLayerInfos(newLayerInfos);
  };

  const removeCallback = (layerIndex) => {
    let newLayerInfos = [...layerInfos];
    newLayerInfos.splice(layerIndex, 1);
    setLayerInfos(newLayerInfos);
  };

  const nueronCountCallback = (layerIndex, value) => {
    let newLayerInfos = [...layerInfos];
    newLayerInfos[layerIndex].nueronCount = value;
    setLayerInfos(newLayerInfos);
  };

  const activationCallback = (layerIndex, value) => {
    if (layerIndex >= layerInfos.length) {
      setOutputLayerInfo(new LayerInfo(outputLayerInfo.nueronCount, value));
    } else {
      let newLayerInfos = [...layerInfos];
      newLayerInfos[layerIndex].activationFunction = value;
      setLayerInfos(newLayerInfos);
    }
  };

  const nextClick = () => {
    let rModel = new ModelInfo(inputLayerInfo, layerInfos, outputLayerInfo);
    modelCallback(rModel);
  };

  let layerInfoComponents = layerInfos.map((layerInfo, i) => (
    <LayerInfoComponent
      key={"layerInfo" + i}
      layerInfo={layerInfo}
      layerIndex={i}
      layerName={"Layer " + (i + 1)}
      nueronCountCallback={nueronCountCallback}
      activationCallback={activationCallback}
      removeCallback={removeCallback}
    />
  ));

  return (
    <div>
      <Box
        style={{
          justifyContent: "center",
          alignItems: "start",
          flexDirection: "column",
          flexWrap: "wrap",
          height: "30vh",
          overflow: "auto",
          marginTop: 20,
        }}
      >
        <LayerInfoComponent layerInfo={inputLayerInfo} layerIndex={-1} layerName={"Input Layer"} lockCount={true} lockActivation={true} />
        {layerInfoComponents}
        <Button variant="contained" component="label" style={{ backgroundColor: "#1565C0" }} onClick={addNewInfoLayer}>
          {" "}
          Add new Layer{" "}
        </Button>
        <LayerInfoComponent
          layerInfo={outputLayerInfo}
          layerIndex={layerInfos.length}
          layerName={"Output Layer"}
          lockCount={true}
          activationCallback={activationCallback}
        />
        
      </Box>
      <Box>
        <BackComponent backCallback={backCallback} />
        <Button
            variant="contained"
            component="label"
            style={{ backgroundColor: "#1565C0" }}
            onClick={(_e) => nextClick()}
          >
            {" "}
            Next{" "}
        </Button>
      </Box>
    </div>
  );
}

export default ModelSetup;
