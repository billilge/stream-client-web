import { queryOptions } from "@tanstack/react-query";

import { api } from "@/shared/api";
import { homeKeys } from "@/shared/entities/home/homeKeys";
import type { HomeResponse } from "@/shared/entities/home/homeTypes";

// 화면은 이 queryOptions로만 데이터를 받는다. 화면 모양으로 바꿔야 하면 화면 쪽에서 select를 더한다.
export const homeQueries = {
  // 홈 화면 데이터를 한 번에 받는다(GET /v1/app/home). 섹션마다 select로 자기 부분만 꺼내 읽어서,
  // 여러 섹션이 같이 읽어도 요청은 한 번이다.
  home: () =>
    queryOptions({
      queryKey: homeKeys.root(),
      queryFn: ({ signal }) =>
        api.get<HomeResponse>("/v1/app/home", { signal }),
    }),
};
