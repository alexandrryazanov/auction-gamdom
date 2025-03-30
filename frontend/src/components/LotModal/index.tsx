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
import { Bid, Status } from "@/api/rest/lots/all/types.ts";
import { useLot } from "@/api/rest/lots/one/hook.ts";
import { TOKEN_KEY } from "@/constants/localStorage.ts";
import { User } from "@/api/rest/users/me/types.ts";
import { useQueryClient } from "@tanstack/react-query";
import { LOTS_QUERY_KEY } from "@/api/rest/lots/constants.ts";
import { formatTime } from "@/components/LotModal/utils.ts";

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
  const { data } = useLot({ id: lotId });
  const socket = useRef<Socket | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  const [winnerFromSockets, setWinnerFromSockets] = useState<User | null>(null);
  const [statusFromSockets, setStatusFromSockets] = useState<Status>(
    Status.OPEN,
  );
  const queryClient = useQueryClient();
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const handleClose = () => setLotId(null);

  // TODO: create separated hook for sockets
  useEffect(() => {
    if (!lotId || !data || data.status === Status.CLOSED) return;

    setTimeLeft(data.timeLeft);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) clearInterval(timer);
        return prev - 1;
      });
    }, 1000);

    socket.current = socketIO(import.meta.env.VITE_BACKEND_BASE_URL, {
      path: "/ws",
      transports: ["websocket"],
      reconnectionDelayMax: 10000,
      query: { lotId },
      auth: { token: localStorage.getItem(TOKEN_KEY) },
    });

    socket.current.on("connect", () => {
      socket.current?.on("error", setError);
      socket.current?.on("lot", console.log);
      socket.current?.on("bid:placed", setBids);
      socket.current?.on("lot:ended", (data) => {
        setStatusFromSockets(Status.CLOSED);
        setWinnerFromSockets(data.winner);
      });
    });

    return () => {
      clearInterval(timer);
      setBids([]);
      setError("");
      socket.current?.disconnect();
    };
  }, [lotId, data]);

  const isClosed =
    data?.status === Status.CLOSED || statusFromSockets === Status.CLOSED;
  const winner = winnerFromSockets || data?.winner || null;

  useEffect(() => {
    if (!isClosed) return;
    queryClient.refetchQueries({ queryKey: [LOTS_QUERY_KEY] }); // update lots
  }, [isClosed, queryClient]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    socket.current?.emit("bid", { value });
    setError("");
  };

  return (
    <Modal
      aria-labelledby="modal-title"
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
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              id="modal-title"
              variant="h6"
              component="h2"
              sx={{ mb: 2 }}
            >
              Bids for lot {data?.name || ""}
            </Typography>
            {!isClosed && timeLeft > 0 && (
              <Typography paddingTop={1} fontSize={14} color={"primary"}>
                {formatTime(timeLeft)}
              </Typography>
            )}
          </Box>

          {!isClosed && !winner ? (
            <>
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
                    disabled={value.length === 0}
                  >
                    Place bid
                  </Button>
                </Box>
              </form>
            </>
          ) : (
            <Typography color={"success"}>
              {winner ? `Winner: ${winner?.email}` : "No winner"}
            </Typography>
          )}
        </Box>
      </Fade>
    </Modal>
  );
}
