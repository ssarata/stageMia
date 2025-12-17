import React from "react";
import { cn } from "@/lib/utils"; 

type SpinnerProps = {
  size?: number;
  className?: string;
};

export const Spinner: React.FC<SpinnerProps> = ({ size = 24, className }) => {
  return (
    <div
      className={cn("animate-spin rounded-full border-2 border-t-transparent", className)}
      style={{ width: size, height: size }}
    />
  );
};
