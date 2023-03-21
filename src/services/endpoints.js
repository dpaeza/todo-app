const BASE_URL_API = process.env.REACT_APP_URL_API;

const endpoints = {
    users: `${BASE_URL_API}users`,
    to_do_lists: `${BASE_URL_API}to_do_lists`
};

export default endpoints;