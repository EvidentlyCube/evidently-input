import 'mocha';
import {assert} from 'chai';
import {MouseInput} from "../src/MouseInput";
import {MockDocument} from "./MockDocument";

describe(`Event listeners`, () => {
	it('register listeners to document correctly', () => {
		const fauxDocument = new MockDocument();

		const input = new MouseInput();
		input.registerListeners(fauxDocument);

		const expectedListeners: any[] = [
			['mousemove', input.handleEvent],
			['mousedown', input.handleEvent],
			['mouseup', input.handleEvent],
			['contextmenu', input.handleContextMenuEvent],
		];

		fauxDocument.$assertHasListeners(expectedListeners);
	});

	it('handleContextMenuEvent() - should invalidate the event and return false', () => {
		const fauxDocument = new MockDocument();
		const input = new MouseInput();
		input.registerListeners(fauxDocument);

		const event = new Event('contextmenu', {cancelable: true});
		const result = input.handleContextMenuEvent(event);

		assert.equal(event.defaultPrevented, true);
		assert.equal(result, false);
	});
});
