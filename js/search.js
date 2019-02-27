if ((window.location.pathname == "/page/search/")) {
  var lunrIndex, allPosts;
  fetch("/js/index.json")
    .then(response => {
      return response.json();
    })
    .then(response => {
      allPosts = response;
      lunrIndex = lunr(function() {
        this.field("title", {
          boost: 10
        });
        this.field("tags", {
          boost: 5
        });

        // ref is the result item identifier (I chose the page URL)
        this.ref("uri");
        for (var i = 0; i < response.length; ++i) {
          this.add(response[i]);
        }
      });
    })
    .catch(error => {
      console.error(error);
    });

  document.getElementById("search-button").onclick = function() {
    search();
  };

  function search() {
    document.getElementById("results").innerHTML = "";
    let query = document.getElementById("search-field").value;
    let results = lunrIndex.search(query).map(result => {
      return allPosts.filter(page => {
        return page.uri === result.ref && result.score > 4;
      })[0];
    });
    let totalResults;
    results = results.filter(p => {
      if (p) {
        return true;
      }
    });
    document.createElement("h1");
    for (let i = 0; i < 20 && i < results.length; i++) {
      let header = document.createElement("h2");
      let anchor = document.createElement("a");
      anchor.setAttribute("href", results[i].uri);
      anchor.innerText = results[i].title;
      header.appendChild(anchor);
      document.getElementById("results").appendChild(header);
      document.getElementById("found").innerText = `Found ${
        results.length
      } results - showing ${i + 1}`;
    }
  }
  document
    .getElementById("search-field")
    .addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        search();
      }
    });
}
