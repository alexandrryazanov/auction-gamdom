import Box from "@mui/material/Box";
import { ReactNode } from "react";
import Header from "@/components/Header";
import { useUser } from "@/api/rest/users/me/hook.ts";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { data: user } = useUser();
  return (
    <>
      <Header user={user} />
      <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>{children}</Box>
    </>
  );
};

export default MainLayout;
