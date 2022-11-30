import { useState } from "react";
import { Box, Button, Input, Typography, Select, MenuItem } from "@mui/material";
import { numericInputCreator, selectorCreator } from "../classes/Utility";
import { Clusterer, Merger } from "../classes/Enums";
import SparxInfo from "../classes/SparxInfo";

function DatapointInputs({ datapoint, xHeaders, dataPointCallback }) {
    const elements = datapoint.map((value, index) => (
        <div key={"datapoint" + index}>
            <Typography variant="h7"> {xHeaders[index]}: {" "} </Typography>
            <Input type="number" value={value} onChange={(e) => dataPointCallback(e.target.value, index)} />
        </div>
    ));

    return <div>{elements}</div>;
}

function SparxSetup({ dataset, sparxSetupCallback }) {
    const [shrinkage, setShrinkage] = useState(0.5);
    const [clusterer, setClusterer] = useState(Clusterer.KMeans);
    const [merger, setMerger] = useState(Merger.Global);
    const [datapoint, setDatapoint] = useState(dataset.getRandomXDatapoint());

    const nextClick = () => {
        let sparxInfo = new SparxInfo(shrinkage, clusterer, merger, datapoint);
        sparxSetupCallback(sparxInfo);
    };

    // change a singel datapoint
    const dataPointCallback = (value, index) => {
        let newDatapoint = [...datapoint];
        newDatapoint[index] = value;
        setDatapoint(newDatapoint);
    };

    return (
        <div>
            <Typography variant="h6"> Shrinkage: {" "}
                <Input
                    placeholder="Shrinkage"
                    type="number"
                    value={shrinkage}
                    onChange={(e) => { setShrinkage(e.target.value) }}
                />
            </Typography>

            <Typography variant="h6"> Clusterer: {" "}
                <Select
                    placeholder="Clusterer"
                    value={clusterer}
                    onChange={(e) => { setClusterer(e.target.value) }}
                >
                    <MenuItem value={Clusterer.KMeans}> KMeans </MenuItem>
                    <MenuItem value={Clusterer.Agglomerative}> Agglomerative </MenuItem>
                </Select>
            </Typography>

            <Typography variant="h6"> Merger: {" "}
                <Select
                    placeholder="Merger"
                    value={merger}
                    onChange={(e) => { setMerger(e.target.value) }}
                >
                    <MenuItem value={Merger.Global}> Global </MenuItem>
                    <MenuItem value={Merger.Local}> Local </MenuItem>
                </Select>
            </Typography>

            {merger === Merger.Local && (
                <Box
                    style={{
                        justifyContent: "center",
                        alignItems: "start",
                        flexDirection: "column",
                        flexWrap: "wrap",
                        height: "10vh",
                        overflow: "auto",
                        marginTop: 20,
                    }}
                >
                    <DatapointInputs
                        datapoint={datapoint}
                        xHeaders={dataset.xHeaders}
                        dataPointCallback={dataPointCallback}
                    />
                </Box>
            )}

            <Button
                variant="contained"
                component="label"
                style={{ backgroundColor: "#1565C0" }}
                onClick={nextClick}
            > Next </Button>
        </div>
    );
}

export default SparxSetup;
