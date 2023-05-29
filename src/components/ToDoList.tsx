import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";
import { Button, Paper, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "./api";

interface TaskProps {
  id: string;
  task: string;

  checked: boolean;
}

export const ToDoList = () => {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [newTask, setNewTask] = useState("");
  const [tasksChecked, setTasksChecked] = useState([]);
  const [recarregar, setRecarregar] = useState(false);

  useEffect(() => {
    let newTasksChecked: any = [];
    tasks.forEach((task) => {
      if (task.checked) {
        newTasksChecked = [...newTasksChecked, task.task];
      }
    });
    setTasksChecked(newTasksChecked);
  }, [tasks]);

  useEffect(() => {
    const buscarLista = async () => {
      try {
        setTasks((await api.get("/banco")).data);
      } catch (error) {
        console.log(error);
      }
    };
    buscarLista();
  }, [recarregar]);

  const handleEnviar = async () => {
    if (newTask.length >= 1) {
      try {
        await api.post("/banco", { task: newTask, checked: false });
        setRecarregar(!recarregar);
        setNewTask("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleExcluir = async (id: string) => {
    try {
      await api.delete(`/banco/${id}`);
      setRecarregar(!recarregar);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditar = async (id: string, checked: boolean) => {
    try {
      await api.put(`/banco/${id}`, { checked: !checked });
      setRecarregar(!recarregar);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-[100vh]">
      <Paper
        elevation={4}
        sx={{
          padding: "50px",
          margin: "20px",
          overflow: "auto",
          maxHeight: "90%",
          boxShadow: "0px 0px 40px 10px #000000ef",
          color: "black",
        }}
      >
        <h1 className="mb-4 text-lg text-center">
          To-Do List {tasksChecked.length} / {tasks.length}
        </h1>
        <div className="flex justify-center items-center">
          <TextField
            sx={{ width: "500px" }}
            type="text"
            placeholder="Add a task"
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
          />
          <div className=" flex items-center flex-col ml-2">
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              onClick={handleEnviar}
            >
              Add
            </Button>
          </div>
        </div>
        <div className=" flex flex-col p-2 gap-3 mt-3 mb-2 overflow-x-hidden text-justify">
          <ul className="md:max-w-[204px] md:grid md:grid-cols-2 md:max-w-screen-md md:gap-4 ">
            {tasks.map((task, index) => (
              <li key={index}>
                <span className="break-words">
                  {task.checked ? <CheckCircle /> : <RadioButtonUnchecked />}
                  {task.task}
                  {""}
                </span>
                <div className="flex gap-2 m-4 ml-0 justify-start ">
                  <Button
                    variant="outlined"
                    color="error"
                    size="large"
                    onClick={() => handleExcluir(task.id)}
                  >
                    Remove
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    color={task.checked ? "primary" : "success"}
                    onClick={() => handleEditar(task.id, task.checked)}
                  >
                    {task.checked ? "Refazer" : "Finalizar"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Paper>
    </div>
  );
};
