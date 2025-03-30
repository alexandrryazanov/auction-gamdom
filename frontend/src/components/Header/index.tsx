import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { HeaderProps } from "@/components/Header/types.ts";
import { useNavigate } from "react-router-dom";
import { useLogout } from "@/api/rest/auth/logout/hook.ts";

export default function Header({ user }: HeaderProps) {
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Auctions
        </Typography>
        {!user && (
          <Button color="inherit" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
        {user && (
          <Button color="inherit" onClick={() => logout()}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
