import axios from "axios";
import { BaseUrl } from "./const";
type imageReture = {
  data: string;
  status: boolean;
};
/**
 * Uploads a file to the server using a POST request.
 * @param {File} file - The file to be uploaded.
 * @returns {Promise<imageReture>} - A promise that resolves to an object containing the uploaded file path and status.
 * @throws {Error} - If there is an error during the upload process.
 */
export async function UploadFile(file: File): Promise<imageReture> {
  try {
    let formData = new FormData();
    formData.append("file", file);
    const data = await axios({
      method: "post",
      url: `${BaseUrl}/api/upload-file`,
      data: formData,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Options": "*",
        "Access-Control-Allow-Methods": "*",
        "X-Content-Type-Options": "*",
        "Content-Type": "multipart/form-data",
        Accept: "*",
      },
    });
    if (data.data.status == false) {
      return { data: data.data.message, status: false };
    } else {
      return { data: data.data.data.filePath, status: true };
    }
  } catch (e: any) {
    return { data: e.toString(), status: false };
  }
}

/**
 * Retrieves the currency data for the given ID.
 * @param {string} id - The ID of the currency.
 * @returns {Promise<JSON>} - A promise that resolves to the currency data in JSON format.
 * @throws {Error} - If there is an error during the API request.
 */
export async function getCurrency(id: string): Promise<JSON> {
  try {
    const data = await axios({
      method: "post",
      url: `${BaseUrl}/api/upload-file`,
      data: { id: id },
    });
    if (data.data.status == false) {
      return data.data.message;
    } else {
      return data.data.data.filePath;
    }
  } catch (e: any) {
    return e.toString();
  }
}

/**
 * Retrieves the campaign type for a given ID from the server.
 * @param {string} id - The ID of the campaign.
 * @returns {Promise<string>} - A promise that resolves to the campaign type.
 * @throws {Error} - If there is an error retrieving the campaign type.
 */
export async function getCampaignType(id: string): Promise<string> {
  try {
    const data = await axios.post(`${BaseUrl}/api/get-campaign-type`);
    if (data.data.status == false) {
      return data.data.message;
    } else {
      let name: string = "";
      for (let i: number = 0; i < data.data.data.length; i++) {
        if (data.data.data[i].id == id) {
          name = data.data.data[i].categoryName;
        }
      }
      return name;
    }
  } catch (e: any) {
    return e.toString();
  }
}

/**
 * Truncates a given text to a specified length and adds ellipsis if necessary.
 * @param {string} text - The text to truncate.
 * @param {number} long - The maximum length of the truncated text.
 * @returns {string} - The truncated text with ellipsis if necessary.
 */
const longtext = (text: string, long: number): string => {
  if (text.length <= long) {
    return text;
  } else {
    return text.substring(0, long) + " ...";
  }
};

export { longtext };

/**
 * Formats a number by adding a suffix to represent large values.
 * @param {number} value - The number to format.
 * @returns {string} The formatted number with a suffix.
 */
export const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + "M";
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + "k";
  } else {
    return value.toString();
  }
};
