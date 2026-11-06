import {
  SegmentedControl,
  SegmentedControlItem,
  TopNavigationButton,
} from "@wanteddev/wds";
import { IconBell, IconSearch } from "@wanteddev/wds-icon";
import {
  Suspense,
  startTransition,
  useDeferredValue,
  useEffect,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import BillilgeCategoryFilter from "@/features/billilge/components/BillilgeCategoryFilter";
import BillilgeItemList from "@/features/billilge/components/BillilgeItemList";
import BillilgeListSkeleton from "@/features/billilge/components/BillilgeListSkeleton";
import BillilgeRentalSheet from "@/features/billilge/components/BillilgeRentalSheet";
import BillilgeReturnSection from "@/features/billilge/components/BillilgeReturnSection";
import BillilgeReturnSkeleton from "@/features/billilge/components/BillilgeReturnSkeleton";
import {
  BILLILGE_ALL_CATEGORIES,
  BILLILGE_TAB_PATHS,
  type BillilgeCategoryFilterValue,
  type BillilgeListLocationState,
  type BillilgeTab,
} from "@/features/billilge/constants/billilge";
import { NOTIFICATIONS_PATH } from "@/features/notifications/constants/notifications";
import { getSearchPath } from "@/features/search/constants/search";
import type { BillilgeItem } from "@/shared/entities/billilge/billilgeTypes";

interface BillilgeListScreenProps {
  /** 대여/반납 탭 — 탭마다 경로가 달라서 라우터가 정해 넘긴다 */
  tab: BillilgeTab;
}

// Figma: 빌릴게 (nodeId 1243:73331)
function BillilgeListScreen({ tab }: BillilgeListScreenProps) {
  const navigate = useNavigate();
  const location = useLocation();
  // 탭을 바꿀 때마다 히스토리가 쌓이지 않게 replace로 바꾼다
  const changeTab = (next: BillilgeTab) =>
    navigate(BILLILGE_TAB_PATHS[next], { replace: true });
  const [category, setCategory] = useState<BillilgeCategoryFilterValue>(
    BILLILGE_ALL_CATEGORIES,
  );
  // 카테고리마다 서버에서 따로 받는다. 칩은 바로 바뀌고, 목록은 새 카테고리를 받는 동안 스켈레톤으로 비우지 않고
  // 지금 목록을 띄워 둔다(행사 목록과 같은 방식)
  const listCategory = useDeferredValue(category);
  const [rentalItem, setRentalItem] = useState<BillilgeItem | null>(null);
  const [rentalSheetOpen, setRentalSheetOpen] = useState(false);

  // 물품 카드의 "대여 신청"을 눌렀을 때 대여 시트를 연다.
  // 바텀시트를 여는 것(슬라이드 애니메이션)은 즉시 반영하고, 그 안의 휠
  // 피커(특히 분 60개) 마운트처럼 무거운 작업은 startTransition으로 낮은
  // 우선순위로 미뤄서 첫 프레임이 버벅이지 않게 한다 — 처음 열 때만 해당하고,
  // rentalItem은 닫아도 null로 안 돌아가서 두 번째부터는 이 마운트 비용 자체가 없다.
  const openRentalSheet = (item: BillilgeItem) => {
    setRentalSheetOpen(true);
    startTransition(() => {
      setRentalItem(item);
    });
  };

  // 검색 결과에서 대여 신청을 누르고 넘어오면(navigate state) 화면이 뜬 뒤 그 물품으로 대여 신청을 누른 것과
  // 같이 시트를 연다. 넘어온 물품은 열 때까지 여기 들고 있는다.
  const [pendingRentalItem, setPendingRentalItem] =
    useState<BillilgeItem | null>(
      () =>
        (location.state as BillilgeListLocationState | null)?.rentalItem ??
        null,
    );

  // 새로고침·뒤로가기로 돌아왔을 때 다시 열리지 않게 받자마자 state를 비운다(열린피드백 전송 토스트와 같은 방식)
  useEffect(() => {
    if ((location.state as BillilgeListLocationState | null)?.rentalItem) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  // 닫힌 시트(화면 아래)가 한 번 그려진 다음 열어야 목록에서 누를 때처럼 아래에서 올라오는 애니메이션이 보인다.
  // 화면이 뜬 직후 바로 열면 닫힌 위치가 그려지기 전에 열린 위치로 바뀌어서 시트가 애니메이션 없이 한 번에 나타난다.
  // 그래서 다음 프레임이 그려진 뒤(requestAnimationFrame 두 번)에 연다.
  // biome-ignore lint/correctness/useExhaustiveDependencies: 넘어온 물품이 정해질 때만 연다(openRentalSheet는 매 렌더 새로 만들어진다)
  useEffect(() => {
    if (!pendingRentalItem) {
      return;
    }
    let frameId = requestAnimationFrame(() => {
      frameId = requestAnimationFrame(() => {
        openRentalSheet(pendingRentalItem);
        setPendingRentalItem(null);
      });
    });
    return () => cancelAnimationFrame(frameId);
  }, [pendingRentalItem]);

  useScreenHeader(
    <ScreenHeader
      title="빌릴게"
      trailing={
        <>
          <TopNavigationButton
            aria-label="검색"
            onClick={() => navigate(getSearchPath("billilge"))}
            variant="icon"
          >
            <IconSearch />
          </TopNavigationButton>
          <TopNavigationButton
            aria-label="알림"
            onClick={() =>
              navigate(NOTIFICATIONS_PATH, { viewTransition: true })
            }
            variant="icon"
          >
            <IconBell />
          </TopNavigationButton>
        </>
      }
    />,
  );

  return (
    <div className="flex h-full flex-col">
      {/* 대여/반납 토글 + 카테고리 필터는 화면마다 값·동작이 달라 헤더가 아니라 화면이 직접 그린다.
          목록만 스크롤되도록 여기는 고정(shrink-0)한다.
          Figma Tool 프레임(56~88)은 높이 32에 위아래 여백이 없다 — 세로 패딩을 주면
          토글과 그 아래 필터 행이 함께 밀린다(행사·게시판 화면과 같은 규칙). */}
      <div className="shrink-0 px-5">
        <SegmentedControl
          onValueChange={(value) => changeTab(value as BillilgeTab)}
          size="small"
          value={tab}
        >
          <SegmentedControlItem value="rent">대여</SegmentedControlItem>
          <SegmentedControlItem value="return">반납</SegmentedControlItem>
        </SegmentedControl>
      </div>

      {/* 카테고리 필터는 대여 탭 전용이다 — Figma 반납 화면(1133:49973)에는 필터 행이 없다. */}
      {tab === "rent" && (
        <div className="shrink-0 px-5 py-4">
          <BillilgeCategoryFilter onChange={setCategory} value={category} />
        </div>
      )}

      <div className="scrollbar-hidden flex-1 overflow-y-auto">
        {tab === "rent" ? (
          // 헤더·토글·필터는 데이터와 무관해서 바로 그리고, 데이터를 받는 목록 자리만 스켈레톤으로 채운다
          <Suspense fallback={<BillilgeListSkeleton />}>
            <BillilgeItemList
              category={listCategory}
              onRentRequest={openRentalSheet}
            />
          </Suspense>
        ) : (
          <Suspense fallback={<BillilgeReturnSkeleton />}>
            <BillilgeReturnSection onBrowseRentals={() => changeTab("rent")} />
          </Suspense>
        )}
      </div>

      <BillilgeRentalSheet
        item={rentalItem}
        onClose={() => setRentalSheetOpen(false)}
        open={rentalSheetOpen}
      />
    </div>
  );
}

export default BillilgeListScreen;
