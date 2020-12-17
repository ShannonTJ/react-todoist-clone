import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { Checkbox } from "../components/Checkbox";

//clean the DOM
beforeEach(cleanup);

//firebase mock that passes the coverage test with later versions of react-scripts
jest.mock("firebase", () => ({
  firestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        update: jest.fn(),
      })),
    })),
  })),
}));

// jest.mock("../firebase", () => ({
//   firebase: {
//     firestore: jest.fn(() => ({
//       collection: jest.fn(() => ({
//         add: jest.fn(() => Promise.resolve("Never mock firebase")),
//       })),
//     })),
//   },
// }));

describe("<Checkbox />", () => {
  describe("Success", () => {
    it("renders the task checkbox", () => {
      const { queryByTestId } = render(
        <Checkbox id="1" taskDesc="Finish this tutorial series!" />
      );
      expect(queryByTestId("checkbox-action")).toBeTruthy();
    });

    it("renders the task checkbox and accepts a onClick", () => {
      const { queryByTestId } = render(
        <Checkbox id="1" taskDesc="Finish this tutorial series!" />
      );
      expect(queryByTestId("checkbox-action")).toBeTruthy();
      fireEvent.click(queryByTestId("checkbox-action"));
    });
    it("renders the task checkbox and accepts a keyDown", () => {
      const { queryByTestId } = render(
        <Checkbox id="1" taskDesc="Finish this tutorial series!" />
      );
      expect(queryByTestId("checkbox-action")).toBeTruthy();
      fireEvent.keyDown(queryByTestId("checkbox-action"));
    });
  });
});
