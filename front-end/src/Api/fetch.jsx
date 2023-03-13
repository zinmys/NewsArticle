async function fetchPost(url, data, opt) {
  const accessToken = !opt?``:`Bearer ${opt.accessToken}`
  return await fetch(`http://localhost:8000/api/${url}`, {
    method: "POST",
    headers: new Headers({
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": accessToken
    }),
    body: new URLSearchParams(data),
    redirect: "follow",
  })
    .then((response) => response)
    .catch((error) => error);
}

async function fetchGet(url, data, opt) {
  const accessToken = !opt?``:`Bearer ${opt.accessToken}`
  return await fetch(`http://localhost:8000/api/${url}`, {
    method: "GET",
    headers: new Headers({
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": accessToken
    }),
    redirect: "follow",
  })
    .then((response) => response)
    .catch((error) => error);
}

export {
  fetchPost,
  fetchGet
}