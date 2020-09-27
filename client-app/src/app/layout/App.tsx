import React, { Fragment, useContext, useEffect } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import {
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import NotFound from "./NotFound";
import { ToastContainer } from "react-toastify";
// import LoginForm from "../../features/user/LoginForm";
import { RootStoreContext } from "../stores/rootStore";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";
import ProfilePage from "../../features/profiles/ProfilePage";

const App: React.FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const { setAppLoaded, token, appLoaded } = rootStore.commonStore;
  const { getUser } = rootStore.userStore;

  useEffect(() => {
    if (token) {
      getUser().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
    }
  }, [getUser, setAppLoaded, token]);

  if (!appLoaded)
    return <LoadingComponent content="Loading Data..." size="massive" />;

  return (
    <Fragment>
      <ModalContainer />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        pauseOnFocusLoss
        closeOnClick
      />
      <Route exact path="/" component={HomePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Switch>
                <Route exact path="/activities" component={ActivityDashboard} />
                <Route path="/activities/:id" component={ActivityDetails} />
                <Route
                  key={location.key}
                  path={["/createActivity", "/manage/:id"]}
                  component={ActivityForm}
                />
                {/* <Route path="/login" component={LoginForm} /> */}
                <Route path="/profile/:username" component={ProfilePage} />
                {/* Page not found */}
                <Route component={NotFound} />
              </Switch>
              {/*
              selectedActivity={selectedActivity}
              Type 'IActivity | null' is not assignable to type 'IActivity'.
              Type 'null' is not assignable to type 'IActivity'.  TS2322
              */}
              {/* !: 感叹号是非null和非undefined的类型断言，所以上面的写法就是对selectedActivity这个属性进行非空断言。 */}
              {/* 如果直接使用selectedActivity={selectedActivity}，编译器会抛出错误，
              但是使用非空断言，则表示selectedActivity肯定是存在的，从而不会产生编译问题。 */}
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
