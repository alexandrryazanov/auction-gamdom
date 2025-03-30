import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { BidsTableProps } from "@/components/BidsTable/types.ts";
import Typography from "@mui/material/Typography";

const BidsTable = ({ data, isLoading, error }: BidsTableProps) => {
  if (!data?.length && !error) return <Typography>No bids</Typography>;
  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: 100 }}>
        <Table size="small" aria-label="bids table">
          <TableBody>
            {data.map((bid) => (
              <TableRow
                key={bid.value}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:first-child td": { color: "#00cc00" },
                }}
              >
                <TableCell align="left">{bid.email}</TableCell>
                <TableCell align="right">{bid.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {error && <Typography sx={{ color: "red", mt: 3 }}>{error}</Typography>}
    </>
  );
};

export default BidsTable;
