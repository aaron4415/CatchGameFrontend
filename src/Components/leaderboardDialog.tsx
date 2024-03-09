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
} from "@mui/material";
import { LeaderboardDialogProps } from "../Type/leaderboard";

const LeaderboardDialog: React.FC<LeaderboardDialogProps> = ({
  open,
  handleClose,
  leaderboard,
}) => {
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
            {leaderboard?.map((entry, index) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.ranking}</TableCell>
                <TableCell>{entry.name}</TableCell>
                <TableCell>{entry.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeaderboardDialog;
