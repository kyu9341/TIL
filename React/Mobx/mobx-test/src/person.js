function readOnly(target, property, descriptor) {
  descriptor.writable = false;
  return descriptor;
}

function log(target, property, descriptor) {
  return {
    get: function () {
      console.log('getting', this.value);

      return this.value;
    },
    set(value) {
      console.log('setting', value);

      this.value = value;
    },
  };
}

class Person {
  @log name;
  @log age;

  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  @log
  logInfo() {
    const infoString = Object.keys(this)
      .map(key => `${key} : ${this[key]}`)
      .join(' | ');

    console.log(infoString);
  }
}

const person = new Person('kim', 25);
person.name = 'jo';
person.age;
