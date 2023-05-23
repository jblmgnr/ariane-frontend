import MY_FETCH_API from "../myfetchapi";

function getFetchAPI() {
  if (process.env.NODE_ENV === "development") return MY_FETCH_API;

  return "LA BONNE ADRESSE UNE FOIS DEPLOIYE";
}

function showObject(obj, title = "") {
  return;
  console.log(
    "=========================================",
    title,
    JSON.stringify(obj, null, 4)
  );
}

function showObjects(list, title = "") {
  return;
  console.log(title + " =============== count " + list.length);

  for (let obj of list) console.log(JSON.stringify(obj, null, 8));
}

module.exports = { getFetchAPI, showObject, showObjects };
