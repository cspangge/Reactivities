import { IUser } from "./../../model/user";
import { IActivity, IAttendee } from "./../../model/activity";
export const combineDateAndTime = (date: Date, time: Date) => {
  // const timeString =
  //   time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
  // const year = date.getFullYear();
  // const month = date.getMonth() + 1;
  // const day = date.getDate();
  // const dateString = `${year}-${month}-${day}`;

  time = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes(),
    time.getSeconds()
  );
  // console.log(time.toString());
  // console.log(time.toLocaleString());

  const dateString = time.toISOString().split("T")[0];
  const timeString = time.toISOString().split("T")[1];
  // console.log("New Date: " + dateString + "T" + timeString);
  return new Date(dateString + "T" + timeString);
};

export const setActivityProps = (activity: IActivity, user: IUser) => {
  activity.date = new Date(activity.date);
  activity.isGoing = activity.attendees.some(
    (a) => a.username === user.username
  );
  activity.isHost = activity.attendees.some(
    (a) => a.username === user.username && a.isHost
  );
  return activity;
};

export const createAttendee = (user: IUser): IAttendee => {
  return {
    displayName: user.displayName,
    isHost: false,
    username: user.username,
    image: user.image!,
  };
};
