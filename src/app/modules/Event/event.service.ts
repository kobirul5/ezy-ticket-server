import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";
import { IEventFilterRequest } from "./event.interface";

const createEvent = async (data: any) => {
  const result = await prisma.event.create({
    data,
  });
  return result;
};

const getAllEvents = async (filters: IEventFilterRequest) => {
  const { searchTerm, eventType, status, advertise } = filters;
  const andConditions: Prisma.EventWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { details: { contains: searchTerm, mode: "insensitive" } },
        { location: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }

  if (eventType) {
    andConditions.push({ eventType });
  }

  if (status) {
    andConditions.push({ status });
  }

  if (advertise !== undefined) {
    andConditions.push({ advertise: advertise === "true" || advertise === true });
  }

  const whereConditions: Prisma.EventWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.event.findMany({
    where: whereConditions,
    include: {
      manager: {
        select: {
          name: true,
          email: true,
          picture: true,
        },
      },
    },
  });

  return result;
};

const getSingleEvent = async (id: number) => {
  const result = await prisma.event.findUnique({
    where: { id },
    include: {
      manager: true,
      reviews: true,
    },
  });
  return result;
};

const updateEvent = async (id: number, data: Partial<any>) => {
  const result = await prisma.event.update({
    where: { id },
    data,
  });
  return result;
};

const deleteEvent = async (id: number) => {
  const result = await prisma.event.delete({
    where: { id },
  });
  return result;
};

const getMyAddedEvents = async (email: string) => {
  const result = await prisma.event.findMany({
    where: { managerEmail: email },
  });
  return result;
};

export const EventServices = {
  createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
  getMyAddedEvents,
};
