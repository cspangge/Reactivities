import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

const loader = (content?: string, size = "large") => {
  switch (size) {
    case "mini":
      return <Loader content={content} size="mini" />;
    case "tiny":
      return <Loader content={content} size="tiny" />;
    case "small":
      return <Loader content={content} size="small" />;
    case "medium":
      return <Loader content={content} size="medium" />;
    case "large":
      return <Loader content={content} size="large" />;
    case "big":
      return <Loader content={content} size="big" />;
    case "huge":
      return <Loader content={content} size="huge" />;
    case "massive":
      return <Loader content={content} size="massive" />;
  }
};

const LoadingComponent: React.FC<{
  inverted?: boolean;
  content?: string;
  size?: string;
}> = ({ inverted = true, content, size }) => {
  return (
    <Dimmer active inverted={inverted}>
      {loader(content, size)}
    </Dimmer>
  );
};

export default LoadingComponent;
