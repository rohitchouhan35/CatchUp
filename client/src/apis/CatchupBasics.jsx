import axios from 'axios';

const BASE_URL_HOSTED = "http://localhost:8080";

const GET_UNIQUE_ROOM_ID = BASE_URL_HOSTED + '/catchup/generateRoomID';

class catchupBasicApis {
  
  static getUniqueRoomID() {
    return axios.get(GET_UNIQUE_ROOM_ID);
  }

}

export default catchupBasicApis;