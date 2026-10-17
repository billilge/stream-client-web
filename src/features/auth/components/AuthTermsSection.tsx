import { Typography } from "@wanteddev/wds";

interface AuthTermsSectionProps {
  title: string;
  body: string | string[];
  /** 약관 첫 조항만 제목과 본문 사이가 6px이고 나머지는 4px이다(Figma 그대로) */
  isFirst?: boolean;
}

// Figma: Policy Section (nodeId 3738:73029 외) — 조항 제목(Body 1/Bold) + 본문(Label 1/Reading - Regular).
function AuthTermsSection({
  title,
  body,
  isFirst = false,
}: AuthTermsSectionProps) {
  return (
    <section className={`flex flex-col ${isFirst ? "gap-1.5" : "gap-1"}`}>
      <Typography
        as="h2"
        color="semantic.label.normal"
        variant="body1"
        weight="bold"
      >
        {title}
      </Typography>
      {typeof body === "string" ? (
        <Typography
          as="p"
          color="semantic.label.neutral"
          variant="label1-reading"
          weight="regular"
        >
          {body}
        </Typography>
      ) : (
        <ul className="ms-5.25 flex list-disc flex-col gap-1.5">
          {body.map((item) => (
            <li key={item}>
              <Typography
                as="span"
                color="semantic.label.neutral"
                variant="label1-reading"
                weight="regular"
              >
                {item}
              </Typography>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default AuthTermsSection;
