import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { Tasks } from "../components/Tasks";
import { useSelectedProjectValue } from "../context";

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
  })),
}));

//mock useTasks hook
jest.mock("../hooks", () => ({
  useTasks: () => ({
    tasks: [
      {
        name: "test2",
        date: "",
        archived: true,
        projectId: "1",
        task: "This is a song!",
        userId: "1234",
      },
    ],
  }),
}));

beforeEach(cleanup);

describe("<Tasks />", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders tasks", () => {
    useSelectedProjectValue.mockImplementation(() => ({
      setSelectedProject: jest.fn(() => "INBOX"),
      selectedProject: "INBOX",
    }));
    const { queryByTestId } = render(<Tasks />);
    expect(queryByTestId("tasks")).toBeTruthy();
    expect(queryByTestId("project-name").textContent).toBe("Inbox");
  });

  it("renders a task with a project title", () => {
    useSelectedProjectValue.mockImplementation(() => ({
      setSelectedProject: jest.fn(() => "1"),
      selectedProject: "1",
    }));
    const { queryByTestId } = render(<Tasks />);
    expect(queryByTestId("tasks")).toBeTruthy();
    expect(queryByTestId("project-name").textContent).toBe("test");
  });
});
