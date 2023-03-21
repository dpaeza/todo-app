import axios from "axios";
import endpoints from "./endpoints";

export const getUserList = async (idUser) => {
    try {
        const { data } = await axios.get(`${endpoints.to_do_lists}?id_user=${idUser}`)
        return data
    } catch (error) {
        console.log(error);
        return {}
    }
}

export const createTodo = async (idUser,toDo) => {
    try {
        const { status } = await axios.patch(`${endpoints.to_do_lists}/${idUser}`, toDo)
        return status
    } catch (error) {
        console.log(error);
        return {}
    }
}