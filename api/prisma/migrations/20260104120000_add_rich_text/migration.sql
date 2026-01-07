-- AlterTable
ALTER TABLE `Question`
  MODIFY `text` LONGTEXT NOT NULL,
  MODIFY `explanation` LONGTEXT NULL,
  MODIFY `correctText` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `Choice`
  MODIFY `content` LONGTEXT NOT NULL;
