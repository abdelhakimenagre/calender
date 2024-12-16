import React, { useEffect, useState } from "react";
import DayTable from "../functions/DayTable";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { IoTimeOutline } from "react-icons/io5";
import { MdEdit, MdDelete } from "react-icons/md";
import { RiCloseLine } from "react-icons/ri";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import {
  addTask,
  deleteTask,
  updateTask,
  UpdateTasks,
} from "../Config/Actions";
import "./todo.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
export default function Todo() {
  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  const PrColors = [
    "#00FEFE",
    "#00FEC6",
    "#00FE90",
    "#01FF24",
    "#FFFE00",
    "#FFD700",
    "#FFA500",
    "#FF5A00",
    "#FF2600",
    "#FF0000",
  ];

  const Years = [];
  for (let year = 1980; year <= 2050; year++) {
    Years.push(year);
  }
  const days = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];
  
  const dispatch = useDispatch();
  const CurrentDate = new Date();
  const [month, setMounth] = useState(CurrentDate.getMonth() + 1);
  const [year, setYear] = useState(CurrentDate.getFullYear());
  const [MonthsDays, setMounthDays] = useState([]);
  const [taskdate, setDateTask] = useState(CurrentDate);
  const [Add, setAdd] = useState(false);
  const [formattedDate, setFormDate] = useState(CurrentDate.toISOString().split("T")[0]);
  const [taskToDay, setTaskToday] = useState([]);
  const tasks = useSelector((state) => state.tasks);
  const lastid = useSelector((state) => state.tasks.length);
  const [formAdd, setFormAdd] = useState({ id: lastid + 2,completeState:false });
  const handelDayClick = (day) => {
    let form = `${year}-${month}-${day.getDate()}`;
    setDateTask(day);
    setFormDate(form);
  };
  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await axios.get("http://localhost:4000/tasks");

        dispatch(UpdateTasks(response.data));
      } catch (error) {
        console.error(error);
      }
    };
    getTasks();
  }, [tasks]);
  useEffect(() => {
    setTaskToday(tasks?.filter((task) => task.date === formattedDate));
  }, [formattedDate, tasks]);
  useEffect(() => {
    const Month_days = DayTable(month, year);
    setMounthDays(Month_days);
  }, [year, month]);
  const handelMonthChange = (e) => {
    setMounth(Number(e.target.value));
  };
  const handelYearChange = (e) => {
    setYear(Number(e.target.value));
  };
  const handelComleteClick = (ta) => {
    const task = tasks.find((task) => task.id === ta.id);
    task.completeState = !task.completeState;
    if (task) {
      dispatch(updateTask(task));
      handleUpdate(task);
    }
  };
  const AddTask = () => {
    setAdd(!Add);
  };
  const handelChengeAdd = (e) => {
    const { name, value } = e.target;
    setFormAdd((prev) => ({ ...prev, [name]: value }));
  };
  //api function
  const handleUpdate = async (task) => {
    const id = Number(task.id);
    try {
      await axios.put(`http://localhost:4000/tasks/${id}`, {
        ...task,
        completeState: task.completeState,
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleSubmit = async (e) => {
   
    try {
      const response = await axios.post("http://localhost:4000/tasks",
       {...formAdd});
      if (response.status === 201) {
        setFormAdd({ id: String(lastid + 2),completeState:false });
      }
    } catch (err) {
      console.log("Error adding article. Please try again.");
    }
  };
  const handleDelet = async (task) => {
    const id = Number(task.id);
    try {
      await axios.delete(`http://localhost:4000/tasks/${id}`);
    } catch (err) {
      console.log(err);
    }
  };
  const handelColorChengeAdd = (index) => {
    const value = index;
    setFormAdd((prev) => ({ ...prev, priority: value }));
    setFormAdd((prev) => ({ ...prev, date: formattedDate }));
  };
  const handelAddTask = () => {
    dispatch(addTask({...formAdd}));
    handleSubmit();
  };
  const handelDeleteTask = (task) => {
    dispatch(deleteTask(task));
    handleDelet(task);
  };

  return (
    <>
      <section className={Add ? "addTasks" : "hidden"}>
        <div className="AddTask">
          <div className="addHeader">
            {" "}
            <span>Ajouter Nouvelle Tâche</span>
            <div className="CloseAdd" onClick={AddTask}>
              <RiCloseLine size={20} />
            </div>
          </div>
          <div className="inputTask">
            <label htmlFor="Titre">Titre:</label>
            <br />
            <input
              className="input"
              type="text"
              id="Titre"
              name="title"
              onChange={handelChengeAdd}
              placeholder="Entrez Le Titre..."
            />
          </div>
          <div className="inputTask">
            <label htmlFor="description">Description:</label>
            <br />
            <textarea
              style={{ height: "92px" }}
              type="text"
              id="description"
              name="description"
              onChange={handelChengeAdd}
              placeholder="Entez La Description..."
            />
          </div>
          <div className="inputTask">
            <label htmlFor="Priorite">Priorité :</label>
            <br />
            <div className="colorsPr">
              {PrColors.map((color, index) => (
                <div
                  className={
                    formAdd?.priority === index ? "PrColor choix" : "PrColor"
                  }
                  key={index}
                  style={{ backgroundColor: color }}
                  onClick={() => handelColorChengeAdd(index)}
                ></div>
              ))}
            </div>
          </div>
          <div className="inputTask">
            <label htmlFor="AddTime">Date et Heure :</label>
            <br />
            <div id="AddTime">
              <div className="CloseAdd">
                <MdOutlineAccessTimeFilled size={20} />
              </div>
              <div>
                <p>
                  {taskdate?.getDay() === 0
                    ? days[6]
                    : days[taskdate?.getDay() - 1]}{" "}
                  {taskdate.getDate()} {months[taskdate.getMonth()]} ,{" "}
                  {formAdd.timeStart ? formAdd.timeStart : "8:00"} -
                  {formAdd.timeEnd ? formAdd.timeEnd : "12:00"}{" "}
                </p>
                <input
                  type="time"
                  name="timeStart"
                  onChange={handelChengeAdd}
                  className="AddHours"
                />
                -
                <input
                  type="time"
                  name="timeEnd"
                  onChange={handelChengeAdd}
                  className="AddHours"
                />
              </div>
            </div>
          </div>
          <div className="ButtonTask">
            <div></div>
            <div className="TasksButtons">
              <button
                className="AddTaskBtn"
                style={{ color: "#4D44B5" }}
                onClick={AddTask}
              >
                Annuler
              </button>
              <button
                className="AddTaskBtn"
                style={{ color: "#FFFFFF", background: "#4D44B5" }}
                onClick={handelAddTask}
              >
                Sauvgarder
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="todo-dash">
        <aside className="leftSide">
          <div className="leftSideDiv-1 ">
            <div className="todo-h1">Calendar</div>
            <div className=" buttonContainer">
              <div className="todo-btn">
                <select
                  name="month"
                  id="month"
                  onChange={handelMonthChange}
                  value={month}
                >
                  {months.map((month, index) => (
                    <option value={index + 1}>{month} </option>
                  ))}
                </select>
                <IoMdArrowDropdown
                  size={40}
                  color="#4D44B5"
                  className="dropIcon"
                />
              </div>
              <div className="todo-btn">
                <select
                  name="year"
                  id="year"
                  onChange={handelYearChange}
                  value={year}
                >
                  {Years.map((Year, index) => (
                    <option value={Year}>{Year} </option>
                  ))}
                </select>
                <IoMdArrowDropdown
                  size={40}
                  color="#4D44B5"
                  className="dropIcon"
                />
              </div>

              <button className="todo-btn" onClick={AddTask}>
                <FaPlus />
                Nouvelle Tâche
              </button>
            </div>
          </div>
          <div className="leftSideDiv-2 ">
            {days.map((day) => (
              <div> {day}</div>
            ))}
          </div>
          <div className="leftSideDiv-3 ">
            {MonthsDays.map((day, index) => (
              <div
                key={index}
                className={
                  day.getMonth() + 1 === month ? "MonthDay" : "NotMonthDay"
                }
                onClick={() => handelDayClick(day)}
              >
                {day.getDate()}
              </div>
            ))}
          </div>
        </aside>
        <aside className="rightSide">
          <div className="todoheader">
            <div>
              <div className="todoH1">Tâches De Cette Journée</div>
              <div className="todoDateH4">
                {taskdate?.getDay() === 0
                  ? days[6]
                  : days[taskdate?.getDay() - 1]}
                , {taskdate.getDate()} {months[taskdate.getMonth()]} ,{" "}
                {taskdate.getFullYear()}
              </div>
            </div>
          </div>
          <div className="tasks">
            {taskToDay?.map((task) => (
              <div className="task">
                <div
                  className="taskpr"
                  style={{ backgroundColor: PrColors[task.priority] }}
                ></div>

                <div
                  className={
                    task.completeState ? "taskDesc completed" : "taskDesc"
                  }
                >
                  <div className="taskTitle">
                    <span>{task.title}</span>
                    <input
                      type="checkbox"
                      onChange={() => handelComleteClick(task)}
                      checked={task.completeState}
                      className="TaskCompleted"
                    />
                  </div>
                  <div className="taskContent">{task.description}</div>
                  <div className="taskTime">
                    <div className="Time">
                      <IoTimeOutline size={25} color="#FCC43E" />
                      <span>
                        {task.timeStart} - {task.timeEnd}
                      </span>
                    </div>
                    <div className="taskActions">
                      <div className="editButton">
                        <MdEdit size={15} />
                      </div>
                      <div
                        className="deletButton"
                        onClick={() => handelDeleteTask(task)}
                      >
                        <MdDelete size={15} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </>
  );
}
