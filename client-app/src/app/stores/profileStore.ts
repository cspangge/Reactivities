import { toast } from "react-toastify";
import { IPhoto, IProfile } from "./../model/profile";
import { action, observable, runInAction, computed } from "mobx";
import { RootStore } from "./rootStore";
import agent from "../api/agent";

export default class ProfileStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable profile: IProfile | null = null;
  @observable loadingProfile = true;
  @observable uploadingPhoto = false;
  @observable loading = false;
  @observable submitting = false;

  @computed get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.username === this.profile.username;
    } else {
      return false;
    }
  }

  @computed get getProfile() {
    if (this.rootStore.userStore.user && this.profile) {
      if (this.rootStore.userStore.user.username === this.profile.username) {
        return this.profile;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  @action loadProfile = async (username: string) => {
    // this.loadingProfile = true;
    try {
      const profile = await agent.Profiles.get(username);
      runInAction(() => {
        this.profile = profile;
        this.loadingProfile = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingProfile = false;
      });
      console.log(error);
    }
  };

  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true;
    try {
      const photo = await agent.Profiles.uploadPhoto(file);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos.push(photo);
          if (photo.isMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url;
            this.profile.image = photo.url;
          }
        }
        this.uploadingPhoto = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.uploadingPhoto = false;
      });
      toast.error("Problem uploading photo");
    }
  };

  @action setMainPhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profiles.setMainPhoto(photo.id);
      runInAction(() => {
        this.rootStore.userStore.user!.image = photo.url;
        this.profile!.photos.find((a) => a.isMain)!.isMain = false;
        this.profile!.photos.find((a) => a.id === photo.id)!.isMain = true;
        this.profile!.image = photo.url;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
      toast.error("Problem set photo as main");
    }
  };

  @action deletePhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profiles.deletePhoto(photo.id);
      runInAction(() => {
        this.profile!.photos = this.profile!.photos.filter(
          (a) => a.id !== photo.id
        );
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
      toast.error("Problem deleting photo");
    }
  };

  @action editProfile = async (profile: IProfile) => {
    this.submitting = true;

    setTimeout(() => {
      runInAction(() => {
        this.submitting = false;
      });
    });

    try {
      await agent.Profiles.update(profile);
      // console.log(profile.bio);
      // console.log(profile.displayName);
      // console.log(profile.username);
      // console.log(profile.image);
      setTimeout(() => {
        runInAction(() => {
          this.profile!.displayName = profile.displayName;
          this.profile!.bio = profile.bio;
          this.submitting = false;
        });
      }, 10000);
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.submitting = false;
      });
      toast.error("Problem editing profile");
    }
  };
}
