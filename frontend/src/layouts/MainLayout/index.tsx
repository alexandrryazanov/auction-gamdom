import Box from "@mui/material/Box";
import { ReactNode } from "react";
import Header from "@/components/Header";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>{children}</Box>
    </>
  );
};

export default MainLayout;
