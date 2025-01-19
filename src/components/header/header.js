class Header extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });

  constructor() {
    super();

    this.shadow.appendChild(this.createHTML());
    this.createStyles(
      "src/components/header/header.css",
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css"
    );
  }

  createHTML() {
    const template = `
       <div class="container mt-4">
  <header class="text-center mb-4">
    <img
      src="src/assets/images/image_logo.png"
      alt="Logomarca"
      class="img-fluid mb-3"
      style="max-width: 250px; height: 100px; max-width: 200px"
    />
    <h1 class="h5">Sistema de Gestão de Acervo Acadêmico</h1>
  </header>
  </div class="container mt-4">
        `;

    const componentRoot = document.createElement("div");
    componentRoot.setAttribute("class", "header-component");
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
}

customElements.define("header-component", Header);
