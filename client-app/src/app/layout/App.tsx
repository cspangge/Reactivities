import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container } from "semantic-ui-react";
import { IActivity } from "../model/activity";
import NavBar from "../../features/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

interface IState {
  activities: IActivity[];
}

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);

  const handleSelectedActivity = (id: string) => {
    console.log("Now id " + id + " is selected");
    setSelectedActivity(activities.filter((elem) => elem.id === id)[0]);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleCreateActivity = (activity: IActivity) => {
    // console.log(activity.id);
    setActivities([...activities, activity]);
    setSelectedActivity(activity);
    setEditMode(false);
  };

  const handleEditActivity = (activity: IActivity) => {
    setActivities([
      ...activities.filter((a) => a.id !== activity.id),
      activity,
    ]);
    setSelectedActivity(activity);
    setEditMode(false);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities([...activities.filter((elem) => elem.id !== id)]);
  };

  useEffect(() => {
    axios
      .get<IActivity[]>("http://localhost:5000/api/activities")
      .then((response) => {
        // console.log(response);
        let activities: IActivity[] = [];
        response.data.forEach((elem) => {
          elem.date = elem.date.toString().split(".")[0];
          activities.push(elem);
        });
        setActivities(activities);
      });
  }, []);
  // [] ensure useEffect runs one time only, and doesn't continuously
  // run because every time our component renders then this use affects
  // method would be called and it's only by adding. the second parameter
  // of an empty array that we prevent that kind of behavior.
  /**
   * 我们知道 每次更新都是一次重新执行。我们给 useEffect 的第二个参数传的是 []，所以可以达到回调只运行一次的效果（只设置一次定时器）。
   * 但是我们更应该知道的是，回调函数只运行一次，并不代表 useEffect 只运行一次。在每次更新中，useEffect 依然会每次都执行，只不过因
   * 为传递给它的数组依赖项是空的，导致 React 每次检查的时候，都没有发现依赖的变化，所以不会重新执行回调。
   * 检查依赖，只是简单的比较了一下值或者引用是否相等。
   * 而且上面的写法，官方是不推荐的。我们应该确保 useEffect 中用到的状态（如：count ），都完整的添加到依赖数组中。 不管引用的是基础
   * 类型值、还是对象甚至是函数。
   */

  return (
    <div>
      <NavBar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectActivity={handleSelectedActivity}
          selectedActivity={selectedActivity!}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
        />
        {/*
        selectedActivity={selectedActivity}
        Type 'IActivity | null' is not assignable to type 'IActivity'.
        Type 'null' is not assignable to type 'IActivity'.  TS2322
        */}
        {/* !: 感叹号是非null和非undefined的类型断言，所以上面的写法就是对selectedActivity这个属性进行非空断言。 */}
        {/* 如果直接使用selectedActivity={selectedActivity}，编译器会抛出错误，
        但是使用非空断言，则表示selectedActivity肯定是存在的，从而不会产生编译问题。 */}
      </Container>
    </div>
  );
};

export default App;
