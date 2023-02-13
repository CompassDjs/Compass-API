export default function FindBadges(flags: number): string {
  let badgesArray: string[] = [];
  badgesList.forEach((badge: { value: number; name: string }) => {
    if (badge.value & flags) badgesArray.push(badge.name);
  });
  return badgesArray.join(",");
}

const badgesList: { name: string; value: number }[] = [
  { name: "Discord_Employee", value: 1 },
  { name: "Partnered_Server_Owner", value: 2 },
  { name: "HypeSquad_Events", value: 4 },
  { name: "Bug_Hunter_Level_1", value: 8 },
  { name: "House_Bravery", value: 64 },
  { name: "House_Brilliance", value: 128 },
  { name: "House_Balance", value: 256 },
  { name: "Early_Supporter", value: 512 },
  { name: "Bug_Hunter_Level_2", value: 16384 },
  { name: "Early_Verified_Bot_Developer", value: 131072 },
  { name: "Discord_Certified_Moderator", value: 262144 },
  { name: "Active_Developer", value: 4194304 },
];
