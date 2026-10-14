import { Skeleton } from "@wanteddev/wds";

import { useSkeletonAnimation } from "@/components/ui/ScreenSkeleton";

// 계정 정보 세 행의 자리를 그대로 따른다 — 행 높이 20px, 행 사이 20px(SettingsSection 기본 간격).
// 라벨은 폭이 고정이라 같은 자리를 잡아 두고, 값은 길이가 제각각이라 넉넉한 비율로 둔다.
const ROWS = [
  { key: "name", labelWidth: "28px", valueWidth: "48px" },
  { key: "email", labelWidth: "42px", valueWidth: "140px" },
  { key: "phone", labelWidth: "56px", valueWidth: "100px" },
];

function SettingsAccountRowsSkeleton() {
  const animation = useSkeletonAnimation();

  return (
    <>
      {ROWS.map((row) => (
        <div className="flex h-5 items-center justify-between" key={row.key}>
          <Skeleton
            animation={animation}
            height="14px"
            radius="4px"
            variant="rectangle"
            width={row.labelWidth}
          />
          <Skeleton
            animation={animation}
            height="14px"
            radius="4px"
            variant="rectangle"
            width={row.valueWidth}
          />
        </div>
      ))}
    </>
  );
}

export default SettingsAccountRowsSkeleton;
