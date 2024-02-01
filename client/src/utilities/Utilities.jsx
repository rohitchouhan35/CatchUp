import { v4 as uuidv4 } from "uuid";
import catchupBasicApis from './../apis/CatchupBasics';

class Utilities {
  static async getUniqueID() {
    // use server side generated room ID
    // return uuidv4();

    try {
      const response = await catchupBasicApis.getUniqueRoomID();
      return response.data;
    } catch (error) {
      console.error("Error fetching unique ID:", error);
      return null;
    }
    
  }

  static parseJSON(message) {
    try {
      return JSON.parse(message.body);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  }

  static generateUniqueUsername(name = "") {
    // If name is provided, use it; otherwise, generate a unique username based on timestamp
    const baseUsername = name.trim() !== "" ? name.trim() : "User";
    
    try {
      const timestamp = Date.now().toString().slice(4); // Remove the first 4 characters
      const uniqueUsername = `${baseUsername}_${timestamp}`;
      return uniqueUsername;
    } catch (error) {
      console.error("Error generating unique username:", error);
      return null;
    }
  }

}

export default Utilities;
