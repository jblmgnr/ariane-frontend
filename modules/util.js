import MY_FETCH_API from "../myfetchapi";

function getFetchAPI() {
  if (process.env.NODE_ENV === "development") return MY_FETCH_API;

  return "LA BONNE ADRESSE UNE FOIS DEPLOIYE";
}

function showObject(obj, title = "") {
  console.log(
    "=========================================",
    title,
    JSON.stringify(obj, null, 4)
  );
}

module.exports = { getFetchAPI, showObject };
