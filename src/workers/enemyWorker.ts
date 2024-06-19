export default () => {
  let ROUND = 1;
  self.onmessage = (e) => {
    const { data } = e;
    if (data.key === "") {
    }

    self.postMessage({});
  };
};
