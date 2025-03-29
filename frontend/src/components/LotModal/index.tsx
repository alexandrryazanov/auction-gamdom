import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { LotModalProps } from "./types.ts";
import Button from "@mui/material/Button";
import { useEffect } from "react";
import { io as socketIO } from "socket.io-client";

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
  const handleClose = () => setLotId(null);

  useEffect(() => {
    if (!lotId) return;

    const io = socketIO(import.meta.env.VITE_BACKEND_BASE_URL, {
      path: "/ws",
      transports: ["websocket"],
      reconnectionDelayMax: 10000,
      query: {
        lotId: lotId,
      },
    });

    io.on("connect", () => {
      io.on("error", console.log);
      io.on("lot", console.log);
    });

    // return () => {
    //   io.disconnect();
    // };
  }, [lotId]);

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
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Bids for lot {lotId}
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Bids
            </Typography>
            <Button sx={{ mt: 3 }} variant={"contained"}>
              Place bid
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
