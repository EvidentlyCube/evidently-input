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

export class MouseInput {
	private _localMouseX: number;
	private _localMouseY: number;
	private _pageMouseX: number;
	private _pageMouseY: number;
	private _screenMouseX: number;
	private _screenMouseY: number;

	private _mouseButtonsDown: number[];
	private _mouseButtonsPressed: number[];
	private _mouseButtonsReleased: number[];

	public inputContainer?: InputRelativeContainer;
	public readonly scaleProperties: MouseInputRelativeScaleProps;

	public get pageMouseX(): number {
		return this._pageMouseX;
	}

	public get pageMouseY(): number {
		return this._pageMouseY;
	}

	public get localMouseX(): number {
		return this._localMouseX;
	}

	public get localMouseY(): number {
		return this._localMouseY;
	}

	public get screenMouseX(): number {
		return this._screenMouseX;
	}

	public get screenMouseY(): number {
		return this._screenMouseY;
	}

	public get scaledMouseX(): number {
		return this.localMouseX / this.scaleProperties.scaleX - this.scaleProperties.offsetX;
	}

	public get scaledMouseY(): number {
		return this.localMouseY / this.scaleProperties.scaleY - this.scaleProperties.offsetY;
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

	constructor() {
		this._pageMouseX = 0;
		this._pageMouseY = 0;
		this._localMouseX = 0;
		this._localMouseY = 0;

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

	public registerEventsInDocument(document: Document): void {
		document.addEventListener("mousedown", this.handleEvent);
		document.addEventListener("mouseup", this.handleEvent);
		document.addEventListener("mousemove", this.handleEvent);
	}

	public isMouseDown = (button: number): boolean => this._mouseButtonsDown.indexOf(button) !== -1 || this.isMousePressed(button);
	public isMousePressed = (button: number): boolean => this._mouseButtonsPressed.indexOf(button) !== -1;
	public isMouseReleased = (button: number): boolean => this._mouseButtonsReleased.indexOf(button) !== -1;

	public update = (): void => {
		this._mouseButtonsReleased.length = 0;
		this._mouseButtonsPressed.length = 0;
	};

	public flushMouse = (): void => {
	};

	public handleEvent = (event: MouseEvent | PointerEvent): void => {
		this._pageMouseX = event.pageX ?? event.clientX;
		this._pageMouseY = event.pageY ?? event.clientY;
		this._screenMouseX = event.screenX;
		this._screenMouseY = event.screenY;
		this._localMouseX = this.inputContainer ? event.pageX - this.inputContainer.offsetLeft : event.clientX;
		this._localMouseY = this.inputContainer ? event.pageY - this.inputContainer.offsetTop : event.clientY;

		if (event.type === 'mouseup' || event.type === 'pointerup') {
			this._mouseButtonsDown = this._mouseButtonsDown.filter(button => button !== event.button);
			this._mouseButtonsReleased.push(event.button);

		} else if (event.type === 'mousedown' || event.type === 'pointerup') {
			this._mouseButtonsDown.push(event.button);
			this._mouseButtonsPressed.push(event.button);
		}
	};
}