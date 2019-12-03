import 'mocha';
import {assert} from 'chai';
import {MouseInput, MouseInputRelativeScaleProps} from "../src/MouseInput";

describe(`Mouse position`, () => {
	for(let i = 0; i < 10; i++) {
		const x = Math.random() * 1024 | 0;
		const y = Math.random() * 1024 | 0;

		describe(`Mouse position ${x}x${y}`, () => {
			describe('pageX/Y', () => {
				it(`mouse event should update page position from pageX/Y event if clientX/Y is available`, () => {
					const input = new MouseInput();
					const event = new MouseEvent("mouseup", {
						clientX: x * 2,
						clientY: y * 2,
					});
					(event as any).pageX = x;
					(event as any).pageY = y;

					input.handleEvent(event);

					assert.equal(input.pageX, x);
					assert.equal(input.pageY, y);
				});

				it(`mouse event should update page position from clientX/Y when pageX/Y is not set`, () => {
					const input = new MouseInput();
					const event = new MouseEvent("mouseup", {
						clientX: x,
						clientY: y,
					});

					input.handleEvent(event);

					assert.equal(input.pageX, x);
					assert.equal(input.pageY, y);
				});
			});

			describe('screenX/Y', () => {
				const x = Math.random() * 1024 | 0;
				const y = Math.random() * 1024 | 0;

				it(`mouse event should update screen position from screenX/Y`, () => {
					const input = new MouseInput();
					const event = new MouseEvent("mouseup", {
						screenX: x,
						screenY: y,
					});

					input.handleEvent(event);

					assert.equal(input.screenX, x);
					assert.equal(input.screenY, y);
				});
			});

			describe('localX/Y', () => {
				const containers: HTMLElement[] = [
					{offsetLeft: 0, offsetTop: 0},
					{offsetLeft: Math.random() * 999 | 0, offsetTop: 0},
					{offsetLeft: 0, offsetTop: Math.random() * 999 | 0},
					{offsetLeft: Math.random() * -999 | 0, offsetTop: 0},
					{offsetLeft: 0, offsetTop: Math.random() * -999 | 0},
					{offsetLeft: Math.random() * 999 | 0, offsetTop: Math.random() * 999 | 0},
					{offsetLeft: Math.random() * -999 | 0, offsetTop: Math.random() * 999 | 0},
					{offsetLeft: Math.random() * 999 | 0, offsetTop: Math.random() * -999 | 0},
					{offsetLeft: Math.random() * -999 | 0, offsetTop: Math.random() * -999 | 0},
				] as any[];

				it(`mouse event should update screen position from clientX/Y`, () => {
					const input = new MouseInput();
					const event = new MouseEvent("mouseup", {
						clientX: x,
						clientY: y,
					});

					input.handleEvent(event);

					assert.equal(input.localX, x);
					assert.equal(input.localY, y);
				});

				containers.forEach(container => {
					it(`mouse event should update screen position from pageX/Y if inputContainer is set (offsetLeft: ${container.offsetLeft}, offsetTop: ${container.offsetTop}`, () => {
						const input = new MouseInput();
						input.inputContainer = container;

						const event = new MouseEvent("mouseup", {
							clientX: x + 1,
							clientY: y + 1,
						});
						(event as any).pageX = x;
						(event as any).pageY = y;

						input.handleEvent(event);

						assert.equal(input.localX, x - container.offsetLeft);
						assert.equal(input.localY, y - container.offsetTop);
					});
				});
			});

			describe('scaleMouseX/Y', () => {
				const scaleOptions: MouseInputRelativeScaleProps[] = [
					{scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0},
					{scaleX: 1, scaleY: 1, offsetX: 10, offsetY: 13},
					{scaleX: 2, scaleY: 3, offsetX: 0, offsetY: 0},
					{scaleX: 2, scaleY: 3, offsetX: 18, offsetY: 21},
					{scaleX: 0.5, scaleY: 0.3, offsetX: -271, offsetY: -22},
				];

				scaleOptions.forEach(scale => {
					const input = new MouseInput();
					input.handleEvent(new MouseEvent('mousemove', {
						clientX: x,
						clientY: y,
					}));

					it(`should return position modified by scale props (scale=${scale.scaleX}x${scale.scaleY}, offset=${scale.offsetX}x${scale.offsetY})`, () => {
						input.scaleProperties.offsetX = scale.offsetX;
						input.scaleProperties.offsetY = scale.offsetY;
						input.scaleProperties.scaleX = scale.scaleX;
						input.scaleProperties.scaleY = scale.scaleY;

						assert.equal(input.scaledX, x / scale.scaleX - scale.offsetX);
						assert.equal(input.scaledY, y / scale.scaleY - scale.offsetY);
					});
				});
			});
		});
	}
});
