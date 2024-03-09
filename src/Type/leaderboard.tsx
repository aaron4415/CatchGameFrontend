export interface LeaderboardDateType {
  id: number;
  score: number;
  name: string;
  ranking: number;
}

export interface LeaderboardDialogProps {
  open: boolean;
  handleClose: () => void;
  leaderboard: LeaderboardDateType[] | null;
}
