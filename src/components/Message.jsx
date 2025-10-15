import React from "react";
import { Typography } from "@mui/material";

const Message = ({ text }) => {
  if (!text) return null;
  return <Typography color="primary" mt={2}>{text}</Typography>;
};

export default Message;
