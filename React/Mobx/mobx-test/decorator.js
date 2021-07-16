function decorate(target, prop) {
  Object.defineProperty(target, prop, {
    enumerable: true,
    configurable: false,
    get() {
      console.log('get', prop);
    },
    set(value) {
      console.log('set', prop, value);
    },
  });
}

class Car {
  @decorate color;
}

let car = new Car();
car.color = 'red';
car.color;

/* Result (console)
set color red
get color */
