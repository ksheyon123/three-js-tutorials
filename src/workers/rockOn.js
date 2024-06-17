export default () => {
  let enemies = [];
  self.onmessage = (e) => {
    const { data } = e;
    if (data.key === "update") {
      const { id } = data;
      enemies.push(id);
    }

    if (data.key === "rockOn") {
      self.postMessage({ key: "rockOn", data: enemies });
    }
  };
};
