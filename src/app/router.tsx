import { createBrowserRouter, type RouteObject } from "react-router-dom";

import App from "@/app/App";
import ComingSoonScreen from "@/app/ComingSoonScreen";
import ScreenLayoutRoute, {
  type ScreenRouteHandle,
} from "@/app/ScreenLayoutRoute";
import BililgeListScreen from "@/features/bililge/BililgeListScreen";
import EventsApplicationClosedScreen from "@/features/events/EventsApplicationClosedScreen";
import EventsApplicationCompleteScreen from "@/features/events/EventsApplicationCompleteScreen";
import EventsApplicationScreen from "@/features/events/EventsApplicationScreen";
import EventsDetailScreen from "@/features/events/EventsDetailScreen";
import EventsListScreen from "@/features/events/EventsListScreen";
import FeedbacksListScreen from "@/features/feedbacks/FeedbacksListScreen";
import FeedbacksNewScreen from "@/features/feedbacks/FeedbacksNewScreen";
import HomeScreen from "@/features/home/HomeScreen";
import NoticesDetailScreen from "@/features/notices/NoticesDetailScreen";
import NoticesListScreen from "@/features/notices/NoticesListScreen";

// 앱의 모든 라우트는 이 객체 배열 한곳에서 정의한다 — 새 화면은 여기에 라우트를 추가한다.
// satisfies로 선언 시점에 RouteObject 형태를 검사한다.
// 화면별 레이아웃 옵션(하단 탭 숨김 등)은 레이아웃 라우트를 따로 두지 않고 각 라우트의 handle로 지정한다.
const routes = [
  {
    children: [
      {
        children: [
          { element: <HomeScreen />, path: "/" },
          { element: <BililgeListScreen />, path: "/bililge" },
          {
            element: <EventsListScreen />,
            // 카드 없이 구분선으로만 나뉘는 목록이라 화면 전체가 흰 면이다
            handle: { background: "normal" } satisfies ScreenRouteHandle,
            path: "/events",
          },
          {
            element: <NoticesListScreen />,
            // 카드 없이 구분선으로만 나뉘는 목록이라 화면 전체가 흰 면이다
            handle: { background: "normal" } satisfies ScreenRouteHandle,
            path: "/notices",
          },
          {
            element: <FeedbacksListScreen />,
            // 공지 화면과 같은 이유(카드 없이 구분선으로만 나뉘는 목록)로 흰 면을 쓴다
            handle: { background: "normal" } satisfies ScreenRouteHandle,
            path: "/feedbacks",
          },
          {
            element: <FeedbacksNewScreen />,
            // Bottom Nav 대신 하단 고정 버튼(Action Area)이 있는 화면. Figma 루트 배경도 흰 면이다.
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/feedbacks/new",
          },
          {
            element: <EventsDetailScreen />,
            // Bottom Nav 대신 하단 고정 버튼(Action Area)이 있는 화면
            handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
            path: "/events/:eventId",
          },
          {
            element: <EventsApplicationScreen />,
            // Bottom Nav 대신 하단 고정 버튼(Action Area)이 있는 화면
            handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
            path: "/events/:eventId/apply",
          },
          {
            element: <EventsApplicationCompleteScreen />,
            // 신청 결과 화면 — 하단 탭 없이 흰 배경 전체 화면이다
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/events/:eventId/apply/complete",
          },
          {
            element: <EventsApplicationClosedScreen />,
            // 신청 결과 화면 — 하단 탭 없이 흰 배경 전체 화면이다
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/events/:eventId/apply/closed",
          },
          {
            element: <NoticesDetailScreen />,
            // 상세 화면은 뒤로가기로만 돌아가는 흐름이라 Bottom Nav를 안 보여준다. 카드 없이
            // 본문이 배경까지 흰 면이라 목록 화면과 같은 background: "normal"을 쓴다.
            handle: {
              background: "normal",
              hasBottomNav: false,
            } satisfies ScreenRouteHandle,
            path: "/notices/:noticeId",
          },
          // 라우트가 없는 경로 — 레이아웃 안에 둬서 하단 탭이 유지되고, 탭 경로(/event 등)면 그 탭이 활성으로 보인다
          { element: <ComingSoonScreen />, path: "*" },
        ],
        element: <ScreenLayoutRoute />,
      },
    ],
    element: <App />,
  },
] satisfies RouteObject[];

export const router = createBrowserRouter(routes);
