/**
 * Handles the keyboard
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

	public registerEventsInDocument(document: Document): void {
		document.addEventListener("keydown", this.handleEvent);
		document.addEventListener("keyup", this.handleEvent);
	}

	public update = (): void => {
		this._wasAltDownThisFrame = false;
		this._wasCtrlDownThisFrame = false;
		this._wasShiftDownThisFrame = false;

		this._keysReleased = [];
		this._keysPressed = [];
	};

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