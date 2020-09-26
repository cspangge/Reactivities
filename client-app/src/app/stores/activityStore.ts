import { createAttendee, setActivityProps } from "./../common/util/util";
import { RootStore } from "./rootStore";
import { IActivity } from "../model/activity";
import { observable, action, computed, runInAction } from "mobx";
import { SyntheticEvent } from "react";
import agent from "../api/agent";
import { history } from "../..";
import { toast } from "react-toastify";

export default class ActivityStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable activityRegistry = new Map();
  // @observable activities: IActivity[] = [];
  @observable loadingInitial = false;
  @observable activity: IActivity | null = null;
  @observable submitting = false;
  @observable target = "";
  @observable loading = false;

  @computed get activitiesByDate() {
    // return this.activities.sort(
    //   (b, a) => Date.parse(a.date) - Date.parse(b.date)
    // );
    // console.log(
    //   this.groupActivitiesByDate(Array.from(this.activityRegistry.values()))
    // );
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (b, a) => a.date.getTime() - b.date.getTime()
    );
    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        // 按日期分组
        const date = activity.date.toISOString().split("T")[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    const user = this.rootStore.userStore.user!;
    try {
      const activities = await agent.Activities.list();
      runInAction("Data Loaded Successful", () => {
        activities.forEach((activity) => {
          setActivityProps(activity, user);
          // this.activities.push(activity);
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      console.log(error);
      runInAction("Data Loaded Failed", () => {
        this.loadingInitial = false;
      });
    }
  };

  @action loadActivity = async (id: string) => {
    const user = this.rootStore.userStore.user!;
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction("Data Loaded Successful", () => {
          setActivityProps(activity, user);
          this.activity = activity;
          this.activityRegistry.set(activity.id, activity);
          this.loadingInitial = false;
        });
        return activity;
      } catch (error) {
        console.log(error);
        runInAction("Data Loaded Failed", () => {
          this.loadingInitial = false;
        });
        // throw error
      }
    }
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  @action clearActivity = () => {
    this.activity = null;
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      const attendee = createAttendee(this.rootStore.userStore.user!);
      attendee.isHost = true;
      let attendees = [];
      attendees.push(attendee);
      activity.attendees = attendees;
      activity.isHost = true;
      // this.activities.push(activity);
      runInAction("Data Created Successful", () => {
        this.activityRegistry.set(activity.id, activity);
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      // console.log(error);
      runInAction("Data Created Failed", () => {
        this.submitting = false;
      });
      // console.log(error.response);
      toast.error("Problem submitting data");
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction("Data Edited Successful", () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      // console.log(error);
      runInAction("Data Edited Failed", () => {
        this.submitting = false;
      });
      toast.error("Problem submitting data");
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction("Data Deleted Successful", () => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = "";
      });
    } catch (error) {
      // console.log(error);
      runInAction("Data Deleted Failed", () => {
        this.submitting = false;
        this.target = "";
      });
      toast.error("Problem deleting data");
    }
  };

  @action attendActivity = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user!);
    this.loading = true;
    try {
      await agent.Activities.attend(this.activity!.id);
      runInAction(() => {
        if (this.activity) {
          this.activity.attendees.push(attendee);
          this.activity.isGoing = true;
          this.activityRegistry.set(this.activity.id, this.activity);
          this.loading = false;
        }
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem signing up to activity");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action unattendedActivity = async () => {
    this.loading = true;
    try {
      await agent.Activities.unattended(this.activity!.id);
      runInAction(() => {
        if (this.activity) {
          this.activity.attendees = this.activity.attendees.filter(
            (a) => a.username !== this.rootStore.userStore.user!.username
          );
          this.activity.isGoing = false;
          this.activityRegistry.set(this.activity.id, this.activity);
          this.loading = false;
        }
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem cancelling attendance");
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}
