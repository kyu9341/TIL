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

(() => {
  const light = new Light();
  const switchUp = new TurnOnLightCommand(light);
  const switchDown = new TurnOffLightCommand(light);

  const s = new Switch(switchUp, switchDown);

  s.flipUp();
  s.flipDown();
})();
