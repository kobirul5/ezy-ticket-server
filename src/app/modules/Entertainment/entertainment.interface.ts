export type ICinemaHallFilterRequest = {
  searchTerm?: string | undefined;
  location?: string | undefined;
};

export type IMovieFilterRequest = {
  searchTerm?: string | undefined;
  genre?: string | undefined;
  category?: string | undefined;
};
