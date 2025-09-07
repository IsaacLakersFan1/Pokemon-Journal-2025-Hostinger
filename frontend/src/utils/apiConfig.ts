const getApiUrl = () => {
    if (import.meta.env.MODE === "development" || window.location.port === "5173") {
      return "http://localhost:3000";
    }
    if (import.meta.env.MODE === "development" || window.location.port === "4173") {
      return "http://localhost:3000";
  };
  return "http://n0ksgoooc40sckswwk8cgkso.193.46.198.43.sslip.io";
};

const API_URL = getApiUrl();

export default API_URL;
