import { combineReducers } from "redux";
import questionReducer from "./questionReducer";
import choicesReducer from "./choicesReducer";
import projectReducer from "./projectReducer";

const rootReducer = combineReducers({
  questions: questionReducer,
  choices: choicesReducer,
  project: projectReducer
});

export default rootReducer;
