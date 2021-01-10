### 객체를 탐색하는 방법

- `for ... in` 사용

```jsx
const obj = {
  name: 'kwon',
  age: 26,
  job: 'developer',
};

for (const key in obj) {
  console.log(`key: ${key}, value: ${obj[key]}`);
}
```

```jsx
key: name, value: kwon
key: age, value: 26
key: job, value: developer
```

**주의할 점**

`for ... in` 을 사용할 때는 주의할 점이 있는데, 대상 객체 자신과 그 객체가 상속 받고 있는 모든 constructor의 프로토타입에 존재하는 모든 enumerable 프로퍼티들을 전부 순회한다.

아래의 예시를 보면, person 인스턴스의 key만 확인하려는 경우에도 `Person.prototype.toString` 까지 출력을 하는 것을 볼 수 있다. 이를 방지하기 위해서는 `Object.hasOwnProperty()` 를 사용할 수 있다.

```jsx
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.toString = function () {
  return `name: ${this.name}, age: ${this.age}`;
};

const person = new Person('kwon', 26);

for (const key in person) {
  console.log(`key: ${key}, value: ${person[key]}`);
}
```

```
key: name, value: kwon
key: age, value: 26
key: toString, value: function () {
  return `name: ${this.name}, age: ${this.age}`;
}
```

- `Object.prototype.hasOwnProperty()` 추가

```jsx
for (const key in person) {
  if (person.hasOwnProperty(key))
    console.log(`key: ${key}, value: ${person[key]}`);
}
```

```jsx
key: name, value: kwon
key: age, value: 26
```

- `Object.keys()` 사용

```jsx
const obj = {
  name: 'kwon',
  age: 26,
  job: 'developer',
};

Object.keys(obj).forEach(key => console.log(`key: ${key}, value: ${obj[key]}`));

console.log(Object.keys(obj));
console.log(Object.entries(obj));
```

```jsx
key: name, value: kwon
key: age, value: 26
key: job, value: developer

[ 'name', 'age', 'job' ]
[ [ 'name', 'kwon' ], [ 'age', 26 ], [ 'job', 'developer' ] ]
```

[https://im-developer.tistory.com/139](https://im-developer.tistory.com/139)

[https://webclub.tistory.com/243](https://webclub.tistory.com/243)
