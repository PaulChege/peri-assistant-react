import React from "react";
import { usePromiseTracker } from "react-promise-tracker";
import Loader from "react-loader-spinner";

const LoadingIndicator = (props) => {
  const { promiseInProgress } = usePromiseTracker();
  return (
    promiseInProgress && (
      <div className="text-center">
        <br />
        <Loader type="Oval" color="#0275d8" height="50" width="50" />
      </div>
    )
  );
};

export default LoadingIndicator;
