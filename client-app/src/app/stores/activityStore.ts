import { createAttendee, setActivityProps } from "./../common/util/util";
import { RootStore } from "./rootStore";
import { IActivity } from "../model/activity";
import { observable, action, computed, runInAction, reaction } from "mobx";
import { SyntheticEvent } from "react";
import agent from "../api/agent";
import { history } from "../..";
import { toast } from "react-toastify";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

export default class ActivityStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.predicate.keys(),
      () => {
        this.page = 0;
        this.activityRegistry.clear();
        this.loadActivities();
      }
    );
  }

  @observable activityRegistry = new Map();
  // @observable activities: IActivity[] = [];
  @observable loadingInitial = false;
  @observable activity: IActivity | null = null;
  @observable submitting = false;
  @observable target = "";
  @observable loading = false;
  @observable.ref hubConnection: HubConnection | null = null; // Configure SignalR
  @observable activityCount = 0;
  @observable page = 0;
  @observable itemPerPage = 3;
  @observable predicate = new Map();

  @action setPredicate = (predicate: string, value: string | Date) => {
    this.predicate.clear();

    if (predicate !== "all") {
      this.predicate.set(predicate, value);
    }
  };

  @computed get axiosParams() {
    const params = new URLSearchParams();
    params.append("limit", this.itemPerPage.toString());
    params.append("offset", `${this.page ? this.page * this.itemPerPage : 0}`);
    this.predicate.forEach((v, k) => {
      if (k === "startDate") params.append(k, v.toISOString());
      else params.append(k, v);
    });
    return params;
  }

  @computed get totalPages() {
    return Math.ceil(this.activityCount / this.itemPerPage);
  }

  @action setPage = (page: number) => {
    this.page = page;
  };

  // Create Configure SignalR Hub Connection
  @action createHubConnection = (activityId: string) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/chatHub", {
        accessTokenFactory: () => this.rootStore.commonStore.token!,
      })
      .configureLogging(LogLevel.Information)
      .build();
    this.hubConnection
      .start()
      .then(() => console.log(this.hubConnection!.state))
      .then(() => {
        if (this.hubConnection!.state === "Connected") {
          console.log("Attempting to join group");
          this.hubConnection!.invoke("AddToGroup", activityId);
        }
      })
      .catch((error) => console.log(error));
    // await Clients.All.SendAsync("ReceiveComment", comment);
    this.hubConnection.on("ReceiveComment", (comment) => {
      runInAction(() => {
        this.activity!.comments.push(comment);
      });
    });

    this.hubConnection.on("Send", (message) => {
      toast.info(message);
    });
  };

  @action stopHubConnection = () => {
    this.hubConnection!.invoke("RemoveFromGroup", this.activity!.id)
      .then(() => {
        this.hubConnection!.stop();
      })
      .then(() => {
        console.log("Connection stopped");
      })
      .catch((error) => console.log(error));
  };

  @action addComment = async (values: any) => {
    values.activityId = this.activity!.id;
    try {
      // public async Task SendComment(Create.Command command)
      await this.hubConnection!.invoke("SendComment", values);
    } catch (error) {
      console.log(error);
    }
  };

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
      const activityEnvelope = await agent.Activities.list(this.axiosParams);
      const { activities, activityCount } = activityEnvelope;
      runInAction("Data Loaded Successful", () => {
        activities.forEach((activity: IActivity) => {
          setActivityProps(activity, user);
          // this.activities.push(activity);
          this.activityRegistry.set(activity.id, activity);
        });
        this.activityCount = activityCount;
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
      activity.comments = [];
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
