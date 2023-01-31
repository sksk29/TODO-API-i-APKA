import { LoadingOverlay } from "@mantine/core";
import React from "react";

interface IProps {
  isLoading: boolean;
}

export const AppLoading: React.FC<IProps> = ({ isLoading }) => {
  return (
    <LoadingOverlay
      loaderProps={{
        size: "xl",
        color: "blue",
        variant: "bars"
      }}
      zIndex={1000}
      overlayOpacity={0.9}
      transitionDuration={500}
      exitTransitionDuration={300}
      visible={isLoading}
    ></LoadingOverlay>
  );
};
