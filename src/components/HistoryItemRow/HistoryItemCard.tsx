import styles from "./HistoryItemCard.module.css";
import React from "react";
import clsx from "clsx";
import { SmileSadIcon } from "../../assets/icons/SmileSadIcon.tsx";
import { SmileIcon } from "../../assets/icons/SmileIcon.tsx";

export type FileNameProps = {
  name: string;
};

const FileName = ({ name }: FileNameProps) => {
  return (
    <div className={styles["file-name"]}>
      <img src="/file-icon.svg" alt="file" />
      <span>{name}</span>
    </div>
  );
};

export type FileDateProps = {
  date: string;
};

const FileDate = ({ date }: FileDateProps) => {
  return <span className={styles.date}>{date}</span>;
};

export type FileStatusProps = {
  text: string;
  icon: React.ReactNode;
  isGrayedOut?: boolean;
};

const FileStatus = ({ text, icon, isGrayedOut = false }: FileStatusProps) => {
  console.log("Hey, ", styles["file-status"]);
  return (
    <div
      className={clsx(
        styles["file-status"],
        isGrayedOut && styles["file-status--grayed-out"],
      )}
    >
      <span className={styles["file-status__text"]}>{text}</span>
      {icon}
    </div>
  );
};

const FileStatusError = ({ isGrayedOut }: { isGrayedOut: boolean }) => {
  return (
    <FileStatus
      text="Не удалось обработать"
      icon={<SmileSadIcon />}
      isGrayedOut={isGrayedOut}
    />
  );
};

const FileStatusSuccess = ({ isGrayedOut }: { isGrayedOut: boolean }) => {
  return (
    <FileStatus
      text="Обработано успешно"
      icon={<SmileIcon />}
      isGrayedOut={isGrayedOut}
    />
  );
};

export const HistoryItemCard = () => {
  return (
    <div className={styles.card}>
      <FileName name="test.csv" />
      <FileDate date="01.01.2023" />
      <FileStatusSuccess isGrayedOut={false} />
      <FileStatusError isGrayedOut={true} />
    </div>
  );
};
