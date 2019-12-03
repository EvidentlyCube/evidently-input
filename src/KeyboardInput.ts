/**
 * Handles the keyboard events and provides an API for interacting with it easily. The simplest way to use it is:
 *
 * 1. Create a new instance of `KeyboardInput`.
 * 2. Call `registerListeners()` passing the `document`.
 * 3. Call `update` **at the end** of every update frame of your game.
 * 4. Use the functions of this library in your code.
 *
 * ### How does it work?
 *
 * You need to call the `update()` method at the **end** of every frame to properly transition internal state.
 * The workflow for this class is as follows:
 *  1. Browser receives events from the user and fires the corresponding events.
 *  2. `KeyboardInput` receives those events and updates its internal state.
 *  3. Update loop for your game runs and you can use the methods in this class to interact.
 *  4. At the end of the your game's update loop `update()` is called on this class. (or at any point past when you know you'll interact with this class)
 *  5. Repeat
 *
 * ### Understanding key states
 *
 * There are three states recognized by this class for a key: down, pressed and released:
 *
 *  * Use `pressed` if you want to know if a key was pressed at least once this frame.
 *  * Use `released` if you want to knof iw a key was releast at least once this frame.
 *  * Use `down` if you want to know if a key was either pressed this frame or pressed in any previous frame and not released so far.
 *
 *
 *  You may notice that in a situation where during the course of a single frame a key is both pressed and released, all three states
 *  will report true. That's an intentional design decision to avoid a very uncommon but still possible bug. Imagine this code:
 *
 *  ```
 *  if (keyboardInput.isKeyDown("a")) {
 *      this.move({x: -1});
 *  }
 *  ```
 *
 *  If for some reason your game runs slow (maybe it naturally has low FPS or it's lagging at the moment), if you pressed and released the `a` key
 *  during the span of a single frame as a player you'd still expect the move to trigger - sure, you released the key but you also pressed it. The
 *  code can't use `isKeyPressed` instead, because you want the player to keep moving as long as the key is down. You could work around this by
 *  expanding the condition to `i.isKeyDown || i.isKeyPressed`, but the issues are:
 *
 *  1. You probably didn't think about this bug in the first place. Which is fine, it's extremely unlikely to ever be an issue for the vast majority
 *     of games.
 *  2. The expanded condition is less readable.
 *  3. The change on its own doesn't break anything, so you lose nothing by having it baked in the system.
 */
export class KeyboardInput {
	private _keysDown: string[];
	private _keysPressed: string[];
	private _keysReleased: string[];
	private _isCtrlDown: boolean;
	private _isShiftDown: boolean;
	private _isAltDown: boolean;
	private _wasCtrlDownThisFrame: boolean;
	private _wasShiftDownThisFrame: boolean;
	private _wasAltDownThisFrame: boolean;
	private _lastKeyPressed: string;

	public get isCtrlDown(): boolean {
		return this._wasCtrlDownThisFrame || this._isCtrlDown;
	}

	public get isShiftDown(): boolean {
		return this._wasShiftDownThisFrame || this._isShiftDown;
	}

	public get isAltDown(): boolean {
		return this._wasAltDownThisFrame || this._isAltDown;
	}

	public get isAnyKeyDown(): boolean {
		return this._keysDown.length > 0 || this._keysPressed.length > 0;
	}

	public get isAnyKeyPressed(): boolean {
		return this._keysPressed.length > 0;
	}

	public get isAnyKeyReleased(): boolean {
		return this._keysReleased.length > 0;
	}

	public get lastKeyPressed(): string {
		return this._lastKeyPressed;
	}

	public isKeyDown = (key: string): boolean => this._keysDown.indexOf(key) !== -1 || this._keysPressed.indexOf(key) !== -1;
	public isKeyPressed = (key: string): boolean => this._keysPressed.indexOf(key) !== -1;
	public isKeyReleased = (key: string): boolean => this._keysReleased.indexOf(key) !== -1;

	constructor() {
		this._isCtrlDown = false;
		this._isAltDown = false;
		this._isShiftDown = false;

		this._keysReleased = [];
		this._keysPressed = [];
		this._keysDown = [];
		this._lastKeyPressed = "";
	}

	/**
	 * Updates the internal state, should be called at the end of each frame.
	 */
	public update = (): void => {
		this._wasAltDownThisFrame = false;
		this._wasCtrlDownThisFrame = false;
		this._wasShiftDownThisFrame = false;

		this._keysReleased = [];
		this._keysPressed = [];
	};

	/**
	 * Resets the internal state of this class to what it is during creation (nothing pressed, released or held down)
	 */
	public flush = (): void => {
		this._keysPressed.length = 0;
		this._keysReleased.length = 0;
		this._keysDown.length = 0;
		this._lastKeyPressed = '';

		this._wasAltDownThisFrame = false;
		this._wasShiftDownThisFrame = false;
		this._wasCtrlDownThisFrame = false;

		this._isAltDown = false;
		this._isShiftDown = false;
		this._isCtrlDown = false;
	};

	/**
	 * Registers the `keydown` and `keyup` listeners on the passed element so that the class
	 * can handle the input.
	 *
	 * @param {HTMLElement} element To avoid issues with focus it's best to pass `document` here
	 */
	public registerListeners(element: HTMLElement): void {
		element.addEventListener("keydown", this.handleEvent);
		element.addEventListener("keyup", this.handleEvent);
	}

	/**
	 * Handles a keyboard event updating the internal status. This will be called automatically if you register the listeners
	 * via `registerListeners`. If you have listeners being registered somewhere else entirely and would like to keep it
	 * that way, you can manually call this method passing the KeyboardEvent.
	 *
	 * @warning This method will call `preventDefault` on the event passed.
	 *
	 * @param {KeyboardEvent} event
	 */
	public handleEvent = (event: KeyboardEvent): void => {
		this._wasAltDownThisFrame = this._wasAltDownThisFrame || event.altKey;
		this._wasCtrlDownThisFrame = this._wasCtrlDownThisFrame || event.ctrlKey;
		this._wasShiftDownThisFrame = this._wasShiftDownThisFrame || event.shiftKey;

		this._isAltDown = event.altKey;
		this._isCtrlDown = event.ctrlKey;
		this._isShiftDown = event.shiftKey;

		if (event.type === 'keydown') {
			this._lastKeyPressed = event.key;
			this._keysPressed.push(event.key);
			this._keysDown.push(event.key);
			this._lastKeyPressed = event.key;

		} else if (event.type === 'keyup') {
			this._keysReleased.push(event.key);
			this._keysDown = this._keysDown.filter(key => key !== event.key);
		}

		event.preventDefault();
	};
}