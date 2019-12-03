import 'mocha';
import {assert} from 'chai';
import {KeyboardInput} from "../src/KeyboardInput";

describe('KeyboardInput', () => {
	it('Should initialize properties', () => {
		const input = new KeyboardInput();

		assert.equal(input.isCtrlDown, false);
		assert.equal(input.isAltDown, false);
		assert.equal(input.isShiftDown, false);

		assert.equal(input.isAnyKeyDown, false);
		assert.equal(input.isAnyKeyPressed, false);
		assert.equal(input.isAnyKeyReleased, false);
	});

	it('Should register events to document correctly', () => {
		const fauxDocument = {
			events: new Array<[string, (...rest: any[]) => any]>(),
			addEventListener: function(event: string, listener: (...rest: any[]) => any) {
				this.events.push([event, listener]);
			},
		};

		const input = new KeyboardInput();
		input.registerListeners(fauxDocument as any);

		const expectedListeners = [
			['keydown', input.handleEvent],
			['keyup', input.handleEvent],
		];

		assert.lengthOf(fauxDocument.events, expectedListeners.length);
		expectedListeners.forEach(expected => {
			const given = fauxDocument.events.find(x => x[0] === expected[0]);

			if (!given) {
				assert.fail(`No listener registered for event ${expected[0]}`);
			}

			assert.equal(given[1], expected[1], `Wrong listener registered for event ${expected[0]}`);
		});
	});

	require('./KeyboardInput.modifierKeys');
	require('./KeyboardInput.regularKeys');

	it('Reset everything on flush', () => {
		const input = new KeyboardInput();
		input.handleEvent(new KeyboardEvent('keydown', {key: 'a'}));
		input.handleEvent(new KeyboardEvent('keydown', {key: 'b'}));
		input.handleEvent(new KeyboardEvent('keyup', {key: 'b'}));
		input.handleEvent(new KeyboardEvent('keyup', {key: 'c'}));

		input.handleEvent(new KeyboardEvent('keydown', {altKey: true, ctrlKey: true, shiftKey: true}));

		input.flush();

		assert.equal(input.isCtrlDown, false);
		assert.equal(input.isShiftDown, false);
		assert.equal(input.isAltDown, false);
		assert.equal(input.isAnyKeyDown, false);
		assert.equal(input.isAnyKeyReleased, false);
		assert.equal(input.isAnyKeyPressed, false);
		assert.equal(input.isKeyDown('a'), false);
		assert.equal(input.isKeyDown('b'), false);
		assert.equal(input.isKeyDown('c'), false);
		assert.equal(input.isKeyPressed('a'), false);
		assert.equal(input.isKeyPressed('b'), false);
		assert.equal(input.isKeyPressed('c'), false);
		assert.equal(input.isKeyReleased('a'), false);
		assert.equal(input.isKeyReleased('b'), false);
		assert.equal(input.isKeyReleased('c'), false);
		assert.equal(input.lastKeyPressed, "");
	});
});
