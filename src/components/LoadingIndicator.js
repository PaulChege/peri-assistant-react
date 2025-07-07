import React from "react";
import { usePromiseTracker } from "react-promise-tracker";

const LoadingIndicator = (props) => {
  const { promiseInProgress } = usePromiseTracker();
  return (
    promiseInProgress && (
      <div className="text-center">
        <div className="spinner-border" role="status"></div>
      </div>
    )
  );
};

export default LoadingIndicator;
