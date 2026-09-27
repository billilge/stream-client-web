import { type ComponentType, lazy, type ReactNode, Suspense } from "react";
import { createBrowserRouter, type RouteObject } from "react-router-dom";

import App from "@/app/App";
import ScreenLayoutRoute, {
  type ScreenRouteHandle,
} from "@/app/ScreenLayoutRoute";
import ScreenSkeleton from "@/components/ui/ScreenSkeleton";
import BililgeListSkeleton from "@/features/bililge/components/BililgeListSkeleton";
import EventsDetailSkeleton from "@/features/events/components/EventsDetailSkeleton";
import EventsListSkeleton from "@/features/events/components/EventsListSkeleton";
import NoticesDetailSkeleton from "@/features/notices/components/NoticesDetailSkeleton";
import NoticesListSkeleton from "@/features/notices/components/NoticesListSkeleton";

// 화면은 라우트마다 따로 코드 분할한다. 첫 진입에 받는 JS가 줄고, 화면 JS를 받는 동안에는 그 화면
// 모양의 스켈레톤(fallback)을 보여준다 — 빈 화면이 잠깐 뜨는 대신 곧 나올 배치가 먼저 보인다.
// 스켈레톤은 fallback이라 코드 분할하지 않는다(여기서 바로 import).
// 전용 스켈레톤이 없는 화면은 헤더 자리만 채우는 ScreenSkeleton을 쓴다.
function lazyScreen(
  load: () => Promise<{ default: ComponentType }>,
  fallback: ReactNode = <ScreenSkeleton />,
) {
  const Screen = lazy(load);
  return (
    <Suspense fallback={fallback}>
      <Screen />
    </Suspense>
  );
}

// 앱의 모든 라우트는 이 객체 배열 한곳에서 정의한다 — 새 화면은 여기에 라우트를 추가한다.
// satisfies로 선언 시점에 RouteObject 형태를 검사한다.
// 화면별 레이아웃 옵션(하단 탭 숨김 등)은 레이아웃 라우트를 따로 두지 않고 각 라우트의 handle로 지정한다.
const routes = [
  {
    children: [
      {
        children: [
          {
            element: lazyScreen(() => import("@/features/home/HomeScreen")),
            path: "/",
          },
          {
            element: lazyScreen(
              () => import("@/features/bililge/BililgeListScreen"),
              <BililgeListSkeleton />,
            ),
            path: "/bililge",
          },
          {
            element: lazyScreen(
              () => import("@/features/events/EventsListScreen"),
              <EventsListSkeleton />,
            ),
            // 카드 없이 구분선으로만 나뉘는 목록이라 화면 전체가 흰 면이다
            handle: { background: "normal" } satisfies ScreenRouteHandle,
            path: "/events",
          },
          {
            element: lazyScreen(
              () => import("@/features/notices/NoticesListScreen"),
              <NoticesListSkeleton />,
            ),
            // 카드 없이 구분선으로만 나뉘는 목록이라 화면 전체가 흰 면이다
            handle: { background: "normal" } satisfies ScreenRouteHandle,
            path: "/notices",
          },
          {
            element: lazyScreen(
              () => import("@/features/feedbacks/FeedbacksListScreen"),
            ),
            // 공지 화면과 같은 이유(카드 없이 구분선으로만 나뉘는 목록)로 흰 면을 쓴다
            handle: { background: "normal" } satisfies ScreenRouteHandle,
            path: "/feedbacks",
          },
          {
            element: lazyScreen(
              () => import("@/features/events/EventsDetailScreen"),
              <EventsDetailSkeleton />,
            ),
            // Bottom Nav 대신 하단 고정 버튼(Action Area)이 있는 화면
            handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
            path: "/events/:eventId",
          },
          {
            element: lazyScreen(
              () => import("@/features/events/EventsApplicationScreen"),
            ),
            // Bottom Nav 대신 하단 고정 버튼(Action Area)이 있는 화면
            handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
            path: "/events/:eventId/apply",
          },
          {
            element: lazyScreen(
              () => import("@/features/events/EventsApplicationCompleteScreen"),
            ),
            // 신청 결과 화면 — 하단 탭 없이 흰 배경 전체 화면이다
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/events/:eventId/apply/complete",
          },
          {
            element: lazyScreen(
              () => import("@/features/events/EventsApplicationClosedScreen"),
            ),
            // 신청 결과 화면 — 하단 탭 없이 흰 배경 전체 화면이다
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/events/:eventId/apply/closed",
          },
          {
            element: lazyScreen(
              () => import("@/features/notices/NoticesDetailScreen"),
              <NoticesDetailSkeleton />,
            ),
            // 상세 화면은 뒤로가기로만 돌아가는 흐름이라 Bottom Nav를 안 보여준다. 카드 없이
            // 본문이 배경까지 흰 면이라 목록 화면과 같은 background: "normal"을 쓴다.
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/notices/:noticeId",
          },
          // 라우트가 없는 경로 — 레이아웃 안에 둬서 하단 탭이 유지되고, 탭 경로(/event 등)면 그 탭이 활성으로 보인다
          {
            element: lazyScreen(() => import("@/app/ComingSoonScreen")),
            path: "*",
          },
        ],
        element: <ScreenLayoutRoute />,
      },
    ],
    element: <App />,
  },
] satisfies RouteObject[];

export const router = createBrowserRouter(routes);
