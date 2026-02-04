import { prisma } from "../../../lib/prisma";
import { ICinemaHallFilterRequest, IMovieFilterRequest } from "./entertainment.interface";

const createCinemaHall = async (data: any) => {
  const result = await prisma.cinemaHall.create({
    data,
  });
  return result;
};

const getAllCinemaHalls = async (filters: ICinemaHallFilterRequest) => {
  const { searchTerm, location } = filters;
  const result = await prisma.cinemaHall.findMany({
    where: {
      OR: searchTerm
        ? [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { location: { contains: searchTerm, mode: "insensitive" } },
          ]
        : undefined,
      location: location ? { contains: location, mode: "insensitive" } : undefined,
    },
    include: {
      movies: true,
    },
  });
  return result;
};

const createMovie = async (data: any) => {
  const { cinemaHallIds, ...movieData } = data;
  const result = await prisma.movie.create({
    data: {
      ...movieData,
      cinemaHalls: {
        connect: cinemaHallIds?.map((id: number) => ({ id })),
      },
    },
  });
  return result;
};

const getAllMovies = async (filters: IMovieFilterRequest) => {
  const { searchTerm, genre, category } = filters;
  const result = await prisma.movie.findMany({
    where: {
      OR: searchTerm
        ? [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
            { director: { contains: searchTerm, mode: "insensitive" } },
          ]
        : undefined,
      genre: genre ? { contains: genre, mode: "insensitive" } : undefined,
      category: category ? { contains: category, mode: "insensitive" } : undefined,
    },
    include: {
      cinemaHalls: true,
    },
  });
  return result;
};

const getSingleMovie = async (id: number) => {
  const result = await prisma.movie.findUnique({
    where: { id },
    include: {
      cinemaHalls: true,
    },
  });
  return result;
};

const updateMovie = async (id: number, data: any) => {
  const { cinemaHallIds, ...movieData } = data;
  const result = await prisma.movie.update({
    where: { id },
    data: {
      ...movieData,
      cinemaHalls: cinemaHallIds ? {
        set: cinemaHallIds.map((id: number) => ({ id })),
      } : undefined,
    },
  });
  return result;
};

const deleteMovie = async (id: number) => {
  const result = await prisma.movie.delete({
    where: { id },
  });
  return result;
};

export const EntertainmentServices = {
  createCinemaHall,
  getAllCinemaHalls,
  createMovie,
  getAllMovies,
  getSingleMovie,
  updateMovie,
  deleteMovie,
};
