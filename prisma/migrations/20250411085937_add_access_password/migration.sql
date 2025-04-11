/*
  Warnings:

  - Added the required column `accessPassword` to the `StayInfo` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StayInfo" (
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
    "generalInfo" TEXT NOT NULL,
    "accessPassword" TEXT NOT NULL
);
INSERT INTO "new_StayInfo" ("accessInstructions", "arrivalAdditionalInfo", "arrivalTime", "departureAdditionalInfo", "departureTime", "exitInstructions", "generalInfo", "houseRules", "id", "ownerContact", "ownerName", "wifiName", "wifiPassword", "accessPassword") SELECT "accessInstructions", "arrivalAdditionalInfo", "arrivalTime", "departureAdditionalInfo", "departureTime", "exitInstructions", "generalInfo", "houseRules", "id", "ownerContact", "ownerName", "wifiName", "wifiPassword", 'password' || substr(hex(randomblob(8)), 1, 8) FROM "StayInfo";
DROP TABLE "StayInfo";
ALTER TABLE "new_StayInfo" RENAME TO "StayInfo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
