export default () => {
  let life = 10;
  self.onmessage = (e) => {
    const { data } = e;
    const { command } = data;
    if (command === "get_life_info") {
      self.postMessage({
        type: "get_life_info",
        life,
      });
    }

    if (command === "lose_life") {
      life--;
      self.postMessage({
        type: "get_life_info",
        life,
      });
    }
  };
};
