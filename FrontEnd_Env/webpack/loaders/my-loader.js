module.exports = function myLoader(content) {
  console.log('run my-loader');

  return content.replace('console.log(', 'alert(');
};
