import React from "react";
import { Handle, Position, useStore } from "reactflow";
import Typography from "@mui/material/Typography";
import { Box, Tooltip } from "@mui/material";
import { NodeHoverCard } from "./HoverCards";

export default function GraphNode({ data }) {
  return (
    <Tooltip
      placement="right"
      title={
        <React.Fragment>
          <NodeHoverCard
            argument={data.argument}
            incomingNodes={data.incomingNodes}
            supportingNodes={data.supportingNodes}
            attackingNodes={data.attackingNodes}
            supportingWeights={data.supportingWeights}
            attackingWeights={data.attackingWeights}
            topN={data.topN}
          />
        </React.Fragment>
      }
    >
      <Box
        borderRadius={"50%"}
        width={"60px"}
        height={"58px"}
        display={"flex"}
        border={"1px solid"}
        justifyContent={"center"}
        alignItems={"center"}
        zIndex={0}
      >
        <Handle type="source" position={Position.Right} />
        <Typography fontSize={"12px"}>{data.label}</Typography>
        <Handle type="target" position={Position.Left} />
      </Box>
    </Tooltip>
    // <Handle type="source" position={Position.Right} />

    // <Handle type="target" position={Position.Left} />
  );
}
