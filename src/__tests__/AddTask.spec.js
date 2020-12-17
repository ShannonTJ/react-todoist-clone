import React from "react";
import { render, cleanup } from "@testing-library/react";
import { AddTask } from "../components/AddTask";
import { firebase } from "../firebase";
import { useSelectedProjectValue } from "../context";

beforeEach(cleanup);

jest.mock("../context", () => ({
  useSelectedProjectValue: jest.fn(() => ({ selectedProject: "1" })),
  useProjectsValue: jest.fn(() => ({ projects: [] })),
}));

//firebase mock that passes the coverage test
jest.mock("firebase", () => ({
  firestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      add: jest.fn(() => Promise.resolve("Never mock firebase, it is bad")),
    })),
  })),
}));

describe("<AddTask />", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Success", () => {
    it("renders the <AddTask />", () => {
      const { queryByTestId } = render(<AddTask />);
      expect(queryByTestId("add-task-comp")).toBeTruthy();
    });
  });
});
