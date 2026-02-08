import { prisma } from "../../../lib/prisma";
import { IBusTicketFilterRequest, TTravelLocation } from "./travel.interface";

const createBusService = async (data: any) => {
    // If travelOffDates are provided as strings, convert them to Date objects
    if (data.travelOffDates && Array.isArray(data.travelOffDates)) {
        data.travelOffDates = data.travelOffDates.map((date: string) => new Date(date));
    }

    const result = await prisma.busService.create({
        data,
    });
    return result;
};

const getAllBusServices = async (userId?: number) => {
  const result = await prisma.busService.findMany({
    where: userId ? { userId } : {},
    orderBy: {
        createdAt: 'desc'
    }
  });
  return result;
};

const getBusById = async (id: number) => {
  const result = await prisma.busService.findUnique({
    where: { id },
  });
  return result;
};

const updateBusService = async (id: number, data: any) => {
    // If travelOffDates are provided as strings, convert them to Date objects
    if (data.travelOffDates && Array.isArray(data.travelOffDates)) {
        data.travelOffDates = data.travelOffDates.map((date: string) => new Date(date));
    }

    const result = await prisma.busService.update({
        where: { id },
        data,
    });
    return result;
};

const deleteBusService = async (id: number) => {
    const result = await prisma.busService.delete({
        where: { id },
    });
    return result;
};

const createBusSchedule = async (data: any) => {
  const result = await prisma.busSchedule.create({
    data,
  });
  return result;
};

const getAllBusTickets = async (filters: IBusTicketFilterRequest) => {
  const { searchTerm, from, to, date } = filters;

  // 1. Find matching BusServices
  const busServices = await prisma.busService.findMany({
    where: {
      AND: [
        from ? { departureLocation: { has: from } } : {},
        to ? { destinationLocation: { has: to } } : {},
        searchTerm ? {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { departureLocation: { has: searchTerm } },
            { destinationLocation: { has: searchTerm } },
          ],
        } : {},
      ],
    },
  });

  // 2. Expand into individual trips based on travelTime
  const trips: any[] = [];

  for (const bus of busServices) {
    // Check if date is in travelOffDates
    if (date && bus.travelOffDates.some(offDate => 
      new Date(offDate).toISOString().split('T')[0] === date
    )) {
      continue;
    }

    for (const time of bus.travelTime) {
      // 3. Find existing schedule for this specific trip
      const schedule = await prisma.busSchedule.findFirst({
        where: {
          busServiceId: bus.id,
          time: time,
        }
      });

      trips.push({
        id: schedule?.id || `virtual-${bus.id}-${date}-${time}`,
        busName: bus.name,
        busType: bus.busType,
        from: from || bus.departureLocation[0],
        to: to || bus.destinationLocation[0],
        departure: time,
        arrival: "TBD", // Could be calculated
        price: bus.price,
        totalSeats: bus.totalSeats,
        bookedSeats: schedule?.bookedSeats || [],
        date: date || "",
        busServiceId: bus.id,
        image: bus.image,
        isVirtual: !schedule,
      });
    }
  }

  return trips;
};

const updateBookedSeats = async (scheduleId: number, seats: string[]) => {
  const schedule = await prisma.busSchedule.findUnique({ where: { id: scheduleId } });
  if (!schedule) throw new Error("Schedule not found");

  const result = await prisma.busSchedule.update({
    where: { id: scheduleId },
    data: {
      bookedSeats: {
        set: Array.from(new Set([...schedule.bookedSeats, ...seats])),
      },
    },
  });
  return result;
};

const findOrCreateSchedule = async (busServiceId: number, date: string, time: string) => {
  let schedule = await prisma.busSchedule.findFirst({
    where: { busServiceId, time }
  });

  if (!schedule) {
    schedule = await prisma.busSchedule.create({
      data: {
        busServiceId,
        time,
        bookedSeats: []
      }
    });
  }

  return schedule;
};

const getBusStands = async () => {
  const services = await prisma.busService.findMany({
    select: {
      departureLocation: true,
      destinationLocation: true,
    },
  });

  const fromStands = new Set(services.flatMap((s) => s.departureLocation));
  const toStands = new Set(services.flatMap((s) => s.destinationLocation));

  const uniqueStands = Array.from(new Set([...fromStands, ...toStands]));
  return uniqueStands;
};


const createTravelLocation = async (payload: TTravelLocation) => {
    const result = await prisma.travelLocation.create({
        data: payload
    })
    return result;
}

const getAllTravelLocations = async (searchTerm?: string) => {
    const result = await prisma.travelLocation.findMany({
        where: searchTerm ? {
            OR: [
                { name: { contains: searchTerm, mode: 'insensitive' } },
                { address: { contains: searchTerm, mode: 'insensitive' } }
            ]
        } : {},
        orderBy: {
            createdAt: 'desc'
        }
    })

    return result;
}


export const TravelServices = {
  createBusService,
  getAllBusServices,
  getBusById,
  updateBusService,
  deleteBusService,
  createBusSchedule,
  getAllBusTickets,
  updateBookedSeats,
  findOrCreateSchedule,
  getBusStands,
  createTravelLocation,
  getAllTravelLocations
};
