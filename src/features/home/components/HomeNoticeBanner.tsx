import { PageCounter, Typography } from "@wanteddev/wds";
import type { ComponentType } from "react";

import noticeGeneral from "@/assets/images/home/notice-general.png";
import type {
  HomeNotice,
  HomeNoticeTemplate,
} from "@/features/home/constants/homeMock";

interface HomeNoticeCardProps {
  notice: HomeNotice;
  index: number;
  total: number;
}

function HomeNoticeText({ notice, index, total }: HomeNoticeCardProps) {
  return (
    <div className="relative flex items-end justify-between">
      <div className="flex w-[257px] flex-col gap-1">
        <Typography
          as="p"
          className="line-clamp-2 break-keep"
          color="semantic.label.normal"
          variant="heading2"
          weight="bold"
        >
          {notice.title}
        </Typography>
        <Typography
          as="p"
          color="semantic.label.alternative"
          variant="label2"
          weight="regular"
        >
          {notice.subtitle}
        </Typography>
      </div>
      <PageCounter
        alternative
        currentPage={index + 1}
        size="small"
        totalPages={total}
      />
    </div>
  );
}

// Figma: 일반공지 (nodeId 3147:146244)
function HomeNoticeGeneralCard(props: HomeNoticeCardProps) {
  return (
    <div className="relative flex h-[261px] w-[335px] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-xl border-[0.5px] border-static-white bg-notice-banner-general px-4 py-5 shadow-[0_0_60px_rgba(23,23,23,0.1)]">
      <img
        alt=""
        className="absolute top-2 left-1/2 h-[175px] w-[264px] -translate-x-1/2 object-cover"
        src={noticeGeneral}
      />
      <div className="absolute top-[103px] left-0 h-[67px] w-full bg-linear-to-t from-notice-banner-general to-transparent" />
      <HomeNoticeText {...props} />
    </div>
  );
}

const NOTICE_CARDS: Record<
  HomeNoticeTemplate,
  ComponentType<HomeNoticeCardProps>
> = {
  general: HomeNoticeGeneralCard,
};

// 카드마다 자기 순서를 카운터로 보여준다. 다음 카드가 오른쪽에 살짝 보인다.
// 가로 스크롤 영역이 카드 그림자(Shadow/Spread/Small)를 자르지 않게 위아래로 12px(섹션 간격) 넓힌다.
function HomeNoticeBanner({ notices }: { notices: HomeNotice[] }) {
  return (
    <div className="scrollbar-hidden -my-3 flex snap-x snap-mandatory scroll-px-5 gap-2 overflow-x-auto px-5 py-3">
      {notices.map((notice, index) => {
        const Card = NOTICE_CARDS[notice.template];
        return (
          <Card
            index={index}
            key={notice.id}
            notice={notice}
            total={notices.length}
          />
        );
      })}
    </div>
  );
}

export default HomeNoticeBanner;
