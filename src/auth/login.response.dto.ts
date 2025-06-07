export class LoginResponseDto {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: {
    id: number;
    username: string;
  };
}
