import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import App from "@/App";
import TrainingScreen from "./components/TrainingScreen";
import TrainingPlanEditor from "./components/TrainingsPlanEditor";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <TrainingScreen /> */}
    <TrainingPlanEditor />
  </StrictMode>
);
