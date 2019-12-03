# Evidently Input

[![Build Status](https://travis-ci.com/EvidentlyCube/evidently-input.svg?branch=master)](https://travis-ci.com/EvidentlyCube/evidently-input)

A set of classes to make it easier and simpler to work with input (Mouse/Keyboard) in your games.

## Getting Started

The full documentation can be found [here](https://evidentlycube.github.io/evidently-input/). 

### Installing

Add it to your project via:

```
npm i --save evidently-input
```

### Documentation

The simplest way to use this library is as follows:

1. Create a new instance of `MouseInput`/`KeyboardInput`.
2. Call `registerListeners()` passing `document` to it, to register the necessary listeners.
3. At the end of every frame call `update()`, it must be done after you've done using the input methods.
4. Where needed call the appropriate methods (eg. `keyboardInput.isKeyDown()-`).

An example code:

```js
const mouseInput = new MouseInput();
const keyboardInput = new KeyboardInput();

// Registers necessary event listeners on the document
mouseInput.registerListeners(document);
keyboardInput.registerListeners(document);

setInterval(() => {
    console.log(mouseInput.localX, mouseInput.localY, keyboardInput.isKeyDown(' '));
    
    // This has to run every frame after you've done processing it, so ideally at the end.
    mouseInput.update();
    keyboardInput.update();
}, 1000/60);
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Links

 * [NPM](https://www.npmjs.com/package/evidently-input)
 * [Travis-ci](https://travis-ci.com/EvidentlyCube/evidently-input)