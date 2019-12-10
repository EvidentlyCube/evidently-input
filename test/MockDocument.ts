import {assert} from 'chai';

interface ListenerInfo {
	eventName: string;
	listener: (...any: any[]) => any;
}

type NameListenerTuple = [string, (...any: any[]) => any];

export class MockDocument extends Document {
	public $listeners: ListenerInfo[] = [];

	public addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any): void {
		this.$listeners.push({
			eventName: type,
			listener: listener,
		});
	}

	public $assertHasListener(eventName: string, listener: (...any: any[]) => any): void {
		const given = this.$listeners.find(x => x.eventName === eventName);

		if (!given) {
			assert.fail(`No listener registered for event ${eventName}`);
		}

		assert.equal(given.listener, listener, `Wrong listener registered for event ${eventName}`);
	}

	public $assertHasListeners(listeners: NameListenerTuple[]): void {
		assert.lengthOf(this.$listeners, listeners.length);
		listeners.forEach(expected => {
			this.$assertHasListener(expected[0], expected[1]);
		});
	}
}