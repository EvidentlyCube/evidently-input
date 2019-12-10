import 'mocha';
import {assert} from 'chai';
import {MouseInput} from "../src/MouseInput";

describe('MouseInput', () => {
	it('Should initialize properties', () => {
		const input = new MouseInput();

		assert.equal(input.scaleProperties.scaleX, 1);
		assert.equal(input.scaleProperties.scaleY, 1);
		assert.equal(input.scaleProperties.offsetX, 0);
		assert.equal(input.scaleProperties.offsetY, 0);

		assert.equal(input.pageY, 0);
		assert.equal(input.pageY, 0);
		assert.equal(input.localX, 0);
		assert.equal(input.localY, 0);
		assert.equal(input.scaledX, 0);
		assert.equal(input.scaledY, 0);

		assert.equal(input.isAnyMouseDown, false);
		assert.equal(input.isAnyMousePressed, false);
		assert.equal(input.isAnyMouseReleased, false);
	});

	require('./MouseInput.eventListeners');
	require('./MouseInput.mousePosition');
	require('./MouseInput.mouseButtons');

	it('Reset internal state on flush', () => {
		const inputContainer = {offsetLeft: 0, offsetTop: 0};
		const input = new MouseInput();

		input.inputContainer = inputContainer;
		input.scaleProperties.scaleX = 2;
		input.scaleProperties.scaleY = 3;
		input.scaleProperties.offsetX = 4;
		input.scaleProperties.offsetY = 5;

		input.handleEvent(new MouseEvent('mousedown', {button: 0}));
		input.handleEvent(new MouseEvent('mousedown', {button: 1}));
		input.handleEvent(new MouseEvent('mousedown', {button: 2}));
		input.handleEvent(new MouseEvent('mousemove', {screenX: 1, screenY: 2, clientX: 3, clientY: 4}));

		input.flush();

		assert.equal(input.scaleProperties.scaleX, 2);
		assert.equal(input.scaleProperties.scaleY, 3);
		assert.equal(input.scaleProperties.offsetX, 4);
		assert.equal(input.scaleProperties.offsetY, 5);

		assert.equal(input.isMouseDown(0), false);
		assert.equal(input.isMouseDown(1), false);
		assert.equal(input.isMouseDown(2), false);
		assert.equal(input.isMousePressed(0), false);
		assert.equal(input.isMousePressed(1), false);
		assert.equal(input.isMousePressed(2), false);
		assert.equal(input.isMouseReleased(0), false);
		assert.equal(input.isMouseReleased(1), false);
		assert.equal(input.isMouseReleased(2), false);
		assert.equal(input.isAnyMouseDown, false);
		assert.equal(input.isAnyMousePressed, false);
		assert.equal(input.isAnyMouseReleased, false);
		assert.equal(input.screenX, 0);
		assert.equal(input.screenY, 0);
		assert.equal(input.pageX, 0);
		assert.equal(input.pageY, 0);
		assert.equal(input.localX, 0);
		assert.equal(input.localY, 0);
		assert.equal(input.scaledX, -input.scaleProperties.offsetX);
		assert.equal(input.scaledY, -input.scaleProperties.offsetY);
		assert.equal(input.inputContainer, inputContainer);
	});
});
