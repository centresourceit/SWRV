import { useState, useEffect } from "react";

/**
 * Custom hook that retrieves the user's current geolocation coordinates.
 * @returns An object containing the user's geolocation information, including latitude and longitude.
 */
const useGeoLocation = () => {
  const [location, setLocation] = useState<any>({
    loaded: false,
    coordinates: { lat: "", lng: "" },
  });

  /**
   * Callback function to handle successful retrieval of user's location.
   * @param {any} location - The location object containing latitude and longitude coordinates.
   * @returns None
   */
  const onSuccess = (location: any) => {
    setLocation({
      loaded: true,
      coordinates: {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
    });
  };

  /**
   * Handles an error by updating the location state with the error details.
   * @param {any} error - The error object containing the error code and message.
   * @returns None
   */
  const onError = (error: any) => {
    setLocation({
      loaded: true,
      error: {
        code: error.code,
        message: error.message,
      },
    });
  };

  /**
   * Use the Geolocation API to get the current position of the user.
   * If geolocation is not supported by the browser, an error will be thrown.
   * @returns None
   */
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      onError({
        code: 0,
        message: "Geolocation not supported",
      });
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  return location;
};

export default useGeoLocation;
