import { OrderStatus, ProductType } from "../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
import { IBusTicketFilterRequest, TTravelLocation } from "./travel.interface";

const createBusService = async (data: any) => {
    // If travelOffDates are provided as strings, convert them to Date objects
    if (data.travelOffDates && Array.isArray(data.travelOffDates)) {
        data.travelOffDates = data.travelOffDates.map((date: string) => new Date(date));
    }

    const { travelTime, ...rest } = data;

    const result = await prisma.busService.create({
        data: rest,
    });

    // Automatically create BusSchedule for each travelTime
    if (travelTime && Array.isArray(travelTime)) {
        const schedules = travelTime.map((time: string) => ({
            busServiceId: result.id,
            time: time,
            bookedSeats: [],
        }));

        await prisma.busSchedule.createMany({
            data: schedules,
        });
    }

    return result;
};

const getAllMyBusServices = async (userId?: number) => {


  const result = await prisma.busService.findMany({
    where: userId ? { userId } : {},
    include: {
        busSchedules: true
    },
    orderBy: {
        createdAt: 'desc'
    }
  });
  return result;
};

const getBusById = async (id: number) => {
  const result = await prisma.busService.findUnique({
    where: { id },
    include: {
        busSchedules: true
    }
  });
  return result;
};

const updateBusService = async (id: number, data: any) => {
    // If travelOffDates are provided as strings, convert them to Date objects
    if (data.travelOffDates && Array.isArray(data.travelOffDates)) {
        data.travelOffDates = data.travelOffDates.map((date: string) => new Date(date));
    }

    const { travelTime, ...rest } = data;

    const result = await prisma.busService.update({
        where: { id },
        data: rest,
    });

    if (travelTime && Array.isArray(travelTime)) {
        // Sync schedules: Create missing ones
        for (const time of travelTime) {
            const existing = await prisma.busSchedule.findFirst({
                where: { busServiceId: id, time }
            });
            if (!existing) {
                await prisma.busSchedule.create({
                    data: {
                        busServiceId: id,
                        time,
                        bookedSeats: []
                    }
                });
            }
        }
    }

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

  const schedules = await prisma.busSchedule.findMany({
    where: {
      busService: {
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
    },
    include: {
      busService: true,
    },
  });

  return schedules
    .filter((schedule) => {
      // 2. Filter by date using travelOffDates if provided
      if (date && schedule.busService.travelOffDates.some(offDate => 
        new Date(offDate).toISOString().split('T')[0] === date
      )) {
        return false;
      }
      return true;
    })
    .map((schedule) => ({
      id: schedule.id,
      busName: schedule.busService.name,
      busType: schedule.busService.busType,
      from: from || schedule.busService.departureLocation[0],
      to: to || schedule.busService.destinationLocation[0],
      departure: schedule.time,
      arrival: "TBD",
      price: schedule.busService.price,
      totalSeats: schedule.busService.totalSeats,
      bookedSeats: schedule.bookedSeats,
      date: date || "",
      busServiceId: schedule.busServiceId,
      image: schedule.busService.image,
    }));
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

const getScheduleById = async (id: number) => {
  const schedule = await prisma.busSchedule.findUnique({
    where: { id },
    include: {
      busService: true,
    },
  });

  if (!schedule) return null;

  // Fetch all successful and pending orders for this schedule to block those seats
  const orders = await prisma.order.findMany({
    where: {
      productId: id,
      productType: ProductType.BUS,
      status: {
        in: [OrderStatus.PENDING, OrderStatus.SUCCESSED]
      }
    }
  });

  // Aggregate selectedSeats from each order's orderData JSON field
  const orderBookedSeats = orders.flatMap(order => {
    const data = order.orderData as any;
    if (!data) return [];
    
    // Check for both direct and nested selectedSeats as seen in some logs
    const seats = data.selectedSeats || data.orderData?.selectedSeats;
    return Array.isArray(seats) ? seats : [];
  });

  // Combine with seats already marked in the schedule (if any)
  const combinedBookedSeats = Array.from(new Set([
    ...schedule.bookedSeats,
    ...orderBookedSeats
  ]));

  return {
    ...schedule,
    bookedSeats: combinedBookedSeats,
    bookedSeatsCount: combinedBookedSeats.length
  };
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
  getAllMyBusServices,
  getBusById,
  updateBusService,
  deleteBusService,
  createBusSchedule,
  getAllBusTickets,
  updateBookedSeats,
  findOrCreateSchedule,
  getBusStands,
  getScheduleById,
  createTravelLocation,
  getAllTravelLocations
};
