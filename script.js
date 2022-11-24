import { books } from "./module/script.js";
//console.log(books[0])

const data = books.map((_, i) => `${_}: ${i + 1}`);

// const data = teste.forEach((name, i) => {
//   return `Item ${i + ": " + name}`;
// })

//===============================
let perPage = 4;
const state = {
  page: 1,
  perPage,
  totalPage: Math.ceil(data.length / perPage),
  maxVisibleButtons: 3,
};

const html = {
  get(element) {
    return document.querySelector(element);
  },
};

const controls = {
  next() {
    state.page++;
    if (state.page > state.totalPage) {
      state.page--;
    }
  },
  prev() {
    state.page--;
    if (state.page < 1) {
      state.page++;
    }
  },
  goTo(page) {
    if (page < 1) {
      page = 1;
    }

    state.page = +page; //add o + na frente estou transformando a string em number

    if (page > state.totalPage) {
      state.page = state.totalPage;
    }
  },
  createListeners() {
    html.get(".first").addEventListener("click", () => {
      controls.goTo(1);
      update();
    });
    html.get(".last").addEventListener("click", () => {
      controls.goTo(state.totalPage);
      update();
    });
    html.get(".next").addEventListener("click", () => {
      controls.next();
      update();
    });
    html.get(".prev").addEventListener("click", () => {
      controls.prev();
      update();
    });
  },
};

const list = {
  create(item) {
    console.log(item);
    const div = document.createElement("div");
    div.classList.add("item");
    div.innerHTML = item;

    html.get(".list").appendChild(div);
  },
  update() {
    html.get(".list").innerHTML = "";

    let page = state.page - 1;
    let start = page * state.perPage;
    let end = start + state.perPage;

    const paginatedItems = data.slice(start, end);

    paginatedItems.forEach(list.create);
  },
};

const buttons = {
  element: html.get(".pagination .numbers"),
  create(number) {
    const button = document.createElement("div");

    button.innerHTML = number;

    if (state.page == number) {
      button.classList.add("active");
    }

    button.addEventListener("click", (e) => {
      const page = e.target.innerText;

      controls.goTo(page);
      update();
    });

    buttons.element.appendChild(button);
  },
  update() {
    html.get(".pagination .numbers").innerHTML = "";
    const { maxLeft, maxRight } = buttons.calculateMaxVisible();

    for (let page = maxLeft; page <= maxRight; page++) {
      buttons.create(page);
    }
  },
  calculateMaxVisible() {
    const { maxVisibleButtons } = state;

    let maxLeft = state.page - Math.floor(maxVisibleButtons / 2);
    let maxRight = state.page + Math.floor(maxVisibleButtons / 2);

    if (maxLeft < 1) {
      maxLeft = 1;
      maxRight = maxVisibleButtons;
    }

    if (maxRight > state.totalPage) {
      maxLeft = state.totalPage - (maxVisibleButtons - 1);
      maxRight = state.totalPage;

      if (maxLeft < 1) maxLeft = 1;
    }

    return { maxLeft, maxRight };
  },
};

function init() {
  update();
  controls.createListeners();
}

function update() {
  list.update();
  buttons.update();
  console.log(state.page);
}

init();
