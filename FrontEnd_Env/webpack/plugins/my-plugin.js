class MyPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('My Plugin', stats => {
      console.log('My Plugin Done');
    });
  }
}

module.exports = MyPlugin;
