declare module 'escpos-network' {
	import { Socket } from 'net';
	import { EventEmitter } from 'events';

	// Network class
	export class Network extends EventEmitter {
		address: string;
		port: number;
		device: Socket;

		constructor(address: string, port?: number);

		// Method to open a connection to a network device
		open(callback?: (err: Error | null, device: Socket) => void): this;

		// Method to write data to the connected device
		write(data: Buffer | string, callback?: (err: Error | null) => void): this;

		// Method to read data from the connected device
		read(callback: (data: Buffer) => void): this;

		// Method to close the connection
		close(callback?: (err: Error | null, device: Socket) => void): this;
	}

	// Export the Network class
	export = Network;
}
