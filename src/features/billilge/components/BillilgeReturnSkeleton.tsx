import { Divider, Skeleton, Typography } from "@wanteddev/wds";
import { Fragment } from "react";

import { useSkeletonAnimation } from "@/components/ui/ScreenSkeleton";

const RETURN_ITEM_KEYS = ["return-1", "return-2"];
const HISTORY_ROW_KEYS = ["history-1", "history-2", "history-3"];

// 반납 탭 데이터(반납 필요 대여·대여 내역)를 받는 동안 BillilgeListScreen의 목록 자리에 보이는 스켈레톤 —
// BillilgeReturnSection과 같은 배치다. 섹션 제목은 데이터와 무관해서 실제 문구를 그대로 그려 두고,
// 카드·내역 줄만 스켈레톤으로 채운다.
function BillilgeReturnSkeleton() {
  const animation = useSkeletonAnimation();

  return (
    <div className="flex flex-col gap-8 overflow-hidden px-5 pt-7">
      <div className="flex flex-col gap-3">
        <Typography
          as="p"
          color="semantic.label.normal"
          variant="headline2"
          weight="bold"
        >
          반납이 필요한 물품
        </Typography>
        <div className="flex flex-col gap-2">
          {RETURN_ITEM_KEYS.map((key) => (
            <div
              className="flex h-[74px] items-center gap-3 rounded-xl bg-background-normal p-4"
              key={key}
            >
              <Skeleton
                animation={animation}
                height="42px"
                radius="8px"
                variant="rectangle"
                width="42px"
              />
              <div className="flex flex-1 flex-col gap-1.5">
                <Skeleton
                  animation={animation}
                  height="16px"
                  radius="4px"
                  variant="rectangle"
                  width="40%"
                />
                <Skeleton
                  animation={animation}
                  height="14px"
                  radius="4px"
                  variant="rectangle"
                  width="32%"
                />
              </div>
              <Skeleton
                animation={animation}
                height="32px"
                radius="8px"
                variant="rectangle"
                width="76px"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Typography
          as="p"
          color="semantic.label.normal"
          variant="headline2"
          weight="bold"
        >
          대여 내역
        </Typography>
        <div className="flex flex-col gap-4 rounded-xl bg-background-normal p-4">
          {HISTORY_ROW_KEYS.map((key, index) => (
            <Fragment key={key}>
              {index > 0 && (
                <Divider color="semantic.line.normal.alternative" />
              )}
              <div className="flex items-center gap-3">
                <Skeleton
                  animation={animation}
                  height="42px"
                  radius="8px"
                  variant="rectangle"
                  width="42px"
                />
                <div className="flex flex-1 flex-col gap-1.5">
                  <Skeleton
                    animation={animation}
                    height="16px"
                    radius="4px"
                    variant="rectangle"
                    width="36%"
                  />
                  <Skeleton
                    animation={animation}
                    height="14px"
                    radius="4px"
                    variant="rectangle"
                    width="56%"
                  />
                  <Skeleton
                    animation={animation}
                    height="14px"
                    radius="4px"
                    variant="rectangle"
                    width="56%"
                  />
                </div>
                <Skeleton
                  animation={animation}
                  height="24px"
                  radius="8px"
                  variant="rectangle"
                  width="56px"
                />
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BillilgeReturnSkeleton;
