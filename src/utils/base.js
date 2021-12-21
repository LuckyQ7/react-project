let baseURL = "";
if (process.env.NODE_ENV === "development") {
  baseURL = "http://localhost:8080";
}
export { baseURL };
