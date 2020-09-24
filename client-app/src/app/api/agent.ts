import { toast } from "react-toastify";
import { history } from "./../../index";
import axios, { AxiosResponse } from "axios";
import { IActivity } from "../model/activity";

axios.defaults.baseURL = "http://localhost:5000/api";

// Add error handling middleware
axios.interceptors.response.use(undefined, (error) => {
  // console.log(error);
  // console.log(error.response);
  // if (error.response.status === 404) {
  //   throw error.response;
  // }
  // if (error.response.status === 404) {
  //   history.push("/notfound");
  // }
  // console.log(error.response);
  // Check if it is network error: such as network connection refused or backend program has stop running
  if (error.message === "Network Error" && !error.response) {
    toast.error("Network error!!!");
  } else {
    const { status, data, config } = error.response;
    switch (status) {
      case 404: // Content not found
        history.push("/notfound");
        break;
      case 400: // Bad request
        if (config.method === "get" && data.errors.hasOwnProperty("id"))
          history.push("/notfound");
        break;
      case 500: // Server can not handle this request
        toast.error("Server error!!!");
        break;
    }
  }
});

const responseBody = (response: AxiosResponse) =>
  response ? response.data : "";

const waitingTime = 2000;

const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) =>
    setTimeout(() => resolve(response), ms)
  );

const requests = {
  get: (url: string) =>
    axios.get(url).then(sleep(waitingTime)).then(responseBody),
  post: (url: string, body: {}) =>
    axios.post(url, body).then(sleep(waitingTime)).then(responseBody),
  put: (url: string, body: {}) =>
    axios.put(url, body).then(sleep(waitingTime)).then(responseBody),
  delete: (url: string) =>
    axios.delete(url).then(sleep(waitingTime)).then(responseBody),
};

const Activities = {
  list: (): Promise<IActivity[]> => requests.get("/activities"),
  details: (id: string) => requests.get(`/activities/${id}`),
  create: (activity: IActivity) => requests.post("/activities", activity),
  update: (activity: IActivity) =>
    requests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.delete(`/activities/${id}`),
};

export default {
  Activities,
};
