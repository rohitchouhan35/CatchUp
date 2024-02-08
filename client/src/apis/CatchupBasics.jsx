import axios from 'axios';

const BASE_URL_HOSTED = "https://catchup-media-server-beta.onrender.com";
// const BASE_URL_HOSTED = "wss://catchup-media-server-beta.onrender.com/meet";

const GET_UNIQUE_ROOM_ID = BASE_URL_HOSTED + '/catchup/generateRoomID';

class catchupBasicApis {
  
  static getUniqueRoomID() {
    return axios.get(GET_UNIQUE_ROOM_ID);
  }

}

export default catchupBasicApis;