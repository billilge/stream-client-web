import { createBrowserRouter, type RouteObject } from "react-router-dom";

import App from "@/app/App";
import ComingSoonScreen from "@/app/ComingSoonScreen";
import ScreenLayoutRoute, {
  type ScreenRouteHandle,
} from "@/app/ScreenLayoutRoute";
import ArchivesDetailScreen from "@/features/archives/ArchivesDetailScreen";
import ArchivesListScreen from "@/features/archives/ArchivesListScreen";
import ArchivesPhotosScreen from "@/features/archives/ArchivesPhotosScreen";
import BililgeListScreen from "@/features/bililge/BililgeListScreen";
import EventsApplicationScreen from "@/features/events/EventsApplicationScreen";
import EventsListScreen from "@/features/events/EventsListScreen";
import HomeScreen from "@/features/home/HomeScreen";
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
          { element: <EventsListScreen />, path: "/events" },
          { element: <NoticesListScreen />, path: "/notices" },
          {
            element: <EventsApplicationScreen />,
            // Bottom Nav 대신 하단 고정 버튼(Action Area)이 있는 화면
            handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
            path: "/events/:eventId/apply",
          },
          {
            element: <ArchivesListScreen />,
            handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
            path: "/archives",
          },
          {
            element: <ArchivesDetailScreen />,
            handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
            path: "/archives/:archiveId",
          },
          {
            element: <ArchivesPhotosScreen />,
            handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
            path: "/archives/:archiveId/photos",
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
