import { Box, Stack } from "@mui/material";
import SideBarHeader from "./sideBarHeader/SideBarHeader";
import Recents from "./recents/Recents";
import More from "./more/More";
import Folders from "./folders/Folders";


const LeftPanel = () => {
  return (
    <Stack 
      direction="column" 
      width="25%"
      height="100vh"  // Full viewport height
      bgcolor="#121212"
      gap={2}
    >
      {/* SideBarHeader, Recents, More take only needed space */}
      <SideBarHeader />
      <Recents />
      {/* Folders takes the remaining space and becomes scrollable */}
      <Box overflow="auto">
        <Folders />
      </Box>
      <More />
    </Stack>
  );
};

export default LeftPanel;
