// import * as actions from "../actions";

const initialState = [
  {
    qNumber: "Q1",
    parsedNum: 1,
    qText: "This is the question text for Q1",
    CRranges: [],
    bases: [{ operator: "AND", location: "1/15(3)" }]
  },
  {
    qNumber: "Q2",
    parsedNum: 2,
    qText: "This is the question text for Q2",
    CRranges: [],
    bases: []
  },
  {
    qNumber: "Q3",
    parsedNum: 3,
    qText: "This is the question text for Q3",
    CRranges: [],
    bases: []
  }
];

const questionReducer = (state = initialState, action) => {
  return state;
};

export default questionReducer;
