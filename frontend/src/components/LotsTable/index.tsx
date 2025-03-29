import { useLots } from "@/api/rest/lots/hook.ts";
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

const LotsTable = () => {
  const [selectedLotId, setSelectedLotId] = useState<number | null>(null);
  const { data } = useLots({ limit: 10, offset: 0 });
  if (!data) return null;

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="right">id</TableCell>
              <TableCell align="right">name</TableCell>
              <TableCell align="right">createdAt</TableCell>
              <TableCell align="right">updatedAt</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((lot) => (
              <TableRow
                key={lot.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                onClick={() => setSelectedLotId(lot.id)}
              >
                <TableCell align="right">{lot.id}</TableCell>
                <TableCell align="right">{lot.name}</TableCell>
                <TableCell align="right">{lot.createdAt}</TableCell>
                <TableCell align="right">{lot.updatedAt}</TableCell>
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
