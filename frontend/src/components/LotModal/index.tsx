import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { LotModalProps } from "./types.ts";
import Button from "@mui/material/Button";
import { FormEvent, useEffect, useRef, useState } from "react";
import { io as socketIO, Socket } from "socket.io-client";
import BidsTable from "@/components/BidsTable";
import { Bid } from "@/api/rest/lots/types.ts";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function LotModal({ lotId, setLotId }: LotModalProps) {
  const socket = useRef<Socket | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [error, setError] = useState("");
  const [value, setValue] = useState("");

  const handleClose = () => setLotId(null);

  useEffect(() => {
    if (!lotId) return;

    socket.current = socketIO(import.meta.env.VITE_BACKEND_BASE_URL, {
      path: "/ws",
      transports: ["websocket"],
      reconnectionDelayMax: 10000,
      query: {
        lotId: lotId,
      },
    });

    socket.current.on("connect", () => {
      socket.current?.on("error", setError);
      socket.current?.on("lot", console.log);
      socket.current?.on("bid:placed", setBids);
      socket.current?.on("lot:ended", console.log);
    });

    return () => {
      setBids([]);
      setError("");
      socket.current?.disconnect();
    };
  }, [lotId]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    socket.current?.emit("bid", { userId: 1, value });
    setError("");
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={!!lotId}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={!!lotId}>
          <Box sx={style}>
            <Typography
              id="transition-modal-title"
              variant="h6"
              component="h2"
              sx={{ mb: 2 }}
            >
              Bids for lot {lotId}
            </Typography>

            <BidsTable data={bids} error={error} isLoading={false} />

            <form onSubmit={onSubmit}>
              <Box sx={{ mt: 3, flex: 1, display: "flex", gap: 1 }}>
                <TextField
                  sx={{ width: "100%" }}
                  type="number"
                  variant="outlined"
                  size="small"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={"Your Bid In cents"}
                />
                <Button
                  variant={"contained"}
                  type={"submit"}
                  sx={{ minWidth: 130 }}
                >
                  Place bid
                </Button>
              </Box>
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
