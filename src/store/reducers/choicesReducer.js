import * as actions from "../actions/index";

const initialState = [
  [
    {
      qNumber: "Q1",
      cText: "q1 c1 choice text",
      cCard: 1,
      cCol: 10,
      cLocation: 101,
      isTermPoint: false
    },
    {
      qNumber: "Q1",
      cText: "q1 c2 choice text",
      cCard: 1,
      cCol: 10,
      cLocation: 102,
      isTermPoint: false
    },
    {
      qNumber: "Q1",
      cText: "q1 c3 choice text",
      cCard: 1,
      cCol: 10,
      cLocation: 103,
      isTermPoint: false
    }
  ],
  [
    {
      qNumber: "Q2",
      cText: "q2 c1 choice text",
      cCard: 1,
      cCol: 11,
      cLocation: 101,
      isTermPoint: false
    },
    {
      qNumber: "Q2",
      cText: "q2 c2 choice text",
      cCard: 1,
      cCol: 11,
      cLocation: 102,
      isTermPoint: false
    },
    {
      qNumber: "Q2",
      cText: "q2 c3 choice text",
      cCard: 1,
      cCol: 11,
      cLocation: 103,
      isTermPoint: false
    }
  ],
  [
    {
      qNumber: "Q3",
      cText: "q3 c1 choice text",
      cCard: 1,
      cCol: 12,
      cLocation: 101,
      isTermPoint: false
    },
    {
      qNumber: "Q3",
      cText: "q3 c2 choice text",
      cCard: 1,
      cCol: 12,
      cLocation: 102,
      isTermPoint: false
    },
    {
      qNumber: "Q3",
      cText: "q3 c3 choice text",
      cCard: 1,
      cCol: 12,
      cLocation: 103,
      isTermPoint: false
    }
  ]
];

const choicesReducer = (state = initialState, action) => {
  // console.log("STATE: ", state);
  switch (action.type) {
    case actions.TOGGLE_TERM_POINT:
      let tmpState = Array.from(state);
      let newState = toggleTermPoint(
        tmpState,
        action.choiceData.qNumber,
        action.choiceData
      );
      // console.log("Returning New State", newState);

      return newState;

    default:
      // console.log("Default State Returned");
      return state;
  }
};

export const toggleTermPoint = (tmpState, qNum, choiceData) => {
  let index1 = null;
  let index2 = null;
  // console.log("Inside reducer");

  // Get first index of choice from 2D array
  tmpState.forEach((item, ind) => {
    if (item[0].qNumber === qNum) {
      index1 = ind;
    }
  });

  // Get second index of choice from 2D array
  tmpState[index1].forEach((item, ind) => {
    if (item === choiceData) {
      index2 = ind;
    }
  });

  // Toggle isTermPoint
  tmpState[index1][index2].isTermPoint = !tmpState[index1][index2].isTermPoint;
  // console.log("NEW STATE: ", tmpState);
  return tmpState;
};

export default choicesReducer;
