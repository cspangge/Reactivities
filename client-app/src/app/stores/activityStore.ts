import { IActivity } from "../model/activity";
import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import agent from "../api/agent";
import { history } from "../..";
import { toast } from "react-toastify";

configure({ enforceActions: "always" }); // strict mode 只可以通过actions来修改状态

class ActivityStore {
  @observable activityRegistry = new Map();
  // @observable activities: IActivity[] = [];
  @observable loadingInitial = false;
  @observable activity: IActivity | null = null;
  @observable submitting = false;
  @observable target = "";

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
        const date = activity.date.toString().split("T")[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction("Data Loaded Successful", () => {
        activities.forEach((activity) => {
          activity.date = new Date(activity.date);
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
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction("Data Loaded Successful", () => {
          activity.date = new Date(activity.date);
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
}

export default createContext(new ActivityStore());
