import { useState } from "react";
import { Button, Input, Typography, Select, MenuItem } from "@mui/material";
import { Optimiser, LossFunction } from "../classes/Enums";
import { selectorCreator, numericInputCreator } from "../classes/Utility";
import TrainingInfo from "../classes/TrainingInfo";

function TrainingSetup({ trainingSetupCallback }) {
    const [epochs, setEpochs] = useState(100);
    const [learningRate, setLearningRate] = useState(0.001);
    const [validationSplit, setValidationSplit] = useState(0.2);
    const [optimiser, setOptimiser] = useState(Optimiser.Adam);
    const [lossFunction, setLossFunction] = useState(LossFunction.MeanSquaredError);

    const nextClick = () => {
        let trainingInfo = new TrainingInfo(epochs, learningRate, validationSplit, optimiser, lossFunction);
        trainingSetupCallback(trainingInfo);
    };

    return (
        <div>
            <Typography variant="h6"> Epochs: {" "}
                <Input
                    placeholder="Epochs"
                    type="number"
                    value={epochs}
                    onChange={(e) => {
                        // Ensure that the number of epochs is a integer
                        e.target.value = parseInt(e.target.value);
                        setEpochs(e.target.value);
                    }}
                />
            </Typography>

            <Typography variant="h6"> Learning Rate: {" "}
                <Input
                    placeholder="Learning Rate"
                    type="number"
                    value={learningRate}
                    onChange={(e) => { setLearningRate(e.target.value) }}
                />
            </Typography>

            <Typography variant="h6"> Validation Split: {" "}
                <Input
                    placeholder="Validation Split"
                    type="number"
                    value={validationSplit}
                    onChange={(e) => { setValidationSplit(e.target.value) }}
                />
            </Typography>

            <Typography variant="h6"> Optimiser: {" "}
                <Select
                    placeholder="Optimiser"
                    value={optimiser}
                    onChange={(e) => {
                        setOptimiser(e.target.value)
                    }}
                >
                    <MenuItem value={Optimiser.SGD}> SGD </MenuItem>
                    <MenuItem value={Optimiser.RMSProp}> RMSProp </MenuItem>
                    <MenuItem value={Optimiser.Adam}> Adam </MenuItem>
                </Select>
            </Typography>

            <Typography variant="h6"> Loss Function: {" "}
                <Select
                    placeholder="Loss Function"
                    value={lossFunction}
                    onChange={(e) => { setLossFunction(e.target.value) }}
                >
                    <MenuItem value={LossFunction.MeanSquaredError}> Mean Squared Error </MenuItem>
                    <MenuItem value={LossFunction.BinaryCrossentropy}> Binary Cross Entropy </MenuItem>
                    <MenuItem value={LossFunction.CategoricalCrossentropy}> Categorical Cross Entropy </MenuItem>
                </Select>
            </Typography>

            <Button
                variant="contained"
                component="label"
                style={{ backgroundColor: "#1565C0" }}
                onClick={nextClick}
            > Next </Button>
        </div>
    );
}

export default TrainingSetup;