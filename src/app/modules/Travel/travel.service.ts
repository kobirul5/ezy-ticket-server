import { prisma } from "../../../lib/prisma";
import { IBusTicketFilterRequest } from "./travel.interface";

const createBusService = async (data: any) => {
  const result = await prisma.busService.create({
    data,
  });
  return result;
};

const getAllBusServices = async () => {
  const result = await prisma.busService.findMany();
  return result;
};

const createBusTicket = async (data: any) => {
  const result = await prisma.busTicket.create({
    data,
  });
  return result;
};

const getAllBusTickets = async (filters: IBusTicketFilterRequest) => {
  const { searchTerm, from, to, date } = filters;
  const result = await prisma.busTicket.findMany({
    where: {
      AND: [
        from ? { from: { contains: from, mode: "insensitive" } } : {},
        to ? { to: { contains: to, mode: "insensitive" } } : {},
        date ? { date: { equals: date } } : {},
        searchTerm ? {
          OR: [
            { busName: { contains: searchTerm, mode: "insensitive" } },
            { from: { contains: searchTerm, mode: "insensitive" } },
            { to: { contains: searchTerm, mode: "insensitive" } },
          ],
        } : {},
      ],
    },
  });
  return result;
};

const updateBookedSeats = async (id: number, seats: string[]) => {
  const ticket = await prisma.busTicket.findUnique({ where: { id } });
  if (!ticket) throw new Error("Ticket not found");

  const result = await prisma.busTicket.update({
    where: { id },
    data: {
      bookedSeats: {
        set: [...ticket.bookedSeats, ...seats],
      },
    },
  });
  return result;
};

const getBusStands = async () => {
  const tickets = await prisma.busTicket.findMany({
    select: {
      from: true,
      to: true,
    },
  });

  const fromStands = new Set(tickets.map((ticket) => ticket.from));
  const toStands = new Set(tickets.map((ticket) => ticket.to));

  const uniqueStands = Array.from(new Set([...fromStands, ...toStands]));
  return uniqueStands;
};

export const TravelServices = {
  createBusService,
  getAllBusServices,
  createBusTicket,
  getAllBusTickets,
  updateBookedSeats,
  getBusStands,
};
