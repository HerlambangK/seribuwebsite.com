// types.ts
export interface User {
	id: number;
	email: string;
	username: string;
	isVerified: boolean;
	role?: 'admin' | 'user'; // Optional, depending on your user model
}

export interface Order {
	id: number;
	packageId: number;
	status: string;
	userId: number;
}

export interface AuthResponse {
	user: User;
	accessToken: string;
	refreshToken: string;
	role: string;
	message?: string; // Optional, for error messages or additional info
}

export interface Package {
	id: number;
	name: string;
	price: number;
	description: string;
}

export interface Order {
	id: number;
	packageId: number;
	status: string;
	userId: number;
	totalPrice: string;
	createdAt: string;
	updatedAt: string;
}

export interface UpdateOrderResponse {
	updatedOrder: Order;
}
