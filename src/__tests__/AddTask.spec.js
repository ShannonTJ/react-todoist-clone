import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { AddTask } from "../components/AddTask";
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

    it("renders the <AddTask /> quick overlay", () => {
      const setShowQuickAddTask = jest.fn();

      const { queryByTestId } = render(
        <AddTask
          showAddTaskMain
          shouldShowMain={false}
          showQuickAddTask
          setShowQuickAddTask={setShowQuickAddTask}
        />
      );
      expect(queryByTestId("quick-add-task")).toBeTruthy();
    });

    it("renders the <AddTask /> main showable when clicked", () => {
      const { queryByTestId } = render(<AddTask showAddTaskMain />);
      fireEvent.click(queryByTestId("show-main-action"));
      expect(queryByTestId("add-task-main")).toBeTruthy();
    });

    it("renders the <AddTask /> project overlay when clicked", () => {
      const { queryByTestId } = render(<AddTask showAddTaskMain />);

      fireEvent.click(queryByTestId("show-main-action"));
      expect(queryByTestId("add-task-main")).toBeTruthy();
      fireEvent.click(queryByTestId("show-project-overlay"));
      expect(queryByTestId("project-overlay")).toBeTruthy();
    });

    it("renders the <AddTask /> task date overlay when clicked", () => {
      const { queryByTestId } = render(<AddTask showAddTaskMain />);

      fireEvent.click(queryByTestId("show-main-action"));
      expect(queryByTestId("add-task-main")).toBeTruthy();
      fireEvent.click(queryByTestId("show-task-date-overlay"));
      expect(queryByTestId("task-date-overlay")).toBeTruthy();
    });

    it("hides the <AddTask /> main when cancel is clicked", () => {
      const { queryByTestId } = render(<AddTask showAddTaskMain />);

      fireEvent.click(queryByTestId("show-main-action"));
      expect(queryByTestId("add-task-main")).toBeTruthy();
      fireEvent.click(queryByTestId("add-task-main-cancel"));
      expect(queryByTestId("add-task-main")).toBeFalsy();
    });

    it("renders <AddTask /> for quick add task and then clicks cancel", () => {
      const showQuickAddTask = true;
      const setShowQuickAddTask = jest.fn(() => !showQuickAddTask);

      const { queryByTestId } = render(
        <AddTask setShowQuickAddTask={setShowQuickAddTask} showQuickAddTask />
      );

      fireEvent.click(queryByTestId("show-main-action"));
      expect(queryByTestId("add-task-main")).toBeTruthy();
      fireEvent.click(queryByTestId("add-task-quick-cancel"));
      expect(setShowQuickAddTask).toHaveBeenCalled();
    });

    it("renders <AddTask/> and adds a task to TODAY", () => {
      useSelectedProjectValue.mockImplementation(() => ({
        selectedProject: "TODAY",
      }));
      //want to use the main input form, not the quick add
      const showQuickAddTask = true;
      const setShowQuickAddTask = jest.fn(() => !showQuickAddTask);
      const { queryByTestId } = render(
        <AddTask
          showQuickAddTask={showQuickAddTask}
          setShowQuickAddTask={setShowQuickAddTask}
        />
      );
      fireEvent.click(queryByTestId("show-main-action"));
      //expect the input to display
      expect(queryByTestId("add-task-content")).toBeTruthy();
      //change input value
      fireEvent.change(queryByTestId("add-task-content"), {
        target: { value: "New task!" },
      });
      //expect to get our input value
      expect(queryByTestId("add-task-content").value).toBe("New task!");
      //add the task and expect to return to the main screen
      fireEvent.click(queryByTestId("add-task"));
      expect(setShowQuickAddTask).toHaveBeenCalled();
    });
    it("renders <AddTask/> and adds a task to NEXT_7", () => {
      useSelectedProjectValue.mockImplementation(() => ({
        selectedProject: "NEXT_7",
      }));
      //want to use the main input form, not the quick add
      const showQuickAddTask = true;
      const setShowQuickAddTask = jest.fn(() => !showQuickAddTask);
      const { queryByTestId } = render(
        <AddTask
          showQuickAddTask={showQuickAddTask}
          setShowQuickAddTask={setShowQuickAddTask}
        />
      );
      fireEvent.click(queryByTestId("show-main-action"));
      //expect the input to display
      expect(queryByTestId("add-task-content")).toBeTruthy();
      //change input value
      fireEvent.change(queryByTestId("add-task-content"), {
        target: { value: "New task!" },
      });
      //expect to get our input value
      expect(queryByTestId("add-task-content").value).toBe("New task!");
      //add the task and expect to return to the main screen
      fireEvent.click(queryByTestId("add-task"));
      expect(setShowQuickAddTask).toHaveBeenCalled();
    });
  });
});
