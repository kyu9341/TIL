class App {
  constructor($root) {
    this.$root = $root;

    this.render();
  }

  render() {
    this.$root.innerHTML = `<h1> Hello World! </h1>`;

    console.log('loader');
  }
}

export default App;
