export default interface IGuild {
  id: string;
  guildCreatedAt: Date;
  name?: string;
  icon?: string | null;
  owner?: boolean;
  permissions?: number;
  createdAt?: Date;
}
