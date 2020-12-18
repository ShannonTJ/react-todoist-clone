import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { AddTask } from "../components/AddTask";
import { useSelectedProjectValue } from "../context";

beforeEach(cleanup);

jest.mock("../context", () => ({
  useSelectedProjectValue: jest.fn(() => ({ selectedProject: "1" })),
  useProjectsValue: jest.fn(() => ({ projects: [] })),
}));

//firebase mock that passes the coverage test in later versions of react-scripts
// jest.mock("firebase", () => ({
//   firestore: jest.fn(() => ({
//     collection: jest.fn(() => ({
//       add: jest.fn(() => Promise.resolve("Never mock firebase, it is bad")),
//     })),
//   })),
// }));

jest.mock("../firebase", () => ({
  firebase: {
    firestore: jest.fn(() => ({
      collection: jest.fn(() => ({
        add: jest.fn(() => Promise.resolve("Never mock firebase")),
      })),
    })),
  },
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

    it("renders the <AddTask /> main showable using onClick", () => {
      const { queryByTestId } = render(<AddTask showAddTaskMain />);
      fireEvent.click(queryByTestId("show-main-action"));
      expect(queryByTestId("add-task-main")).toBeTruthy();
    });

    it("renders the <AddTask /> main showable using keyDown", () => {
      const { queryByTestId } = render(<AddTask showAddTaskMain />);
      fireEvent.keyDown(queryByTestId("show-main-action"));
      expect(queryByTestId("add-task-main")).toBeTruthy();
    });

    it("renders the <AddTask /> project overlay when using onClick", () => {
      const { queryByTestId } = render(<AddTask showAddTaskMain />);

      fireEvent.click(queryByTestId("show-main-action"));
      expect(queryByTestId("add-task-main")).toBeTruthy();
      fireEvent.click(queryByTestId("show-project-overlay"));
      expect(queryByTestId("project-overlay")).toBeTruthy();
    });

    it("renders the <AddTask /> project overlay when using onKeyDown", () => {
      const { queryByTestId } = render(<AddTask showAddTaskMain />);

      fireEvent.keyDown(queryByTestId("show-main-action"));
      expect(queryByTestId("add-task-main")).toBeTruthy();
      fireEvent.keyDown(queryByTestId("show-project-overlay"));
      expect(queryByTestId("project-overlay")).toBeTruthy();
    });

    it("renders the <AddTask /> task date overlay when using onClick", () => {
      const { queryByTestId } = render(<AddTask showAddTaskMain />);

      fireEvent.click(queryByTestId("show-main-action"));
      expect(queryByTestId("add-task-main")).toBeTruthy();
      fireEvent.click(queryByTestId("show-task-date-overlay"));
      expect(queryByTestId("task-date-overlay")).toBeTruthy();
    });

    it("renders the <AddTask /> task date overlay when using onKeyDown", () => {
      const { queryByTestId } = render(<AddTask showAddTaskMain />);

      fireEvent.keyDown(queryByTestId("show-main-action"));
      expect(queryByTestId("add-task-main")).toBeTruthy();
      fireEvent.keyDown(queryByTestId("show-task-date-overlay"));
      expect(queryByTestId("task-date-overlay")).toBeTruthy();
    });

    it("hides the <AddTask /> main when cancel is clicked using onClick", () => {
      const { queryByTestId } = render(<AddTask showAddTaskMain />);

      fireEvent.click(queryByTestId("show-main-action"));
      expect(queryByTestId("add-task-main")).toBeTruthy();
      fireEvent.click(queryByTestId("add-task-main-cancel"));
      expect(queryByTestId("add-task-main")).toBeFalsy();
    });

    it("hides the <AddTask /> main when cancel is clicked using onKeyDown", () => {
      const { queryByTestId } = render(<AddTask showAddTaskMain />);

      fireEvent.keyDown(queryByTestId("show-main-action"));
      expect(queryByTestId("add-task-main")).toBeTruthy();
      fireEvent.keyDown(queryByTestId("add-task-main-cancel"));
      expect(queryByTestId("add-task-main")).toBeFalsy();
    });

    it("renders <AddTask /> for quick add task and then clicks cancel using onClick", () => {
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

    it("renders <AddTask /> for quick add task and then clicks cancel using onKeyDown", () => {
      const showQuickAddTask = true;
      const setShowQuickAddTask = jest.fn(() => !showQuickAddTask);

      const { queryByTestId } = render(
        <AddTask setShowQuickAddTask={setShowQuickAddTask} showQuickAddTask />
      );

      fireEvent.keyDown(queryByTestId("show-main-action"));
      expect(queryByTestId("add-task-main")).toBeTruthy();
      fireEvent.keyDown(queryByTestId("add-task-quick-cancel"));
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

    it("renders <AddTask /> and adds a task with a date of TODAY", () => {
      useSelectedProjectValue.mockImplementation(() => ({
        selectedProject: "1",
      }));
      const { queryByTestId } = render(<AddTask showMain />);
      fireEvent.click(queryByTestId("show-main-action"));
      expect(queryByTestId("add-task-content")).toBeTruthy();
      expect(queryByTestId("add-task-main")).toBeTruthy();

      //enter a value for the task
      fireEvent.change(queryByTestId("add-task-content"), {
        target: { value: "New task with a date!" },
      });
      expect(queryByTestId("add-task-content").value).toBe(
        "New task with a date!"
      );

      //show the date overlay
      fireEvent.click(queryByTestId("show-task-date-overlay"));
      expect(queryByTestId("task-date-overlay")).toBeTruthy();

      //select a date from the dropdown
      fireEvent.click(queryByTestId("task-date-today"));
      expect(queryByTestId("task-date-overlay")).toBeFalsy();

      //show the date overlay
      fireEvent.click(queryByTestId("show-task-date-overlay"));
      expect(queryByTestId("task-date-overlay")).toBeTruthy();

      //select a date from the dropdown
      fireEvent.keyDown(queryByTestId("task-date-today"));
      expect(queryByTestId("task-date-overlay")).toBeFalsy();

      fireEvent.click(queryByTestId("add-task"));
    });

    it("renders <AddTask /> and adds a task with a date of TOMORROW", () => {
      useSelectedProjectValue.mockImplementation(() => ({
        selectedProject: "1",
      }));
      const { queryByTestId } = render(<AddTask showMain />);
      fireEvent.click(queryByTestId("show-main-action"));
      expect(queryByTestId("add-task-content")).toBeTruthy();
      expect(queryByTestId("add-task-main")).toBeTruthy();

      //enter a value for the task
      fireEvent.change(queryByTestId("add-task-content"), {
        target: { value: "New task with a date!" },
      });
      expect(queryByTestId("add-task-content").value).toBe(
        "New task with a date!"
      );

      //show the date overlay
      fireEvent.click(queryByTestId("show-task-date-overlay"));
      expect(queryByTestId("task-date-overlay")).toBeTruthy();

      //select a date from the dropdown
      fireEvent.click(queryByTestId("task-date-tomorrow"));
      expect(queryByTestId("task-date-overlay")).toBeFalsy();

      //show the date overlay
      fireEvent.click(queryByTestId("show-task-date-overlay"));
      expect(queryByTestId("task-date-overlay")).toBeTruthy();

      //select a date from the dropdown
      fireEvent.keyDown(queryByTestId("task-date-tomorrow"));
      expect(queryByTestId("task-date-overlay")).toBeFalsy();

      fireEvent.click(queryByTestId("add-task"));
    });

    it("renders <AddTask /> and adds a task with a date of NEXT_7", () => {
      useSelectedProjectValue.mockImplementation(() => ({
        selectedProject: "1",
      }));
      const { queryByTestId } = render(<AddTask showMain />);
      fireEvent.click(queryByTestId("show-main-action"));
      expect(queryByTestId("add-task-content")).toBeTruthy();
      expect(queryByTestId("add-task-main")).toBeTruthy();

      //enter a value for the task
      fireEvent.change(queryByTestId("add-task-content"), {
        target: { value: "New task with a date!" },
      });
      expect(queryByTestId("add-task-content").value).toBe(
        "New task with a date!"
      );

      //show the date overlay
      fireEvent.click(queryByTestId("show-task-date-overlay"));
      expect(queryByTestId("task-date-overlay")).toBeTruthy();

      //select a date from the dropdown
      fireEvent.click(queryByTestId("task-date-next-week"));
      expect(queryByTestId("task-date-overlay")).toBeFalsy();

      //show the date overlay
      fireEvent.click(queryByTestId("show-task-date-overlay"));
      expect(queryByTestId("task-date-overlay")).toBeTruthy();

      //select a date from the dropdown
      fireEvent.keyDown(queryByTestId("task-date-next-week"));
      expect(queryByTestId("task-date-overlay")).toBeFalsy();

      fireEvent.click(queryByTestId("add-task"));
    });
  });
});
