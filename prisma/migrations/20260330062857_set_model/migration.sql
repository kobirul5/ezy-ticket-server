-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'event',
ADD COLUMN     "eventCategory" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "managerImage" TEXT,
ADD COLUMN     "managerName" TEXT,
ADD COLUMN     "maxTickets" INTEGER,
ADD COLUMN     "organizer" TEXT,
ADD COLUMN     "soldTickets" INTEGER NOT NULL DEFAULT 0;
