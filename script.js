"use strict";

const API = "3rpbYxdOEi36Ato7meo42FEqCCvHnQRYpq4H6EecpwyIy9hI6q0aDd8U";
const imageListEl = document.querySelector(".image-list");
const imageEl = document.querySelectorAll(".image");

const load = (I, A) => {
  let counter = 0;
  const loading = setInterval(() => {
    counter++;

    document.querySelector(".search-for").classList.add("hidden");
    document.querySelector(".loading").classList.remove("hidden");
    if (counter === 70) {
      document.querySelector(".loading").classList.add("hidden");
      counter = 0;
      clearInterval(loading);
      fetchImages(I, A);
    }
  }, 50);
};

const search = (input, button, noInput, reload) => {
  const inputBox = document.getElementById(input);
  const searchBtn = document.getElementById(button);
  const amount = document.getElementById(noInput);
  const reloadBtn = document.getElementById(reload);

  const keyEventListeners = (input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        load(inputBox.value, amount.value);
        reloadBtn.classList.remove("hidden");
        searchBtn.classList.add("hidden");
        inputBox.disabled();
        inputBox.value = "";
        amount.value = "";
      }
    });
  };

  keyEventListeners(inputBox);
  keyEventListeners(amount);

  searchBtn.addEventListener("click", () => {
    load(inputBox.value, amount.value);
    reloadBtn.classList.remove("hidden");
    searchBtn.classList.add("hidden");
    inputBox.value = "";
    amount.value = "";
  });

  reloadBtn.addEventListener("click", () => {
    location.reload();
  });
};

search("InputValue", "SearchBtn", "NoInputValue", "reloadBtn");

const fetchImages = (inputValue, amount) => {
  let amountNo = parseFloat(amount);
  let url = `https://api.pexels.com/v1/search?query=${inputValue}&per_page=${amountNo}&page=1`;

  if (amountNo < 1 || amountNo > 10) {
    alert("amout cannot be more than 10 or less than 1");
    amountNo = 4;
  } else {
    url = `https://api.pexels.com/v1/search?query=${inputValue}&per_page=${amountNo}&page=1`;
  }

  fetch(url, {
    method: "Get",
    headers: new Headers({
      Authorization: API,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);

      if (data.code === "No query param given") {
        alert("please input a search query");
      } else {
        for (let i = 0; i < data.photos.length; i++) {
          imageListEl.innerHTML += `
          <div class="image">
            <img src=${data.photos[i].src.portrait} alt=${data.photos[i].alt} />
            <button class="download-btn"><i class="bx bx-download"></i></button>
          </div>`;
          download(data.photos[i].src.portrait, data.photos[i].alt);
        }
      }
    });
};

const download = (imgUrl, name) => {
  const downloadBtn = document.querySelectorAll(".download-btn");

  const downImg = () => {
    fetch(imgUrl, {
      method: "Get",
      headers: new Headers({
        Authorization: API,
      }),
    })
      .then((response) => {
        return response.blob();
      })
      .then((file) => {
        let tempDownloadLink = URL.createObjectURL(file);
        let aTag = document.createElement("a");
        aTag.href = tempDownloadLink;
        aTag.download = name;
        document.body.appendChild(aTag);
        aTag.click();
        aTag.remove();
      });
  };

  for (let i = 0; i < downloadBtn.length; i++) {
    downloadBtn[i].addEventListener("click", downImg);
  }
};
