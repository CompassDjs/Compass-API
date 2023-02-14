export default interface ISession {
  sid: string;
  userId: number;
  expires: Date;
  data: string;
  createdAt: Date;
  updatedAt: Date;
}
