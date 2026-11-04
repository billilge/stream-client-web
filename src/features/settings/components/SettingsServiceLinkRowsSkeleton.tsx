import { Skeleton } from "@wanteddev/wds";

import { useSkeletonAnimation } from "@/components/ui/ScreenSkeleton";

// 의견 보내기·개인정보 처리방침 두 행 자리 — 행 높이 20px, 행 사이 20px(SettingsSection 기본 간격).
// 행 전체가 데이터 컴포넌트라 라벨 자리를 Figma 글자 폭(65px·102px)대로 잡아 둔다
// (앱 버전 행 스켈레톤과 같은 방식).
const ROWS = [
  { key: "feedback-form", labelWidth: "65px" },
  { key: "privacy-policy", labelWidth: "102px" },
];

function SettingsServiceLinkRowsSkeleton() {
  const animation = useSkeletonAnimation();

  return (
    <>
      {ROWS.map((row) => (
        <div className="flex h-5 items-center" key={row.key}>
          <Skeleton
            animation={animation}
            height="14px"
            radius="4px"
            variant="rectangle"
            width={row.labelWidth}
          />
        </div>
      ))}
    </>
  );
}

export default SettingsServiceLinkRowsSkeleton;
