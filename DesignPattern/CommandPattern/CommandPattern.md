# `Command Pattern` (커맨드 패턴)

`CommandPattern`도 `StrategyPattern`과 유사하지만 근본적인 차이는, 전략 패턴은 같은 일을 하되 그 알고리즘이나 방식이 갈아끼워지는 것이라면 커맨드 패턴은 그 하는 일 자체가 다른거라고 생각하면 된다.

커맨드 패턴은 객체의 행위 또는 기능(메서드)을 클래스로 만들어 캡슐화하는 패턴을 말한다. 이를 통해 기능의 실행을 요구하는 호출자(`Invoker`) 클래스와 실제 기능을 실행하는 수신자(`Receiver`) 클래스 사이의 의존성을 제거한다.

![CommandPattern](https://user-images.githubusercontent.com/49153756/116061814-42d22f00-a6be-11eb-83c5-ec5a0ca47b17.png)

> 출처 : [위키백과](https://ko.wikipedia.org/wiki/%EC%BB%A4%EB%A7%A8%EB%93%9C_%ED%8C%A8%ED%84%B4)

커맨드 패턴에는 명령(`Command`), 수신자(`Receiver`), 호출자(`Invoker`), 클라이언트(`Client`)의 개념이 존재한다. `Command` 객체는 `Receiver` 객체를 가지고 있으며, `Receiver`의 메서드를 호출하고, `Receiver`는 자신에게 정의된 메서드를 수행한다. `Command` 객체는 별도로 `Invoker` 객체에 전달되어 명령을 수행한다. `Client`는 `Invoker` 객체와 하나 이상의 `Command` 객체를 보유하고, 어느 시점에서 명령을 수행할지 결정한다. 명령을 수행하려면 `Client` 는 `Invoker` 객체로 `Command` 객체를 전달한다.

위키백과의 예제를 `TypeScript`로 구현해보았다.

- `Invoker` , `Receiver`

```tsx
/* Invoker */
class Switch {
  flipUpCommand: Command;
  flipDownCommand: Command;

  constructor(flipUpCommand: Command, flipDownCommand: Command) {
    this.flipUpCommand = flipUpCommand;
    this.flipDownCommand = flipDownCommand;
  }

  flipUp() {
    this.flipUpCommand.execute();
  }

  flipDown() {
    this.flipDownCommand.execute();
  }
}

/* Receiver */
class Light {
  turnOn() {
    console.log('The light is on');
  }

  turnOff() {
    console.log('The light is off');
  }
}
```

`Invoker`인 `Switch` `class`와 `Receiver`인 `Light` `class`로 스위치를 누르면 불이 켜지는 동작을 구현한다. 위와 같이 `Command`는 `Invoker`객체에 전달되어 명령을 수행하게 된다.

- `Command`

```tsx
interface Command {
  execute(): void;
}

class TurnOnLightCommand implements Command {
  light: Light;
  constructor(light: Light) {
    this.light = light;
  }

  execute() {
    this.light.turnOn();
  }
}

class TurnOffLightCommand implements Command {
  light: Light;

  constructor(light: Light) {
    this.light = light;
  }

  execute() {
    this.light.turnOff();
  }
}
```

`Command` 객체는 `Receiver` 인 `light`를 가지고 `light`의 메서드인 `turnOn`, `turnOff`를 호출한다.

- `Client`

```tsx
(() => {
  const light = new Light();
  const switchUp = new TurnOnLightCommand(light);
  const switchDown = new TurnOffLightCommand(light);

  const s = new Switch(switchUp, switchDown);

  s.flipUp();
  s.flipDown();
})();
```

`Receiver`를 생성하여 `Receiver`를 가지는 `Command` 객체를 생성하고 `Invoker` 객체에 `Command` 객체를 전달한다.

만약 `Switch`에서 `Light` 를 직접 켜고 끄는 동작을 구현한다면, 기능을 수정하거나 새로운 기능이 추가되는 경우 `Switch` 클래스를 매번 수정해야 한다.

위와 같이 커맨드 패턴을 적용하면 실행될 기능(`Command`)를 캡슐화하여 `Switch`와 `Light` 사이의 의존성을 제거하고 기능이 변경되더라도 `Switch` 클래스를 수정하지 않고 재사용 할 수 있다.

---

> 참고
>
> [https://ko.wikipedia.org/wiki/커맨드\_패턴](https://ko.wikipedia.org/wiki/%EC%BB%A4%EB%A7%A8%EB%93%9C_%ED%8C%A8%ED%84%B4)
>
> [https://gmlwjd9405.github.io/2018/07/07/command-pattern.html](https://gmlwjd9405.github.io/2018/07/07/command-pattern.html)
>
> [https://www.yalco.kr/29_oodp_1/](https://www.yalco.kr/29_oodp_1/)
>
> [https://victorydntmd.tistory.com/295?category=719467](https://victorydntmd.tistory.com/295?category=719467)
>
> [http://minsone.github.io/programming/designpattern-command](http://minsone.github.io/programming/designpattern-command)
