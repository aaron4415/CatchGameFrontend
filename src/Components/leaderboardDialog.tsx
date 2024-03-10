import React from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
} from "@mui/material";
import { LeaderboardDialogProps } from "../Type/leaderboard";

const LeaderboardDialog: React.FC<LeaderboardDialogProps> = ({
  open,
  handleClose,
  leaderboard,
}) => {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const totalPages = Math.ceil((leaderboard?.length || 0) / rowsPerPage);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Leaderboard</DialogTitle>
      <DialogContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ranking</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard
              ?.slice((page - 1) * rowsPerPage, page * rowsPerPage)
              .map((entry, index) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.ranking}</TableCell>
                  <TableCell>{entry.name}</TableCell>
                  <TableCell>{entry.score}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {leaderboard && leaderboard.length > 0 && (
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeaderboardDialog;
