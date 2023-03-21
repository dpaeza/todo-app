import axios from "axios";
import endpoints from "./endpoints";
// https://miniback-todoapp-production.up.railway.app/users?user=dpaeza&password=1234

export const getUser = async (user, password) => {
    try {
        const { data } = await axios.get(`${endpoints.users}?user=${user}&password=${password}`)
        return data
    } catch (error) {
        console.log(error);
        return {}
    }
}

export const registeredUser = async (user) => {
    try {
        const { data } = await axios.get(`${endpoints.users}?user=${user}`)
        return data
    } catch (error) {
        console.log(error);
        return {}
    }
}

export const postUser = async (obj) => {
    try {
        const { status } = await axios.post(endpoints.users, obj)
        return status
    } catch (error) {
        console.log(error);
        return {}
    }
}
