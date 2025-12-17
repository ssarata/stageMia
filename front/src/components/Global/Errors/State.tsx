import Lottie from "lottie-react";

//
import emptyFolderAnimation from "../../../assets/lottie/empty.json";
import noDataAnimation from "../../../assets/lottie/chargement.json";
import searchEmptyAnimation from "../../../assets/lottie/empty.json";
import errorAnimation from "../../../assets/lottie/empty.json";
import emptyBoxAnimation from "../../../assets/lottie/vide.json";
import loadingAnimation from "../../../assets/lottie/chargement.json";

type AnimationType =
  | "empty-folder"
  | "no-data"
  | "search-empty"
  | "error"
  | "empty-box"
  | "loading";

interface StateProps {
  type?: AnimationType;
  title: string;
  description?: string;
  animationSize?: number;
  action?: React.ReactNode;
  className?: string;
  customAnimation?: object;
}

const animations: Record<AnimationType, object> = {
  "empty-folder": emptyFolderAnimation,
  "no-data": noDataAnimation,
  "search-empty": searchEmptyAnimation,
  "error": errorAnimation,
  "empty-box": emptyBoxAnimation,
  "loading": loadingAnimation,
};

const State = ({
  type = "empty-folder",
  title,
  description,
  animationSize = 200,
  action,
  className = "",
  customAnimation,
}: StateProps) => {
  const animationData = customAnimation || animations[type];

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-96 p-4 ${className}`}
    >
      <div style={{ width: animationSize, height: animationSize }} className="mb-4">
        <Lottie
          animationData={animationData}
          loop={true}
          autoplay={true}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2 text-center">
        {title}
      </h3>
      {description && (
        <p className="text-muted-foreground text-center max-w-md">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default State;