import { Box, Button } from "@mui/material";
import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const NextButton = ({ onClick }) => {
  return (
    <Box
      style={{
        position: "absolute",
        bottom: "0px",
        right: "0px",
        marginBottom: 15,
      }}
    >
      <Button
        variant="contained"
        style={{
          borderRadius: "50%",
          height: "65px",
          width: "20px",
          backgroundColor: "#1565C0",
          color: "white",
        }}
        onClick={onClick}
      >
        <ArrowForwardIcon />
      </Button>
    </Box>
  );
};

export default NextButton;
