// ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
// ▬▬▬▬▬▬▬▬▬▬▬▬ GET Countries over API ▬▬▬▬▬▬▬▬▬▬▬▬
// ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

var data = "none";

axios.get("https://restcountries.com/v3.1/all").then((res) => {
  data = res.data;
  document.getElementById("countries").innerHTML = "";
  data.forEach((data, i) => {
    if (data.unMember == true) {
      var un = "un";
    } else {
      var un = "";
    }
    document.getElementById("countries").innerHTML += `
        <div class="country-item">
      <div class="country-item-container ${un}">
        <img src="${data.flags.png}" alt="">
  <h2>${data.name.common}</h2>
  <ul>
      <li><span>Continent: </span>${data.continents}</li>
      <li><span>Capital: </span>${data.capital}</li>
      <li><span>Population: </span>${data.population}</li>
      <li><span>UN Member: </span>${data.unMember}</li>
      <li><span>TLD: </span>${data.tld}</li>
    </ul>
  <a target="_blank" href="${data.maps.googleMaps}" class="btn btn-small btn-primary"><i class="far fa-map"></i> Google Maps</a>
      </div>
  </div>`;
  });
});

function random() {
  var randomNum = Math.round(Math.random() * data.length);
  var land = data[randomNum].name.common;
  document.getElementById("myInput").value = land;
  searchfunction();
}

// ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
// ▬▬▬▬▬▬▬▬▬▬▬▬ Top Button ▬▬▬▬▬▬▬▬▬▬▬▬
// ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

var mybutton = document.getElementById("top");

function scrollFunction() {
  if (
    document.body.scrollTop > 500 ||
    document.documentElement.scrollTop > 500
  ) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
// ▬▬▬▬▬▬▬▬▬▬▬▬ Search ▬▬▬▬▬▬▬▬▬▬▬▬
// ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

var searchel = document.getElementById("search");
var sticky = searchel.offsetTop;

function myFunction() {
  if (window.pageYOffset >= sticky) {
    searchel.classList.add("sticky");
  } else {
    searchel.classList.remove("sticky");
  }
}

function searchfunction() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  ul = document.getElementById("countries");
  li = ul.getElementsByTagName("div");
  for (i = 0; i < li.length; i++) {
    h2 = li[i].getElementsByTagName("h2")[0];
    txtValue = h2.textContent || h2.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

// ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
// ▬▬▬▬▬▬▬▬▬▬▬▬ Events ▬▬▬▬▬▬▬▬▬▬▬▬
// ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

window.onscroll = function () {
  scrollFunction();
  myFunction();
};
