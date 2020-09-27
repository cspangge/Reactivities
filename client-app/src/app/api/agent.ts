import { IPhoto, IProfile } from "./../model/profile";
import { IUserFormValues } from "./../model/user";
import { toast } from "react-toastify";
import { history } from "./../../index";
import axios, { AxiosResponse } from "axios";
import { IActivity } from "../model/activity";
import { IUser } from "../model/user";

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
        else throw error.response;
        break;
      case 500: // Server can not handle this request
        toast.error("Server error!!!");
        break;
      default:
        throw error.response;
    }
  }
});

// Add request handler
axios.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("jwt");

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const responseBody = (response: AxiosResponse) =>
  response ? response.data : "";

// const waitingTime = 2000;

// const sleep = (ms: number) => (response: AxiosResponse) =>
//   new Promise<AxiosResponse>((resolve) =>
//     setTimeout(() => resolve(response), ms)
//   );
// .then(sleep(waitingTime))

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
  postForm: (url: string, file: Blob) => {
    let formData = new FormData();
    formData.append("File", file);
    return axios
      .post(url, formData, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody);
  },
};

const Activities = {
  list: (): Promise<IActivity[]> => requests.get("/activities"),
  details: (id: string) => requests.get(`/activities/${id}`),
  create: (activity: IActivity) => requests.post("/activities", activity),
  update: (activity: IActivity) =>
    requests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.delete(`/activities/${id}`),
  attend: (id: string) => requests.post(`/activities/${id}/attend`, {}),
  unattended: (id: string) => requests.delete(`/activities/${id}/unattended`),
};

const User = {
  current: (): Promise<IUser> => requests.get("/user"),
  login: (user: IUserFormValues): Promise<IUser> =>
    requests.post(`/user/login`, user),
  register: (user: IUserFormValues): Promise<IUser> =>
    requests.post(`/user/register`, user),
};

const Profiles = {
  get: (username: string): Promise<IProfile> =>
    requests.get(`/profiles/${username}`),
  uploadPhoto: (photo: Blob): Promise<IPhoto> =>
    requests.postForm(`/photos`, photo),
  deletePhoto: (id: string) => requests.delete(`/photos/${id}`),
  setMainPhoto: (id: string) => requests.post(`/photos/${id}/setmain`, {}),
};

export default {
  Activities,
  User,
  Profiles,
};
