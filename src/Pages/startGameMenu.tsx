import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import BackgroundImage from "../Images/bg1.png";
import Stack from "@mui/material/Stack";
import LeaderboardDateType from "../Type/leaderboard";
import {
  Button,
  Typography,
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
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function StartGameMenuPage() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardDateType[] | null>(
    null
  );
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  function startGameButton() {
    navigate("/game");
  }

  function leaderBoardButton() {
    //get the leaderboard data
    fetch(process.env.REACT_APP_API_URL + "/leaderboard", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        response
          .json()
          .then((responseData: { data: LeaderboardDateType[] }) => {
            const { data } = responseData;
            setLeaderboard(data);
          });
      })
      .catch((error) => {
        console.log(error); // Log the error for debugging
        // Handle any error that occurs during the API request
        // ...
      });
    setOpen(true);
  }
  return (
    <Box>
      <Card>
        <CardMedia
          sx={{
            height: "100vh",
            position: "relative",
          }}
          component="img"
          image={BackgroundImage}
          alt="Background image"
        />
        <Stack
          justifyContent="center"
          alignItems="center"
          spacing={4}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            width: "100%",
            height: "100%",
          }}
        >
          <Typography
            variant="h1"
            component="h2"
            color="red"
            sx={{
              backgroundColor: "white",
              padding: "2vw",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "10%",
              fontSize: "7vw",
            }}
          >
            Catch Game
          </Typography>
          <Button
            variant="contained"
            sx={{ width: "40%", height: "7%" }}
            onClick={() => startGameButton()}
          >
            <Typography sx={{ textTransform: "none", fontSize: "4vw" }}>
              Start Game
            </Typography>
          </Button>
          <Button
            variant="contained"
            sx={{ width: "40%", height: "7%" }}
            onClick={() => leaderBoardButton()}
          >
            <Typography sx={{ textTransform: "none", fontSize: "4vw" }}>
              Leaderboard
            </Typography>
          </Button>
        </Stack>
      </Card>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Leaderboard"}</DialogTitle>
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
          <Button onClick={handleClose}>close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
export default StartGameMenuPage;
