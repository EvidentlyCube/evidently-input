import 'mocha';
import {assert} from 'chai';
import {KeyboardInput} from "../src/KeyboardInput";

type MouseKeyboardEventProps = keyof MouseEvent & keyof KeyboardEvent;

describe(`Modifier keys`, () => {
	const keyType: [MouseKeyboardEventProps, keyof KeyboardInput][] = [
		['altKey', 'isAltDown'],
		['ctrlKey', 'isCtrlDown'],
		['shiftKey', 'isShiftDown'],
	];

	keyType.forEach(([eventKey, inputGetter]) => {
		describe(inputGetter, () => {
			it(`Should return true when key was down via KeyboardEvent since last update`, () => {
				const input = new KeyboardInput();
				input.handleEvent(new KeyboardEvent('', {[eventKey]: true}));

				assert.equal(input[inputGetter], true);
			});

			it(`Should return true when key was down and then up via KeyboardEvent inside a single update`, () => {
				const input = new KeyboardInput();
				input.handleEvent(new KeyboardEvent('', {[eventKey]: true}));
				input.handleEvent(new KeyboardEvent('', {[eventKey]: false}));

				assert.equal(input[inputGetter], true);
			});

			it(`Should return false when key was down and then up via KeyboardEvent inside a single update, after the update`, () => {
				const input = new KeyboardInput();
				input.handleEvent(new KeyboardEvent('', {[eventKey]: true}));
				input.handleEvent(new KeyboardEvent('', {[eventKey]: false}));

				input.update();

				assert.equal(input[inputGetter], false);
			});
		});
	});
});
