import { IconCloud } from "@/registry/magicui/icon-cloud";
import styles from "@/app/journey/journey.module.css";

const slugs = [
  "typescript",
  "javascript",
  "react",
  "nextdotjs",
  "nodedotjs",
  "nestjs",
  "fastapi",
  "html5",
  "css3",
  "express",
  "tailwindcss",
  "postgresql",
  "mongodb",
  "redis",
  "docker",
  "kubernetes",
  "git",
  "github",
  "gitlab",
  "vercel",
  "openai",
  "postman",
  "ethereum",
  "solidity",
  "amazonwebservices",
  "visualstudiocode",
  "figma",
  "jira"
];

export function IconCloudDemo() {
  const images = slugs.map((slug) => `https://cdn.simpleicons.org/${slug}`);

  return (
    <div className={styles.iconCloudWrap}>
      <IconCloud images={images} />
    </div>
  );
}
