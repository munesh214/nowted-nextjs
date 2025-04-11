import axios from "axios";

const apiClient = axios.create({
    baseURL:"https://nowted-server.remotestate.com"
    // baseURL:"http://localhost:3000/api"
})

export default apiClient;