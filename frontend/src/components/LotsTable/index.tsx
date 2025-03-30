import { useLots } from "@/api/rest/lots/all/hook.ts";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import LotModal from "@/components/LotModal";
import { useUser } from "@/api/rest/users/me/hook.ts";
import { toast } from "react-toastify";

const LotsTable = () => {
  const { data: user } = useUser();
  const [selectedLotId, setSelectedLotId] = useState<number | null>(null);
  const { data } = useLots({ limit: 10, offset: 0 }); // TODO: add pagination handle
  if (!data) return null;

  const onLotClick = (lotId: number) => {
    if (!user) {
      toast("You have to be logged in!", { type: "error" });
      return;
    }
    setSelectedLotId(lotId);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="left">ID</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((lot) => (
              <TableRow
                key={lot.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  cursor: "pointer",
                }}
                onClick={() => onLotClick(lot.id)}
              >
                <TableCell align="left">{lot.id}</TableCell>
                <TableCell align="right">{lot.name}</TableCell>
                <TableCell align="right">{lot.status}</TableCell>
                <TableCell align="right">{lot.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <LotModal lotId={selectedLotId} setLotId={setSelectedLotId} />
    </>
  );
};

export default LotsTable;
