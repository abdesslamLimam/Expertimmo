import { api } from "./api_config";
import socketIOClient from 'socket.io-client';

export default socket = socketIOClient(api.url_SOC);