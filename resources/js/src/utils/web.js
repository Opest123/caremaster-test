import axios from "axios";

import {basePath} from "./settings";

const web = axios.create({
    baseURL: `${basePath}`,
    withCredentials: true,
});

export default web
