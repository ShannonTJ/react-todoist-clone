import React from "react";
import {
  render,
  cleanup,
  fireEvent,
  getByTestId,
} from "@testing-library/react";
import { AddProject } from "../components/AddProject";

jest.mock("../context", () => ({
  useSelectedProjectValue: jest.fn(),
  useProjectsValue: jest.fn(() => ({
    projects: [
      {
        name: "test",
        projectId: "1",
        userId: "1234",
        docId: "1",
      },
      {
        name: "another",
        projectId: "2",
        userId: "1234",
        docId: "1",
      },
      {
        name: "hello",
        projectId: "3",
        userId: "1234",
        docId: "1",
      },
    ],
    setProjects: jest.fn(),
  })),
}));

jest.mock("../firebase", () => ({
  firebase: {
    firestore: jest.fn(() => ({
      collection: jest.fn(() => ({
        add: jest.fn(() => Promise.resolve("I am resolved")),
      })),
    })),
  },
}));

beforeEach(cleanup);

describe("<AddProject />", () => {
  describe("Success", () => {
    it("renders <AddProject/>", () => {
      const { queryByTestId } = render(<AddProject />);
      expect(queryByTestId("add-project")).toBeTruthy();
    });

    it("renders <AddProject/> and adds a project using onClick", () => {
      const { queryByTestId } = render(<AddProject shouldShow />);
      expect(queryByTestId("add-project")).toBeTruthy();
      fireEvent.change(queryByTestId("project-name"), {
        target: { value: "Todoist clone" },
      });
      expect(queryByTestId("project-name").value).toBe("Todoist clone");
      fireEvent.click(queryByTestId("add-project-submit"));
    });

    it("renders <AddProject/> and adds a project using onKeyDown", () => {
      const { queryByTestId } = render(<AddProject shouldShow />);
      expect(queryByTestId("add-project")).toBeTruthy();
      fireEvent.change(queryByTestId("project-name"), {
        target: { value: "Todoist clone" },
      });
      expect(queryByTestId("project-name").value).toBe("Todoist clone");
      fireEvent.keyDown(queryByTestId("add-project-submit"));
    });

    it("hides the project overlay when cancelled using onClick", () => {
      const { queryByTestId, getByText } = render(<AddProject shouldShow />);
      expect(queryByTestId("add-project")).toBeTruthy();
      expect(queryByTestId("add-project-inner")).toBeTruthy();
      fireEvent.click(getByText("Cancel"));
      expect(queryByTestId("add-project")).toBeTruthy();
      expect(queryByTestId("add-project-inner")).toBeFalsy();
    });

    it("hides the project overlay when cancelled using onKeyDown", () => {
      const { queryByTestId, getByText } = render(<AddProject shouldShow />);
      expect(queryByTestId("add-project")).toBeTruthy();
      expect(queryByTestId("add-project-inner")).toBeTruthy();
      fireEvent.keyDown(getByText("Cancel"));
      expect(queryByTestId("add-project")).toBeTruthy();
      expect(queryByTestId("add-project-inner")).toBeFalsy();
    });

    it("hides the project overlay onClick toggle action", () => {
      const { queryByTestId } = render(<AddProject shouldShow />);
      expect(queryByTestId("add-project")).toBeTruthy();
      expect(queryByTestId("add-project-inner")).toBeTruthy();
      fireEvent.click(queryByTestId("add-project-action"));
      expect(queryByTestId("add-project")).toBeTruthy();
      expect(queryByTestId("add-project-inner")).toBeFalsy();
    });

    it("hides the project overlay onKeyDown toggle action", () => {
      const { queryByTestId } = render(<AddProject shouldShow />);
      expect(queryByTestId("add-project")).toBeTruthy();
      expect(queryByTestId("add-project-inner")).toBeTruthy();
      fireEvent.keyDown(queryByTestId("add-project-action"));
      expect(queryByTestId("add-project")).toBeTruthy();
      expect(queryByTestId("add-project-inner")).toBeFalsy();
    });
  });
});
