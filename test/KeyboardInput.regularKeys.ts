import 'mocha';
import {assert} from 'chai';
import {KeyboardInput} from "../src/KeyboardInput";

const keys = ["A", "a", "Tab", " ", "ą", "!", "7", "Insert"];

function keysCase(description: string, callback: { (key: string): void }): void {
	describe(description, () => {
		keys.forEach(key => {
			it(`Key "${key}"`, () => callback(key));
		});
	});
}

describe(`Regular keys`, () => {
	describe('isKeyDown', () => {
		keysCase('Returns true when key was pressed and not released in this frame', (key) => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keydown', {key: key}));

			assert.equal(input.isKeyDown(key), true);
		});
		keysCase('Returns true when key was pressed and released in this frame', (key) => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keydown', {key: key}));
			input.handleEvent(new KeyboardEvent('keyup', {key: key}));

			assert.equal(input.isKeyDown(key), true);
		});
		keysCase('Returns true when key was pressed but not released in the previous frame', (key) => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keydown', {key: key}));
			input.update();

			assert.equal(input.isKeyDown(key), true);
		});

		keysCase('Returns false when key was pressed and released in the previous frame', (key) => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keydown', {key: key}));
			input.handleEvent(new KeyboardEvent('keyup', {key: key}));
			input.update();

			assert.equal(input.isKeyDown(key), false);
		});

		keysCase('Returns false when key was pressed in the previous frame and released in this frame', (key) => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keydown', {key: key}));
			input.update();
			input.handleEvent(new KeyboardEvent('keyup', {key: key}));

			assert.equal(input.isKeyDown(key), false);
		});
	});

	describe('isKeyPressed', () => {
		keysCase('Returns true when key was pressed this frame', (key) => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keydown', {key: key}));

			assert.equal(input.isKeyPressed(key), true);
		});

		keysCase('Returns true when key was pressed and released this frame', (key) => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keydown', {key: key}));
			input.handleEvent(new KeyboardEvent('keyup', {key: key}));

			assert.equal(input.isKeyPressed(key), true);
		});

		keysCase('Returns false when key was pressed last frame', (key) => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keydown', {key: key}));
			input.update();

			assert.equal(input.isKeyPressed(key), false);
		});
	});

	describe('isKeyReleased', () => {
		keysCase('Returns false when key was pressed and not released this frame', (key) => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keydown', {key: key}));

			assert.equal(input.isKeyReleased(key), false);
		});

		keysCase('Returns true when key was released this frame', (key) => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keyup', {key: key}));

			assert.equal(input.isKeyReleased(key), true);
		});

		keysCase('Returns false when key was released last frame', (key) => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keyup', {key: key}));
			input.update();

			assert.equal(input.isKeyReleased(key), false);
		});
	});

	describe('lastKeyPressed', () => {
		keysCase('Returns the last pressed key', (key) => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keydown', {key: key}));

			assert.equal(input.lastKeyPressed, key);
		});

		it("doesn't register last key press on release event", () => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keyup', {key: "a"}));

			assert.equal(input.lastKeyPressed, "");
		});

		it("doesn't clear last key pressed on update", () => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keydown', {key: "a"}));
			input.update();

			assert.equal(input.lastKeyPressed, "a");
		});
	});

	describe('isAnyKeyDown', () => {
		it('Returns true when key was pressed and not released this frame', () => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keydown', {key: "a"}));

			assert.equal(input.isAnyKeyDown, true);
		});

		it('Returns true when key was pressed and not released last frame', () => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keydown', {key: "a"}));
			input.update();

			assert.equal(input.isAnyKeyDown, true);
		});

		it('Returns true when key was pressed and released this frame', () => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keydown', {key: "a"}));
			input.handleEvent(new KeyboardEvent('keyup', {key: "a"}));

			assert.equal(input.isAnyKeyDown, true);
		});

		it('Returns false when key was pressed and released last frame', () => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keydown', {key: "a"}));
			input.handleEvent(new KeyboardEvent('keyup', {key: "a"}));
			input.update();

			assert.equal(input.isAnyKeyDown, false);
		});

		it('Returns false when key was pressed last frame and released this frame', () => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keydown', {key: "a"}));
			input.update();
			input.handleEvent(new KeyboardEvent('keyup', {key: "a"}));

			assert.equal(input.isAnyKeyDown, false);
		});
	});

	describe('isAnyKeyPressed', () => {
		it('Returns true when key was pressed and not released this frame', () => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keydown', {key: "a"}));

			assert.equal(input.isAnyKeyPressed, true);
		});

		it('Returns false when key was pressed and not released last frame', () => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keydown', {key: "a"}));
			input.update();

			assert.equal(input.isAnyKeyPressed, false);
		});

		it('Returns true when key was pressed and released this frame', () => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keydown', {key: "a"}));
			input.handleEvent(new KeyboardEvent('keyup', {key: "a"}));

			assert.equal(input.isAnyKeyPressed, true);
		});

		it('Returns false when key was pressed and released last frame', () => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keydown', {key: "a"}));
			input.handleEvent(new KeyboardEvent('keyup', {key: "a"}));
			input.update();

			assert.equal(input.isAnyKeyPressed, false);
		});

		it('Returns false when key was pressed last frame and released this frame', () => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keydown', {key: "a"}));
			input.update();
			input.handleEvent(new KeyboardEvent('keyup', {key: "a"}));

			assert.equal(input.isAnyKeyPressed, false);
		});
	});

	describe('isAnyKeyReleased', () => {
		it('Returns false when key was pressed and not released this frame', () => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keydown', {key: "a"}));

			assert.equal(input.isAnyKeyReleased, false);
		});

		it('Returns false when key was pressed and not released last frame', () => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keydown', {key: "a"}));
			input.update();

			assert.equal(input.isAnyKeyReleased, false);
		});

		it('Returns true when key was pressed and released this frame', () => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keydown', {key: "a"}));
			input.handleEvent(new KeyboardEvent('keyup', {key: "a"}));

			assert.equal(input.isAnyKeyReleased, true);
		});

		it('Returns false when key was pressed and released last frame', () => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keydown', {key: "a"}));
			input.handleEvent(new KeyboardEvent('keyup', {key: "a"}));
			input.update();

			assert.equal(input.isAnyKeyReleased, false);
		});

		it('Returns true when key was pressed last frame and released this frame', () => {
			const input = new KeyboardInput();
			input.handleEvent(new KeyboardEvent('keydown', {key: "a"}));
			input.update();
			input.handleEvent(new KeyboardEvent('keyup', {key: "a"}));

			assert.equal(input.isAnyKeyReleased, true);
		});
	});
});
