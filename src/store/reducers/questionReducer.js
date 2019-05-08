// import * as actions from "../actions";

const initialState = [
  {
    qNumber: "Q1",
    parsedNum: 1,
    qText: "This is the question text for Q1",
    CRranges: []
  },
  {
    qNumber: "Q2",
    parsedNum: 2,
    qText: "This is the question text for Q2",
    CRranges: []
  },
  {
    qNumber: "Q3",
    parsedNum: 3,
    qText: "This is the question text for Q3",
    CRranges: []
  }
];

const questionReducer = (state = initialState, action) => {
  return state;
};

export default questionReducer;
