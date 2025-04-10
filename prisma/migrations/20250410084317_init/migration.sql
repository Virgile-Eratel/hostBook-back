-- CreateTable
CREATE TABLE "StayInfo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "arrivalTime" TEXT NOT NULL,
    "accessInstructions" TEXT NOT NULL,
    "arrivalAdditionalInfo" TEXT NOT NULL,
    "departureTime" TEXT NOT NULL,
    "exitInstructions" TEXT NOT NULL,
    "departureAdditionalInfo" TEXT NOT NULL,
    "wifiName" TEXT NOT NULL,
    "wifiPassword" TEXT NOT NULL,
    "houseRules" TEXT NOT NULL,
    "ownerContact" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "generalInfo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "stayInfoId" TEXT NOT NULL,
    CONSTRAINT "Recommendation_stayInfoId_fkey" FOREIGN KEY ("stayInfoId") REFERENCES "StayInfo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
