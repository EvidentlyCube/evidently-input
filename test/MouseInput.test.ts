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

		assert.equal(input.pageMouseX, 0);
		assert.equal(input.pageMouseY, 0);
		assert.equal(input.localMouseX, 0);
		assert.equal(input.localMouseY, 0);
		assert.equal(input.scaledMouseX, 0);
		assert.equal(input.scaledMouseY, 0);

		assert.equal(input.isAnyMouseDown, false);
		assert.equal(input.isAnyMousePressed, false);
		assert.equal(input.isAnyMouseReleased, false);
	});

	it('Should register events to document correctly', () => {
		const fauxDocument = {
			events: new Array<[string, (...rest: any[]) => any]>(),
			addEventListener: function(event: string, listener: (...rest: any[]) => any) {
				this.events.push([event, listener]);
			},
		};

		const input = new MouseInput();
		input.registerEventsInDocument(fauxDocument as any);

		const expectedListeners = [
			['mousemove', input.handleEvent],
			['mousedown', input.handleEvent],
			['mouseup', input.handleEvent],
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

	require('./MouseInput.mousePosition');
	require('./MouseInput.mouseButtons');
});
