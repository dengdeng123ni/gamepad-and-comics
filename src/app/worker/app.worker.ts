/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const {id,images} = data
  const response = `worker response 12321312 to ${data}`;
  postMessage(response);
});
