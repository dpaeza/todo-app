import React, { useEffect, useState } from "react";
import moon from "../../assets/icons/icon-moon.svg";
import sun from "../../assets/icons/icon-sun.svg";
import Swal from "sweetalert2";
import x from "../../assets/icons/icon-cross.svg";
import check from "../../assets/icons/icon-check.svg";
import {
    NavLink,
    useParams,
    Link,
    useNavigate,
    useLocation,
} from "react-router-dom";
import { getUserList, createTodo } from "../../services/to_do_lists";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Home = () => {
    const userLogin = useLocation();
    const [todo, setTodo] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [newTodo, setNewTodo] = useState("");
    const [idList, setIdList] = useState();
    const [light, setLight] = useState(true);
    const itemsLeft = todo.filter((obj) => obj.status == "active").length;

    //Function to get the to do list of the login user
    const getList = async () => {
        const response = await getUserList(userLogin.state);
        setTodo(response[0].list);
        setIdList(response[0].id);
    };

    //function to edit to do list whit patch
    const editlist = async (newList) => {
        try {
            const response = await createTodo(idList, { list: newList });
            if (response == 200) {
                setTodo(newList);
            } else {
                Swal.fire({
                    icon: "error",
                    iconColor: "#f63d5d",
                    background: "white",
                    color: "black",
                    text: "Lo sentimos, hubo un error al procesar la solicitud, intenta de nuevo.",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                iconColor: "#f63d5d",
                background: "white",
                color: "black",
                text: "Lo sentimos, hubo un error al procesar la solicitud, intenta de nuevo.",
            });
        }
    };

    //Function to add new to do
    const handleKeyDown = async (event) => {
        if (event.key === "Enter") {
            const newListAdd = [
                ...todo,
                {
                    to_do: event.target.value,
                    status: "active",
                },
            ];
            editlist(newListAdd);
            setNewTodo("");
        }
    };

    //function to mark a to do as completed or active
    const handleCompleted = (tarea) => {
        console.log(tarea);
        const updatedTodoList = todo.map((item) => {
            if (item.to_do === tarea.to_do) {
                return {
                    ...item,
                    status: item.status == "completed" ? "active" : "completed",
                };
            } else {
                return item;
            }
        });
        console.log(updatedTodoList);
        editlist(updatedTodoList);
    };

    //Function to delete a to do
    const handleDeleteToDo = (tarea) => {
        const newArray = todo.filter((item) => item.to_do !== tarea.to_do);
        editlist(newArray);
    };

    //Function to delete all completed to do
    const handleClearCompleted = () => {
        const newArrayClear = todo.filter((item) => item.status == "active");
        editlist(newArrayClear);
    };

    //Function to change theme
    const handleTheme = () => {
        setLight(!light);
    };

    useEffect(() => {
        getList();
    }, [todo]);

    const reorder = (list, startIndex, endIndex) => {
        const resultado = [...list];
        const [removed] = resultado.splice(startIndex, 1);
        resultado.splice(endIndex, 0, removed);
        console.log(resultado);
        editlist(resultado);
    }

    //Function to drag and drop
    const dragAndDrop = (result) => {
        console.log(result);
        const { source, destination } = result;
        if (!destination) {
            return;
        }
        if (source.index == destination.index) {
            return;
        }
        reorder(todo, source.index, destination.index)
    };

    return (
        <DragDropContext onDragEnd={(result) => dragAndDrop(result)}>
            <section className="home">
                <div
                    className={light ? "home__div1" : "home__div1__dark"}
                ></div>
                <div
                    className={light ? "home__div2" : "home__div2__dark"}
                ></div>
                <section className="home__fixed">
                    <div className="home__fixed__header">
                        <h1>TO DO</h1>
                        <i>
                            <img
                                src={light ? moon : sun}
                                alt="icon moon"
                                onClick={handleTheme}
                            />
                        </i>
                    </div>
                    <div
                        className={
                            light
                                ? "home__fixed__input"
                                : "home__fixed__input__dark"
                        }
                    >
                        <div></div>
                        <input
                            type="text"
                            placeholder="Create a new todo..."
                            value={newTodo}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => setNewTodo(e.target.value)}
                        />
                    </div>
                    <div
                        className={
                            light
                                ? "home__fixed__list"
                                : "home__fixed__list__dark"
                        }
                    >
                        <Droppable droppableId="todo">
                            {(droppableProvided) => (
                                <div
                                    {...droppableProvided.droppableProps}
                                    ref={droppableProvided.innerRef}
                                    className="home__fixed__list__itemsContainer"
                                >
                                    {todo
                                        .filter((item) => {
                                            if (selectedFilter === "all")
                                                return true;
                                            if (selectedFilter === "active")
                                                return item.status === "active";
                                            if (selectedFilter === "completed")
                                                return (
                                                    item.status === "completed"
                                                );
                                            return false;
                                        })
                                        .map((item, index) => (
                                            <Draggable
                                                key={item.to_do}
                                                draggableId={item.to_do}
                                                index={index}
                                            >
                                                {(draggableProvided) => (
                                                    <div
                                                        {...draggableProvided.draggableProps}
                                                        ref={
                                                            draggableProvided.innerRef
                                                        }
                                                        {...draggableProvided.dragHandleProps}
                                                        className={`home__fixed__list__itemsContainer__item${
                                                            item.status ===
                                                            "active"
                                                                ? "__active"
                                                                : "__completed"
                                                        }${
                                                            light
                                                                ? ""
                                                                : "__dark"
                                                        }`}
                                                    >
                                                        <div
                                                            onClick={() =>
                                                                handleCompleted(
                                                                    item
                                                                )
                                                            }
                                                        >
                                                            {item.status ==
                                                            "completed" ? (
                                                                <img
                                                                    src={check}
                                                                    alt="check icon"
                                                                />
                                                            ) : (
                                                                ""
                                                            )}
                                                        </div>
                                                        <p>{item.to_do}</p>
                                                        <i
                                                            onClick={() =>
                                                                handleDeleteToDo(
                                                                    item
                                                                )
                                                            }
                                                        >
                                                            <img
                                                                src={x}
                                                                alt="close icon"
                                                                className="x"
                                                            />
                                                        </i>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {droppableProvided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        <div
                            className={
                                light
                                    ? "home__fixed__list__options"
                                    : "home__fixed__list__options__dark"
                            }
                        >
                            <p className="home__fixed__list__options__left">
                                {itemsLeft} items left
                            </p>
                            <div className="home__fixed__list__options__divOptions">
                                <p
                                    style={{
                                        color:
                                            selectedFilter === "all"
                                                ? "hsl(220,98%,61%)"
                                                : light
                                                ? "#C1C0C4"
                                                : "#46485f",
                                    }}
                                    onClick={() => setSelectedFilter("all")}
                                >
                                    All
                                </p>
                                <p
                                    style={{
                                        color:
                                            selectedFilter === "active"
                                                ? "hsl(220,98%,61%)"
                                                : light
                                                ? "#C1C0C4"
                                                : "#46485f",
                                    }}
                                    onClick={() => setSelectedFilter("active")}
                                >
                                    Active
                                </p>
                                <p
                                    style={{
                                        color:
                                            selectedFilter === "completed"
                                                ? "hsl(220,98%,61%)"
                                                : light
                                                ? "#C1C0C4"
                                                : "#46485f",
                                    }}
                                    onClick={() =>
                                        setSelectedFilter("completed")
                                    }
                                >
                                    Completed
                                </p>
                            </div>
                            <p
                                className="home__fixed__list__options__right"
                                onClick={() => handleClearCompleted()}
                            >
                                Clear Completed
                            </p>
                        </div>
                    </div>
                    <div
                        className={
                            light
                                ? "home__fixed__list__options__divOptions__mobile"
                                : "home__fixed__list__options__divOptions__mobile__dark"
                        }
                    >
                        <p
                            style={{
                                color:
                                    selectedFilter === "all"
                                        ? "hsl(220,98%,61%)"
                                        : light
                                        ? "#C1C0C4"
                                        : "#46485f",
                            }}
                            onClick={() => setSelectedFilter("all")}
                        >
                            All
                        </p>
                        <p
                            style={{
                                color:
                                    selectedFilter === "active"
                                        ? "hsl(220,98%,61%)"
                                        : light
                                        ? "#C1C0C4"
                                        : "#46485f",
                            }}
                            onClick={() => setSelectedFilter("active")}
                        >
                            Active
                        </p>
                        <p
                            style={{
                                color:
                                    selectedFilter === "completed"
                                        ? "hsl(220,98%,61%)"
                                        : light
                                        ? "#C1C0C4"
                                        : "#46485f",
                            }}
                            onClick={() => setSelectedFilter("completed")}
                        >
                            Completed
                        </p>
                    </div>
                    <p className="home__fixed__p">
                        Drag and drop to reorder list{" "}
                        <Link to={"/"}> Log out</Link>
                    </p>
                </section>
            </section>
        </DragDropContext>
    );
};

export default Home;
