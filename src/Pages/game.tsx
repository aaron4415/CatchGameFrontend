import React, { useState, useEffect, useRef, useCallback } from "react";
import Button from "@mui/material/Button";
import Catcher from "../Images/boat.png";
import E1 from "../Images/e1.png";
import E2 from "../Images/e2.png";
import P1 from "../Images/p1.png";
import P2 from "../Images/p2.png";
import P3 from "../Images/p3.png";
import P4 from "../Images/p4.png";
import { Paper, Stack, Typography, TextField, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LeaderboardDialog from "../Components/leaderboardDialog";
import { LeaderboardDateType } from "../Type/leaderboard";

function GamePage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); //set time left to 60 seconds
  const [score, setScore] = useState(0);
  const [name, setName] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const catcherImageRef = useRef<HTMLImageElement>(null);
  const itemImageRef = useRef<HTMLImageElement>(null);
  const [containerHeight, setContainerHeight] = useState(window.innerHeight);
  const [containerWidth, setContainerWidth] = useState(window.innerWidth);
  const [itemPosition, setItemPosition] = useState({
    x: 0,
    y: containerHeight * 0.1,
  });
  const [itemVisible, setItemVisible] = useState(true);
  const [isNullInput, setIsNullInput] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardDateType[] | null>(
    null
  );

  const handleCatchItem = useCallback(() => {
    const image = itemImageRef.current;
    if (image) {
      const imageSrc = image.src;
      const points = getScoreForImage(imageSrc);
      setScore((prevScore) => prevScore + points); // add points
      itemImageRef.current.src = getRandomImage();
      setItemPosition({
        x: Math.floor(Math.random() * containerWidth * 0.8), // * 0.8 is because prevent the over the window size
        y: containerHeight * 0.1,
      }); // Reset the item position
    }
  }, [containerHeight, containerWidth]);

  useEffect(() => {
    if (catcherImageRef.current) {
      catcherImageRef.current.src = Catcher;
    }
    if (itemImageRef.current) {
      itemImageRef.current.src = getRandomImage();
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setContainerHeight(window.innerHeight);
      setContainerWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const itemDropInterval = setInterval(() => {
      setItemPosition((prevPosition) => {
        const newPosition = {
          x: prevPosition.x,
          y: prevPosition.y + 50, // the speed of the item dropping
        };

        if (newPosition.y >= containerHeight * 0.9) {
          if (itemImageRef.current) {
            itemImageRef.current.src = getRandomImage();
          }
          setItemPosition({
            x: Math.floor(Math.random() * containerWidth * 0.8), // * 0.8 is because prevent the over the window size
            y: containerHeight * 0.1,
          });
        }

        return newPosition;
      });
    }, 50);

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(itemDropInterval);
    };
  }, [containerHeight, containerWidth]);

  useEffect(() => {
    const handleCollisionDetection = () => {
      // Handle collision detection of the item and the catcher
      const catcherRect = catcherImageRef.current?.getBoundingClientRect();
      const itemRect = itemImageRef.current?.getBoundingClientRect();

      if (catcherRect && itemRect) {
        if (
          catcherRect.left < itemRect.right &&
          catcherRect.right > itemRect.left &&
          catcherRect.top < itemRect.bottom &&
          catcherRect.bottom > itemRect.top
        ) {
          handleCatchItem();
        }
      }
    };

    handleCollisionDetection();
  }, [itemPosition, catcherImageRef, handleCatchItem]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // handle how to use mouse to control the catcher left or right
      if (!gameOver) {
        const mouseX = event.clientX;
        const image = catcherImageRef.current;

        if (image) {
          const imageWidth = image.offsetWidth;
          const imageHalfWidth = imageWidth / 2;
          const containerWidth =
            (image.parentNode as HTMLElement)?.offsetWidth ?? 0;

          // Calculate the maximum x position based on the container width and image width
          const maxX = containerWidth - imageWidth;

          // Calculate the x position of the image
          let x = mouseX - imageHalfWidth;
          x = Math.min(Math.max(x, 0), maxX); // Ensure the x position stays within bounds

          // Set the new position of the image
          image.style.transform = `translateX(${x}px)`;
        }
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [gameOver]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setGameOver(true);
      setItemVisible(false);
    }
  }, [timeLeft]);

  // Handle name input
  const handleNameInput = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setName(event.target.value);
  };

  // Handle form submission
  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // Logic to submit the name and update the leaderboard
    if (!name) {
      // Handle the case when the name is null or empty
      // For example, you can display an error message or prevent the form submission
      setIsNullInput(true);
      return;
    } else {
      // Call a POST request to update the leaderboard
      fetch((process.env.REACT_APP_API_URL + "/create/userRecord") as string, {
        method: "POST",
        body: JSON.stringify({ name: name, score: score }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
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
            // Handle the response from the API
          }
        })
        .catch((error) => {
          // Handle any error that occurs during the API request
          // ...
        });
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/startGameMenu");
  };

  const getRandomImage = () => {
    const images = [E1, E2, P1, P2, P3, P4];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  const getScoreForImage = (imageSrc: string) => {
    const imageName = imageSrc.substring(imageSrc.lastIndexOf("/") + 1); // Extract the filename from imageSrc

    const E1Filename = E1.substring(E1.lastIndexOf("/") + 1);
    const E2Filename = E2.substring(E2.lastIndexOf("/") + 1);
    const P1Filename = P1.substring(P1.lastIndexOf("/") + 1);
    const P2Filename = P2.substring(P2.lastIndexOf("/") + 1);
    const P3Filename = P3.substring(P3.lastIndexOf("/") + 1);
    const P4Filename = P4.substring(P4.lastIndexOf("/") + 1);

    if (imageName === E1Filename || imageName === E2Filename) {
      return 100;
    } else if (
      imageName === P1Filename ||
      imageName === P2Filename ||
      imageName === P3Filename ||
      imageName === P4Filename
    ) {
      return 50;
    }
    return 0;
  };

  return (
    <Box>
      {itemVisible && (
        <Box
          sx={{
            backgroundColor: "blue",
            height: "100vh",
          }}
        >
          {/* Time left */}
          <Stack
            spacing={4}
            justifyContent="center"
            alignItems="center"
            sx={{
              backgroundColor: "white",
            }}
          >
            <Typography>Time Left: {timeLeft}</Typography>
            <Typography>Score: {score}</Typography>
          </Stack>
          {/* Game screen */}
          <Box>
            <Paper elevation={24}>
              <Box>
                {/* Render the game elements, including the catcher, items, and score display */}
                <img
                  id="item"
                  ref={itemImageRef}
                  alt="Catcher"
                  style={{
                    position: "absolute",
                    width: "10%",
                    height: "10%",
                    left: itemPosition.x,
                    top: itemPosition.y,
                  }}
                />
                <img
                  ref={catcherImageRef}
                  alt="Catcher"
                  style={{
                    width: "10%",
                    height: "10%",
                    position: "absolute",
                    top: "80%",
                  }}
                />
              </Box>
            </Paper>
          </Box>
        </Box>
      )}

      {/* Game over */}

      {gameOver && (
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Paper elevation={3}>
              <Stack justifyContent="center">
                <Typography
                  variant="h1"
                  component="h2"
                  color="red"
                  sx={{
                    backgroundColor: "yellow",
                    padding: "2vw",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "10%",
                    fontSize: "3vw",
                  }}
                >
                  Input your name to save your score !
                </Typography>
                <TextField
                  label="Name"
                  value={name}
                  onChange={handleNameInput}
                  sx={{ width: "100%", height: "7%" }}
                />
                {isNullInput && (
                  <Typography
                    color="red"
                    sx={{
                      textAlign: "left",
                      height: "10%",
                      fontSize: "2vw",
                    }}
                  >
                    the name input should not be null
                  </Typography>
                )}
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ width: "100%", height: "7%" }}
                >
                  Submit
                </Button>
              </Stack>
            </Paper>
          </form>
        </Box>
      )}
      <LeaderboardDialog
        open={open}
        handleClose={handleClose}
        leaderboard={leaderboard}
      />
    </Box>
  );
}
export default GamePage;
