class List extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });
  listElements = [];
  listAux = [];
  start = 0;
  end = 39;
  filterOption = 2;
  searchValue;

  constructor() {
    super();

    this.shadow.appendChild(this.createHTML());
    this.createStyles("src/components/listOfArticles/list.css","https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css","src/components/listOfArticles/list-responsive.css");
    
    this.fetchAndDisplayData();
    this.addInfiniteScrollListener();
    
    const searchInput = this.shadow.querySelector("#search");
    searchInput.addEventListener("input", () => {
      const searchValue = searchInput.value.toLowerCase();
      this.searchValue = searchValue;

      this.searchWords();
    });
  }

  createHTML() {
    const template = `
 <div class="container mt-4">
        <div class="search-and-filters d-flex align-items-center mb-4">
            <div class="search-bar">
                <input type="text" id="search" class="form-control" placeholder="Search" aria-label="Search" />
            </div>
            <div class="filters ms-4 d-flex">
                <div class="form-check me-3">
                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"value="1" />
                    <label class="form-check-label" for="flexRadioDefault1">E-mail</label>
                </div>
                <div class="form-check me-3">
                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2"value="2" checked />
                    <label class="form-check-label" for="flexRadioDefault2">Título</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3"value="3" />
                    <label class="form-check-label" for="flexRadioDefault3">Descrição</label>
                </div>
            </div>
        </div>

        <div id="list" class="list-container"></div>
        <div class="messageError">
            <h3 id="messageData">Houve falha ao buscar os dados. Tente novamente mais tarde.</h3>
            <h3 id="messageSearch">Nenhum item encontrado.</h3>
        </div>
  </div>

      `;

    const componentRoot = document.createElement("div");
    componentRoot.setAttribute("class", "list-component");
    componentRoot.innerHTML = template;
    return componentRoot;
  }

  createStyles(...linksUser) {
    linksUser.forEach((e) => {
      const link = this.createLink(e);
      this.shadow.appendChild(link);
    });
  }

  createLink(linkStyle) {
    const link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", linkStyle);
    return link;
  }

  fetchAndDisplayData() {
    if (this.listElements.length !== 0) {
      return;
    }
    const listContainer = this.shadow.querySelector("#list");
    

    const radioButtons = this.shadow.querySelectorAll('input[name="flexRadioDefault"]');
    radioButtons.forEach((radio) => {
      radio.addEventListener("change", (event) => {
        this.filterOption = parseInt(event.target.value, 10);
        this.clearInput();
      });
    });

    fetch("https://jsonplaceholder.typicode.com/comments")
      .then((response) => response.json())
      .then((data) => {

        if (Object.keys(data).length === 0) {
          this.shadow.querySelector("#messageData").style.display = "flex";
          this.shadow.querySelector("#list").style.height = "0px";
          return;
        }

        this.listElements = data.map((item) => {
          item.body = item.body.replaceAll("\n", " ");
          return item;
        });

        this.insertMoreItems()
        this.listAux = this.firstLetterUpperCase(this.listAux)
        this.displayItems(this.listAux, listContainer);
      });
  }

  insertMoreItems() {
    for (let i = this.start; i <= this.end; i++) {
      this.listAux.push(this.listElements[i]);
    }

    this.start = this.end + 1;
    this.end = this.end + 40;
  }

  searchWords() {
    const listContainer = this.shadow.querySelector("#list");

    const searchValueLower = this.searchValue.toLowerCase();
    
    let filtered = this.listElements.filter((item) => {
      /*
          1 - E-mail  
          2 - Título
          3 - Descrição
      */
      if (this.filterOption === 1) {
        return item.email.toLowerCase().includes(searchValueLower)

      } else if (this.filterOption === 2) {
        return item.name.toLowerCase().includes(searchValueLower)

      } else if (this.filterOption === 3) {
        return item.body.toLowerCase().includes(searchValueLower)

      }
      return false
    })
    
    filtered = this.addHighlight(filtered)

    const visibleItems = filtered.slice(0, this.start);
    this.displayItems(visibleItems, listContainer);

    this.managerOutPutSearch(visibleItems)
  }

  addHighlight(data) {
    const searchValueLower = this.searchValue.toLowerCase();
    const regex = new RegExp(`(${searchValueLower})`, 'gi');

    return data.map((item) => {
      if (this.filterOption === 1) {
        return { 
          email: item.email.replace(regex, '<span class="highlight">$1</span>'), name: item.name, body: item.body
        }
      } else if (this.filterOption === 2) {
        return { 
          email: item.email, name: item.name.replace(regex, '<span class="highlight">$1</span>'), body: item.body
        }
      } else if (this.filterOption === 3) {
        return { 
          email: item.email, name: item.name, body: item.body.replace(regex, '<span class="highlight">$1</span>')
        }
      }

    })
  }

  managerOutPutSearch(data) {
    if (data.length == 0) {
      this.shadow.querySelector("#messageSearch").style.display = "flex";
      this.shadow.querySelector("#list").style.height = "0px";

    } else {
      this.shadow.querySelector("#messageSearch").style.display = "none";
      this.shadow.querySelector("#list").style.height = "400px";

    }
  }


  clearInput(){
    this.shadow.querySelector("#search").value = ""
    this.searchValue = ""
    this.searchWords()
  }

  firstLetterUpperCase(data) {

    const filtered = data.map((item) => {
      item.email = item.email;
      item.name = String(item.name).charAt(0).toUpperCase() + String(item.name).toLowerCase().slice(1);
      item.body = String(item.body).charAt(0).toUpperCase() + String(item.body).toLowerCase().slice(1);
      return item;
    });
    
    return filtered;
  
  }

  displayItems(items, container) {
    container.innerHTML = "";

    items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card";

      const cardBody = document.createElement("div");
      cardBody.className = "card-body";

      const email = document.createElement("h6");
      email.className = "card-subtitle mb-2 text-muted";
      email.innerHTML = item.email

      const name = document.createElement("h5");
      name.className = "card-title";
      name.innerHTML = item.name;

      const body = document.createElement("p");
      body.className = "card-text";
      body.innerHTML = item.body;

      cardBody.appendChild(email);
      cardBody.appendChild(name);
      cardBody.appendChild(body);
      card.appendChild(cardBody);
      container.appendChild(card);

    });
  }

  addInfiniteScrollListener() {
    const wrap = this.shadow.querySelector("#list");

    wrap.addEventListener("scroll", () => {
      if (wrap.scrollTop + wrap.clientHeight >= wrap.scrollHeight - 10) {
        if (this.listAux.length > 500) {
          return;
        }
        this.insertMoreItems();

        const listContainer = this.shadow.querySelector("#list");
        const filtered = this.firstLetterUpperCase(this.listAux);

        this.displayItems(filtered, listContainer);
        this.searchWords();
      }
    });
  }
}

customElements.define("list-component", List);
