import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { BadGatewayException } from '@nestjs/common';

describe('AuthService', () => {
	let authService: AuthService;
	let userService: UserService;
	let jwtService: JwtService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AuthService, UserService, JwtService],
		}).compile();

		authService = module.get<AuthService>(AuthService);
		userService = module.get<UserService>(UserService);
		jwtService = module.get<JwtService>(JwtService);
	});

	it('validateUser, not found user', () => {
		userService.findOne = jest.fn().mockReturnValue(undefined);
		expect(authService.validateUser('mockUserName', '123')).toEqual(null);
	});

	it('validateUser, found user, not match password', () => {
		userService.findOne = jest.fn().mockReturnValue({ userId: 1, username: 'mockUserName', password: '123' });
		expect(authService.validateUser('mockUserName', '1234')).toEqual(null);
	});

	it('validateUser, found user, match password', () => {
		userService.findOne = jest.fn().mockReturnValue({ userId: 1, username: 'mockUserName', password: '123' });
		expect(authService.validateUser('mockUserName', '123')).toEqual({ userId: 1, username: 'mockUserName' });
	});

	const mockUser = { userId: 'mockUserId', username: 'mockUserName' };

	it('login, get token null or undefiled', () => {
		jwtService.sign = jest.fn().mockReturnValue(null);
		expect(() => authService.login(mockUser)).toThrow(new BadGatewayException());
	});

	it('login, get token', () => {
		jwtService.sign = jest.fn().mockReturnValue('string token');
		const result = authService.login(mockUser);
		expect(result).toEqual({ access_token: 'string token' });
	});
});
