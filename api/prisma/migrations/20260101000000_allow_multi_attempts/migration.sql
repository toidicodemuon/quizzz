-- Drop unique constraint to allow multiple attempts per student per room
DROP INDEX `Attempt_roomId_studentId_key` ON `Attempt`;
