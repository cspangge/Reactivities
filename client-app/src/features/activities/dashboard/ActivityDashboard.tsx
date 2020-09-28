import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Grid, Loader } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { RootStoreContext } from "../../../app/stores/rootStore";
import InfiniteScroll from "react-infinite-scroller";
import ActivityFilters from "./ActivityFilters";

const ActivityDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadActivities,
    loadingInitial,
    setPage,
    page,
    totalPages,
  } = rootStore.activityStore;
  const [loadingNext, setLoadingNext] = useState(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    setPage(page + 1);
    loadActivities().then(() => {
      setLoadingNext(false);
    });
  };

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  if (loadingInitial && page === 0)
    return <LoadingComponent content="Loading Data..." size="massive" />;
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
    <Grid>
      <Grid.Column width={10}>
        <InfiniteScroll
          pageStart={0}
          initialLoad={false}
          loadMore={handleGetNext}
          hasMore={!loadingNext && page + 1 < totalPages}
          loader={
            <div className="loader" key={0}>
              Loading ...
            </div>
          }
        >
          <ActivityList />
        </InfiniteScroll>

        {/* {true && (
          <Button
            floated="right"
            content="More..."
            positive
            disabled={totalPages === page + 1}
            onClick={handleGetNext}
            loading={loadingNext}
          />
        )} */}
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityFilters />
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loadingNext} size="large" />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
