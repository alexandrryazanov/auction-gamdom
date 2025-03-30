import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { LotModalProps } from "./types.ts";
import Button from "@mui/material/Button";
import { FormEvent, useEffect, useState } from "react";
import BidsTable from "@/components/BidsTable";
import { Status } from "@/api/rest/lots/all/types.ts";
import { useLot } from "@/api/rest/lots/one/hook.ts";
import { useQueryClient } from "@tanstack/react-query";
import { LOTS_QUERY_KEY } from "@/api/rest/lots/constants.ts";
import { formatTime } from "@/components/LotModal/utils.ts";
import useBidsSocket from "@/hooks/useBidsSocket.ts";
import useTimeLeft from "@/hooks/useTimeLeft.ts";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { useUser } from "@/api/rest/users/me/hook.ts";

export default function LotModal({ lotId, setLotId }: LotModalProps) {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const { data, isLoading } = useLot({ id: lotId });
  const [value, setValue] = useState("");

  const lotIsNotReady = !lotId || !data || data.status === Status.CLOSED;

  const {
    status: statusFromSockets,
    bids,
    winner: winnerFromSockets,
    error,
    emit,
  } = useBidsSocket({
    lotId,
    skip: lotIsNotReady,
  });

  const timeLeft = useTimeLeft({
    startValue: data?.timeLeft,
    skip: lotIsNotReady,
  });

  const isClosed =
    data?.status === Status.CLOSED || statusFromSockets === Status.CLOSED;

  const winner = data?.winner || winnerFromSockets || null;

  useEffect(() => {
    if (!isClosed) return;
    queryClient.refetchQueries({ queryKey: [LOTS_QUERY_KEY] }); // update lots
  }, [isClosed, queryClient]);

  const handleClose = () => setLotId(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (Number(value) <= 0) {
      toast("Enter correct bid", { type: "error" });
    }

    emit("bid", { value });
  };

  return (
    <Modal
      aria-labelledby="modal-title"
      open={!!lotId}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        {!isLoading ? (
          <>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                id="modal-title"
                variant="h6"
                component="h2"
                sx={{ mb: 2 }}
              >
                Lot {data?.name || ""}
              </Typography>
              {!isClosed && timeLeft > 0 && (
                <Typography paddingTop={1} fontSize={14} color={"primary"}>
                  {formatTime(timeLeft)}
                </Typography>
              )}
              {!isClosed && timeLeft <= 0 && (
                <Typography paddingTop={1} fontSize={14} color={"warning"}>
                  Auction is closing...
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
                      placeholder={"Your bid in cents"}
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
                {winner
                  ? `Winner: ${winner?.email === user?.email ? "you. Congratulate!" : winner.email}`
                  : "No winner"}
              </Typography>
            )}
          </>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Modal>
  );
}
