import { useCallback, useEffect, useRef, useState } from "react";
import { Bid, Status } from "@/api/rest/lots/all/types.ts";
import { io as socketIO, Socket } from "socket.io-client";
import { TOKEN_KEY } from "@/constants/localStorage.ts";
import { User } from "@/api/rest/users/me/types.ts";

const useBidsSocket = ({
  lotId,
  skip,
}: {
  lotId: number | null;
  skip?: boolean;
}) => {
  const socket = useRef<Socket | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [error, setError] = useState("");
  const [winner, setWinner] = useState<User | null>(null);
  const [status, setStatus] = useState<Status>(Status.OPEN);

  useEffect(() => {
    if (!lotId || skip) return;
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
        setStatus(Status.CLOSED);
        setWinner(data.winner);
      });
    });

    return () => {
      setBids([]);
      setError("");
      socket.current?.disconnect();
    };
  }, [lotId, skip]);

  const emit = useCallback(
    (event: string, msg: Record<string, string | number | boolean>) => {
      socket.current?.emit(event, msg);
      setError("");
    },
    [],
  );

  return { status, winner, bids, error, emit };
};

export default useBidsSocket;
