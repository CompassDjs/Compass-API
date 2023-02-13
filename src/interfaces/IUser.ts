export default interface IUser {
  userId: string;
  accessToken?: string;
  refreshToken?: string;
  username?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  nitro?: number;
  badges?: string;
  locale?: string;
}
