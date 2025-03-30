import { FormEvent, useEffect, useState } from "react";
import { useUser } from "@/api/rest/users/me/hook.ts";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/api/rest/auth/login/hook.ts";
import Box from "@mui/material/Box";
import { Paper } from "@mui/material";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const LoginPage = () => {
  const navigate = useNavigate();
  const { data: user, isLoading } = useUser();
  const { mutate: login, error: serverError } = useLogin();
  const [data, setData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (!user || isLoading) return;
    navigate("/");
  }, [user, isLoading, navigate]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    login(data);
  };

  console.log("serverError", serverError);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <form onSubmit={onSubmit}>
        <Paper
          sx={{
            p: 4,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
            width: 500,
          }}
        >
          <TextField
            type="email"
            fullWidth
            name="email"
            label={"Email"}
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <TextField
            type="password"
            fullWidth
            label={"Password"}
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <Button
            variant={"contained"}
            type={"submit"}
            fullWidth
            sx={{ mt: 1 }}
          >
            Login
          </Button>
          {serverError && (
            <Typography color={"red"}>{serverError.message}</Typography>
          )}
        </Paper>
      </form>
    </Box>
  );
};

export default LoginPage;
