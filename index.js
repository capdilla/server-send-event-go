//@ts-check

const colors = new window.Gradient()
  .setColorGradient("#fc03c2", "#fed90f")
  .setMidpoint(20);

const generatePeep = (face = "fear", skinColor = "#fc03c2") => {
  const container = document.getElementById("container");

  if (!container) {
    return;
  }

  container.innerHTML = "";
  const obj = ["bun1", face, "mustache6", "laptop"];

  const peep = document.createElement("a");
  peep.setAttribute("data-css-peeps", obj.join(" "));

  peep.setAttribute("style", `--peep-skin-color: ${skinColor};`);

  container.appendChild(peep);
};

const init = () => {
  generatePeep("gasp");
  const eventSource = new EventSource("http://localhost:8080/sse");

  eventSource.addEventListener("message", function (event) {
    const data = JSON.parse(event.data);

    const color = colors.getColor(data.counter);

    let face = "gasp";

    const isQuarter = data.counter < data.max / 4;
    if (isQuarter) {
      face = "fear";
    }

    const isHalf = data.counter > data.max / 2;
    if (isHalf) {
      face = "gasp";
    }

    if (data.counter === data.max) {
      face = "awe";
    }

    generatePeep(face, color);

    if (data.counter === data.max) {
      eventSource.close();
    }
  });
};

init();
