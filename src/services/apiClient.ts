import axios from "axios";

const apiClient = axios.create({
    baseURL:"https://nowted-server.remotestate.com"
})

export default apiClient;