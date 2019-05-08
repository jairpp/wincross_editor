import rootReudcer from "../../store/reducers";
import * as wcS from "../wcSingleChoice";

const reducer = rootReudcer();
let questions = reducer.questions;
let choices = reducer.choices;
let project = reducer.project;

// test("testing jest", () => {
//   let passChoices = choices[0].filter(choice => choice.isTermPoint === false);
//   expect(passChoices).toBe(true);
// });
