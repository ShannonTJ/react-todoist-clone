import { useState, useEffect } from "react";
import { firebase } from "../firebase";
import { collatedTasksExist } from "../helpers";
import moment from "moment";

//useTasks hook
export const useTasks = (selectedProject) => {
  //usestate variables
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);

  useEffect(() => {
    let unsubscribe = firebase
      .firestore()
      .collection("tasks")
      .where("userId", "==", "1234");

    unsubscribe =
      selectedProject && !collatedTasksExist(selectedProject)
        ? //if the selected project does not exist in collated tasks (inbox, today, next 7 days)
          //then go through the projects and check project ids
          (unsubscribe = unsubscribe.where("projectId", "==", selectedProject))
        : //else if selected project is TODAY
        selectedProject === "TODAY"
        ? //then get all tasks where date = TODAY
          (unsubscribe = unsubscribe.where(
            "date",
            "==",
            moment().format("DD/MM/YYYY")
          ))
        : //else if selected project = INBOX or 0
        selectedProject === "INBOX" || selectedProject === 0
        ? //then unsubscribe where date is nothing (TODAY?)
          (unsubscribe = unsubscribe.where("date", "==", ""))
        : //else unsubscribe
          unsubscribe;

    //snapshot = an object with different key values
    unsubscribe = unsubscribe.onSnapshot((snapshot) => {
      //get docs from firestore and map over these
      //give each task an id
      //spread the task data into newTasks
      const newTasks = snapshot.docs.map((task) => ({
        id: task.id,
        ...task.data(),
      }));

      //once you have the newTasks data from above, you want to setTasks
      setTasks(
        selectedProject === "NEXT_7"
          ? //if the selected project is NEXT_7, check for unarchived tasks within 7 days of today's date
            newTasks.filter(
              (task) =>
                moment(task.date, "DD-MM-YYYY").diff(moment(), "days") <= 7 &&
                task.archived !== true
            )
          : //else get all unarchived tasks
            newTasks.filter((task) => task.archived !== true)
      );

      //get all archived tasks (archived = true)
      setArchivedTasks(newTasks.filter((task) => task.archived === true));
    });

    //only check projects when there is a new selected project
    return () => unsubscribe();
  }, [selectedProject]);

  return { tasks, archivedTasks };
};
