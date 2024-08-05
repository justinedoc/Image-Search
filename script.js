"use strict";

const API = "3rpbYxdOEi36Ato7meo42FEqCCvHnQRYpq4H6EecpwyIy9hI6q0aDd8U";
const imageListEl = document.querySelector(".image-list");
const imageEl = document.querySelectorAll(".image");
const loader = document.querySelector(".loading");
const searchForEl = document.querySelector(".search-for");
let downloadBtn;
///// SEARCH FUNCTION //////
const search = (input, button) => {
  const inputBox = document.getElementById(input);
  const searchBtn = document.getElementById(button);

  inputBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      inputBox.value && fetchImages(inputBox.value);
    }
  });

  searchBtn.addEventListener("click", () => {
    inputBox.value && fetchImages(inputBox.value);
  });
};

search("InputValue", "SearchBtn");

///// FUNCTION TO FETCH IMAGE ////
async function fetchImages(inputValue) {
  let defaultAmt = window.screen.availWidth < 480 ? 4 : 8;
  let baseURL = `https://api.pexels.com/v1/search?query=${inputValue}&per_page=${defaultAmt}&page=1`;

  loader.classList.remove("hidden");
  searchForEl.classList.add("hidden");
  try {
    const response = await fetch(baseURL, {
      method: "Get",
      headers: new Headers({
        Authorization: API,
      }),
    });

    const data = await response.json();
    if (data.code === "No query param given") {
      Swal.fire({
        icon: "error",
        title: "Try again later",
        backdrop: `rgba(0,0,5,0.4)`,
        timer: 3000,
      });
    } else {
      imageListEl.innerHTML = ``;
      console.log(data.photos);
      for (const photo of data.photos) {
        const {
          alt,
          src: { medium: img },
        } = photo;
        imageListEl.innerHTML += `
        <div class="image">
          <img src=${img} alt=${alt} class="img"/>
          <button class="download-btn"><i class="bx bx-download icon"></i></button>
        </div>`;
        downloadBtn = document.querySelectorAll(".download-btn");
      }
      download();
    }
    loader.classList.add("hidden");
  } catch (err) {
    console.log(err);
    Swal.fire({
      icon: "error",
      title: "No Internet Connection",
      backdrop: `rgba(0,0,5,0.4)`,
      timer: 5000,
    });

    searchForEl.classList.remove("hidden");
    loader.classList.add("hidden");
  }
}

async function downloadImg(imgURL, imgName) {
  const icons = document.querySelectorAll(".icon");
  const switchIcons = (firstParam, secondParam, spin) => {
    icons.forEach((icon) => {
      icon.classList.replace(firstParam, secondParam);
      if (spin) {
        icon.classList.add("bx-spin");
      } else {
        icon.classList.remove("bx-spin");
      }
    });
  };
  switchIcons("bx-download", "bx-loader-alt", true);

  try {
    const response = await fetch(imgURL, {
      method: "Get",
      headers: new Headers({
        Authorization: API,
      }),
    });

    const file = await response.blob();
    const downloadLink = URL.createObjectURL(file);
    const aTag = document.createElement("a");
    aTag.href = downloadLink;
    aTag.download = imgName.slice(0, 10);
    aTag.click();
    aTag.remove();
    switchIcons("bx-loader-alt", "bx-download", false);
  } catch (err) {
    console.log(err);
  }
}

const download = () => {
  const downloadBtn = document.querySelectorAll(".download-btn");
  downloadBtn.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const parentEl = event.target.closest(".image");
      const imgEl = parentEl.querySelector("img");
      console.log(imgEl.alt);
      downloadImg(imgEl.src, imgEl.alt);
    });
  });
};
