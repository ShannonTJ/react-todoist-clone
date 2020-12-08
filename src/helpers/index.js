import { collatedTasks } from "../constants";

export const collatedTasksExist = (selectedProject) => {
  //find tasks with the same key as the selected project
  collatedTasks.find((task) => task.key === selectedProject);
};
