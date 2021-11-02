import axios from 'axios'
import { API } from './api'

export default class RoomService {
    getRooms(user) {
        return axios.get(API + '/rooms')
    }
}