import 'mocha';
import {assert} from 'chai';
import {MouseInput} from "../src/MouseInput";

const buttons = [0, 1, 2];

function buttonsCase(description: string, callback: { (button: number): void }): void {
	describe(description, () => {
		buttons.forEach(button => {
			it(`Button #${button}`, () => callback(button));
		});
	});
}

describe(`Mouse buttons`, () => {
	describe('isMouseDown', () => {
		buttonsCase('Returns true when mouse was pressed and not released in this frame', (mouse) => {
			const input = new MouseInput();
			input.handleEvent(new MouseEvent('mousedown', {button: mouse}));

			assert.equal(input.isMouseDown(mouse), true);
		});
		buttonsCase('Returns true when mouse was pressed and released in this frame', (mouse) => {
			const input = new MouseInput();
			input.handleEvent(new MouseEvent('mousedown', {button: mouse}));
			input.handleEvent(new MouseEvent('mouseup', {button: mouse}));

			assert.equal(input.isMouseDown(mouse), true);
		});
		buttonsCase('Returns true when mouse was pressed but not released in the previous frame', (mouse) => {
			const input = new MouseInput();
			input.handleEvent(new MouseEvent('mousedown', {button: mouse}));
			input.update();

			assert.equal(input.isMouseDown(mouse), true);
		});

		buttonsCase('Returns false when mouse was pressed and released in the previous frame', (mouse) => {
			const input = new MouseInput();
			input.handleEvent(new MouseEvent('mousedown', {button: mouse}));
			input.handleEvent(new MouseEvent('mouseup', {button: mouse}));
			input.update();

			assert.equal(input.isMouseDown(mouse), false);
		});

		buttonsCase('Returns false when mouse was pressed in the previous frame and released in this frame', (mouse) => {
			const input = new MouseInput();
			input.handleEvent(new MouseEvent('mousedown', {button: mouse}));
			input.update();
			input.handleEvent(new MouseEvent('mouseup', {button: mouse}));

			assert.equal(input.isMouseDown(mouse), false);
		});
	});

	describe('isMousePressed', () => {
		buttonsCase('Returns true when mouse was pressed this frame', (mouse) => {
			const input = new MouseInput();
			input.handleEvent(new MouseEvent('mousedown', {button: mouse}));

			assert.equal(input.isMousePressed(mouse), true);
		});

		buttonsCase('Returns true when mouse was pressed and released this frame', (mouse) => {
			const input = new MouseInput();
			input.handleEvent(new MouseEvent('mousedown', {button: mouse}));
			input.handleEvent(new MouseEvent('mouseup', {button: mouse}));

			assert.equal(input.isMousePressed(mouse), true);
		});

		buttonsCase('Returns false when mouse was pressed last frame', (mouse) => {
			const input = new MouseInput();
			input.handleEvent(new MouseEvent('mousedown', {button: mouse}));
			input.update();

			assert.equal(input.isMousePressed(mouse), false);
		});
	});

	describe('isMouseReleased', () => {
		buttonsCase('Returns false when mouse was pressed and not released this frame', (mouse) => {
			const input = new MouseInput();
			input.handleEvent(new MouseEvent('mousedown', {button: mouse}));

			assert.equal(input.isMouseReleased(mouse), false);
		});

		buttonsCase('Returns true when mouse was released this frame', (mouse) => {
			const input = new MouseInput();
			input.handleEvent(new MouseEvent('mouseup', {button: mouse}));

			assert.equal(input.isMouseReleased(mouse), true);
		});

		buttonsCase('Returns false when mouse was released last frame', (mouse) => {
			const input = new MouseInput();
			input.handleEvent(new MouseEvent('mouseup', {button: mouse}));
			input.update();

			assert.equal(input.isMouseReleased(mouse), false);
		});
	});

	describe('isAnyMouseDown', () => {
		it('Returns true when mouse was pressed and not released this frame', () => {
			const input = new MouseInput();
			input.handleEvent(new MouseEvent('mousedown', {button: 0}));

			assert.equal(input.isAnyMouseDown, true);
		});

		it('Returns true when mouse was pressed and not released last frame', () => {
			const input = new MouseInput();
			input.handleEvent(new MouseEvent('mousedown', {button: 0}));
			input.update();

			assert.equal(input.isAnyMouseDown, true);
		});

		it('Returns true when mouse was pressed and released this frame', () => {
			const input = new MouseInput();
			input.handleEvent(new MouseEvent('mousedown', {button: 0}));
			input.handleEvent(new MouseEvent('mouseup', {button: 0}));

			assert.equal(input.isAnyMouseDown, true);
		});

		it('Returns false when mouse was pressed and released last frame', () => {
			const input = new MouseInput();
			input.handleEvent(new MouseEvent('mousedown', {button: 0}));
			input.handleEvent(new MouseEvent('mouseup', {button: 0}));
			input.update();

			assert.equal(input.isAnyMouseDown, false);
		});

		it('Returns false when mouse was pressed last frame and released this frame', () => {
			const input = new MouseInput();
			input.handleEvent(new MouseEvent('mousedown', {button: 0}));
			input.update();
			input.handleEvent(new MouseEvent('mouseup', {button: 0}));

			assert.equal(input.isAnyMouseDown, false);
		});
	});

	describe('isAnyMousePressed', () => {
		it('Returns true when mouse was pressed and not released this frame', () => {
			const input = new MouseInput();
			input.handleEvent(new MouseEvent('mousedown', {button: 0}));

			assert.equal(input.isAnyMousePressed, true);
		});

		it('Returns false when mouse was pressed and not released last frame', () => {
			const input = new MouseInput();
			input.handleEvent(new MouseEvent('mousedown', {button: 0}));
			input.update();

			assert.equal(input.isAnyMousePressed, false);
		});

		it('Returns true when mouse was pressed and released this frame', () => {
			const input = new MouseInput();
			input.handleEvent(new MouseEvent('mousedown', {button: 0}));
			input.handleEvent(new MouseEvent('mouseup', {button: 0}));

			assert.equal(input.isAnyMousePressed, true);
		});

		it('Returns false when mouse was pressed and released last frame', () => {
			const input = new MouseInput();
			input.handleEvent(new MouseEvent('mousedown', {button: 0}));
			input.handleEvent(new MouseEvent('mouseup', {button: 0}));
			input.update();

			assert.equal(input.isAnyMousePressed, false);
		});

		it('Returns false when mouse was pressed last frame and released this frame', () => {
			const input = new MouseInput();
			input.handleEvent(new MouseEvent('mousedown', {button: 0}));
			input.update();
			input.handleEvent(new MouseEvent('mouseup', {button: 0}));

			assert.equal(input.isAnyMousePressed, false);
		});
	});

	describe('isAnyMouseReleased', () => {
		it('Returns false when mouse was pressed and not released this frame', () => {
			const input = new MouseInput();
			input.handleEvent(new MouseEvent('mousedown', {button: 0}));

			assert.equal(input.isAnyMouseReleased, false);
		});

		it('Returns false when mouse was pressed and not released last frame', () => {
			const input = new MouseInput();
			input.handleEvent(new MouseEvent('mousedown', {button: 0}));
			input.update();

			assert.equal(input.isAnyMouseReleased, false);
		});

		it('Returns true when mouse was pressed and released this frame', () => {
			const input = new MouseInput();
			input.handleEvent(new MouseEvent('mousedown', {button: 0}));
			input.handleEvent(new MouseEvent('mouseup', {button: 0}));

			assert.equal(input.isAnyMouseReleased, true);
		});

		it('Returns false when mouse was pressed and released last frame', () => {
			const input = new MouseInput();
			input.handleEvent(new MouseEvent('mousedown', {button: 0}));
			input.handleEvent(new MouseEvent('mouseup', {button: 0}));
			input.update();

			assert.equal(input.isAnyMouseReleased, false);
		});

		it('Returns true when mouse was pressed last frame and released this frame', () => {
			const input = new MouseInput();
			input.handleEvent(new MouseEvent('mousedown', {button: 0}));
			input.update();
			input.handleEvent(new MouseEvent('mouseup', {button: 0}));

			assert.equal(input.isAnyMouseReleased, true);
		});
	});
});
