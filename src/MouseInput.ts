export interface MouseInputRelativeScaleProps {
	scaleX: number;
	scaleY: number;
	offsetX: number;
	offsetY: number;
}

export interface InputRelativeContainer {
	readonly offsetLeft: number;
	readonly offsetTop: number;
}

export enum MouseButtons {
	Left = 0,
	Middle = 1,
	Right = 2
}

/**
 * Handles the mouse events and provdes an API for interacting with it easily. The simplest way to use it is:
 *
 * 1. Create a new instance of `MouseInput`.
 * 2. Call `registerListeners()` passing the `document`.
 * 3. Call `update` **at the end** of every update frame of your game.
 * 4. Use the functions of this library in your code.
 *
 * ### Different mouse positions
 *
 *  * `screen` is the position of the mouse in the whole screen.
 *  * `page` is the position of the mouse inside the loaded webpage.
 *  * `local` is the position of the mouse relative to the `inputContainer` if defined, or to the element passed to `registerListeners`.
 *  * `scaled` is the position of the mouse inside the game, which is `local` modified by `scaleProperties`. It is mostly useful in games
 *    that scale up when their workspace is enlarged, as opposed to games that just reorganize their content and allow seeing more
 *    space inside.
 *
 * In order to get the proper values for `local` it is recommended to set `inputContainer` to the canvas element used to render the game.
 *
 * ### Scaled mouse position
 *
 * In order to get the proper values for `scaled` you need to keep the `scaleProperties` in sync with the modifications you do to the rendering of the game.
 * For example, a typical game imitating 8-bit aesthetics would likely have its own internal resolution and then would scale that up, maybe pixel-perfect
 * or maybe not. For example: a game in resolution `320x240` scaled up proportionally to resolution `1920x1080`:
 *
 *  * It would scale `4.5` times, to `1440x1080.`
 *  * It would be horizontally centered, so offset in `X` by `240px` ( `(1920 - 1440) / 2` )
 *  * So the `scaleProperties` would be `{scaleX: 4.5, scaleY: 4.5, offsetX: 240, offsetY: 0}
 *
 * With these values scaledX/Y will return the proper position of the mouse in the stage.
 *
 * ### How does it work:
 *
 * See [[KeyboardInput]] for details.
 *
 * ### Understanding mouse button states
 *
 * Down, pressed and released for the mouse buttons work exactly the same as the keys in [[KeyboardInput]], please refer to its documentation.
 */
export class MouseInput {
	private _localX: number;
	private _localY: number;
	private _pageX: number;
	private _pageY: number;
	private _screenX: number;
	private _screenY: number;

	private _mouseButtonsDown: number[];
	private _mouseButtonsPressed: number[];
	private _mouseButtonsReleased: number[];

	public inputContainer?: InputRelativeContainer;
	public readonly scaleProperties: MouseInputRelativeScaleProps;

	public get pageX(): number {
		return this._pageX;
	}

	public get pageY(): number {
		return this._pageY;
	}

	public get localX(): number {
		return this._localX;
	}

	public get localY(): number {
		return this._localY;
	}

	public get screenX(): number {
		return this._screenX;
	}

	public get screenY(): number {
		return this._screenY;
	}

	public get scaledX(): number {
		return this.localX / this.scaleProperties.scaleX - this.scaleProperties.offsetX;
	}

	public get scaledY(): number {
		return this.localY / this.scaleProperties.scaleY - this.scaleProperties.offsetY;
	}

	public get isAnyMouseDown(): boolean {
		return this.isAnyMousePressed || this._mouseButtonsDown.length > 0;
	}

	public get isAnyMousePressed(): boolean {
		return this._mouseButtonsPressed.length > 0;
	}

	public get isAnyMouseReleased(): boolean {
		return this._mouseButtonsReleased.length > 0;
	}

	public isMouseDown = (button: number|MouseButtons): boolean => this._mouseButtonsDown.indexOf(button) !== -1 || this.isMousePressed(button);
	public isMousePressed = (button: number|MouseButtons): boolean => this._mouseButtonsPressed.indexOf(button) !== -1;
	public isMouseReleased = (button: number|MouseButtons): boolean => this._mouseButtonsReleased.indexOf(button) !== -1;

	constructor() {
		this._pageX = 0;
		this._pageY = 0;
		this._localX = 0;
		this._localY = 0;

		this._mouseButtonsDown = [];
		this._mouseButtonsReleased = [];
		this._mouseButtonsPressed = [];

		this.scaleProperties = {
			scaleX: 1,
			scaleY: 1,
			offsetX: 0,
			offsetY: 0,
		};
	}

	/**
	 * Updates the internal state, should be called at the end of each frame.
	 */
	public update = (): void => {
		this._mouseButtonsReleased.length = 0;
		this._mouseButtonsPressed.length = 0;
	};

	/**
	 * Resets the internal state of this class to what it is during creation - nothing pressed, released or held down, positions reset.
	 * This won't affect `scaleProperties` and `inputContainer`.
	 */
	public flush = (): void => {
		this._mouseButtonsDown.length = 0;
		this._mouseButtonsPressed.length = 0;
		this._mouseButtonsReleased.length = 0;
		this._pageX = 0;
		this._pageY = 0;
		this._localX = 0;
		this._localY = 0;
		this._screenX = 0;
		this._screenY = 0;
	};

	/**
	 * Registers the `mousemove`, `mosedown` and `mouseup` listeners on the passed element so that the class
	 * can handle the input.
	 *
	 * @param {HTMLElement} element To avoid issues with focus it's best to pass `document` here
	 */
	public registerListeners(element: HTMLElement): void {
		element.addEventListener("mousedown", this.handleEvent);
		element.addEventListener("mouseup", this.handleEvent);
		element.addEventListener("mousemove", this.handleEvent);
	}

	/**
	 * Handles a mouse event updating the internal status. This will be called automatically if you register the listeners
	 * via `registerListeners`. If you have listeners being registered somewhere else entirely and would like to keep it
	 * that way, you can manually call this method passing the MouseEvent/PointerEvent.
	 *
	 * @param {MouseEvent | PointerEvent} event
	 */
	public handleEvent = (event: MouseEvent | PointerEvent): void => {
		this._pageX = event.pageX ?? event.clientX;
		this._pageY = event.pageY ?? event.clientY;
		this._screenX = event.screenX;
		this._screenY = event.screenY;
		this._localX = this.inputContainer ? event.pageX - this.inputContainer.offsetLeft : event.clientX;
		this._localY = this.inputContainer ? event.pageY - this.inputContainer.offsetTop : event.clientY;

		if (event.type === 'mouseup' || event.type === 'pointerup') {
			this._mouseButtonsDown = this._mouseButtonsDown.filter(button => button !== event.button);
			this._mouseButtonsReleased.push(event.button);

		} else if (event.type === 'mousedown' || event.type === 'pointerup') {
			this._mouseButtonsDown.push(event.button);
			this._mouseButtonsPressed.push(event.button);
		}
	};
}