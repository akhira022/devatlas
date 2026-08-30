export const SITE_NAME = "DEV ATLAS";
export const SITE_DESCRIPTION =
  "แผนที่ความรู้เชิงโต้ตอบสำหรับนักพัฒนา — เข้าใจเทคโนโลยีผ่านภาพและ animation";

export const NAV_LINKS = [
  { href: "/", label: "สำรวจ" },
  { href: "/learn", label: "เส้นทางเรียน" },
  { href: "/decide", label: "ช่วยเลือก" },
  { href: "/quiz", label: "แบบทดสอบ" },
  { href: "/concepts", label: "เรียนรู้" },
  { href: "/compare", label: "เปรียบเทียบ" },
  { href: "/visualize", label: "ภาพเคลื่อนไหว" },
  { href: "/scenarios", label: "สถานการณ์" },
  { href: "/graph", label: "กราฟ" },
] as const;

export const POPULAR_CONCEPT_SLUGS = [
  "git",
  "http",
  "dhcp",
  "curl",
  "data-structure",
  "jwt",
  "docker",
  "api",
  "dns",
  "sql",
  "authentication",
  "llm",
] as const;

export const CATEGORY_ICONS: Record<string, string> = {
  network: "globe",
  programming: "code",
  database: "database",
  security: "shield",
  ai: "brain",
  cloud: "cloud",
  devops: "settings",
  iot: "radio",
  cli: "terminal",
  "git-github": "git-branch",
  hardware: "cpu",
};
