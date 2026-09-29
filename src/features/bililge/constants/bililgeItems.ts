import eightPinCharger from "@/assets/icons/bililge-items/8pin-charger.svg";
import alcoholSwab from "@/assets/icons/bililge-items/alcohol-swab.svg";
import bandAid from "@/assets/icons/bililge-items/band-aid.svg";
import curlingIron from "@/assets/icons/bililge-items/curling-iron.svg";
import eyeDrops from "@/assets/icons/bililge-items/eye-drops.svg";
import hairDryer from "@/assets/icons/bililge-items/hair-dryer.svg";
import laptopCharger from "@/assets/icons/bililge-items/laptop-charger.svg";
import mask from "@/assets/icons/bililge-items/mask.svg";
import ointment from "@/assets/icons/bililge-items/ointment.svg";
import painReliefPatch from "@/assets/icons/bililge-items/pain-relief-patch.svg";
import pill from "@/assets/icons/bililge-items/pill.svg";
import powerBank from "@/assets/icons/bililge-items/power-bank.svg";
import sanitaryPad from "@/assets/icons/bililge-items/sanitary-pad.svg";
import umbrella from "@/assets/icons/bililge-items/umbrella.svg";
import usbCCharger from "@/assets/icons/bililge-items/usb-c-charger.svg";

export interface BililgeItem {
  id: string;
  name: string;
  quantity: number;
  icon: string;
  // 대여 바텀시트의 "대여할 물품" 카드(Figma nodeId 1422:57184, 3013:114608)에 "수량 28 ·
  // {returnDeadlineLabel}"로 붙는 반납 기한 문구 — "오늘 17시까지 반납"/"9/29까지 반납"처럼
  // 오늘·내일·그 이후(월/일)를 서버가 이미 판단해서 내려주는 값이라 가정한다. 오늘/내일 여부는
  // 보는 사람의 로컬 시각 기준이라 프런트에서 계산하는 게 일반적이지만, 이 서비스는 같은 화면을
  // 웹과 앱이 각각 구현해야 해서 "오늘/내일 판단 기준"이 플랫폼마다 어긋나지 않도록 서버가
  // 라벨 문자열까지 계산해서 내려주기로 했다 — 그래서 이 필드는 프런트가 다시 가공하지 않고
  // 그대로 렌더링만 하는 완성된 문자열이다.
  returnDeadlineLabel: string;
}

// 목데이터는 실 서버가 없어 위 필드를 흉내내는 값이다 — 실행 시점 기준으로 오늘/내일/그 이후
// 라벨을 미리 계산해두되, 컴포넌트 쪽에는 이 계산 로직 자체를 노출하지 않는다(export하지 않음).
// 실 API가 붙으면 이 함수와 호출부는 통째로 지우고 응답 필드를 그대로 쓰면 된다.
// 오늘 마감은 시각이 물품마다 다른 게 아니라 "17시"로 고정된 정책값이라 파라미터로 받지 않는다.
function mockReturnDeadlineLabel(daysFromNow: number): string {
  if (daysFromNow <= 0) {
    return "오늘 17시까지 반납";
  }
  if (daysFromNow === 1) {
    return "내일까지 반납";
  }
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return `${date.getMonth() + 1}/${date.getDate()}까지 반납`;
}

// Figma: 빌릴게 Item Grid (nodeId 1243:73343) 순서·물품명·수량을 그대로 옮긴 목데이터 — 실 API 연동 전까지 사용
export const BILILGE_ITEMS: BililgeItem[] = [
  {
    icon: curlingIron,
    id: "curling-iron",
    name: "고데기",
    quantity: 28,
    returnDeadlineLabel: mockReturnDeadlineLabel(0),
  },
  {
    icon: laptopCharger,
    id: "laptop-charger",
    name: "노트북 충전기(C타입)",
    quantity: 28,
    returnDeadlineLabel: mockReturnDeadlineLabel(1),
  },
  {
    icon: hairDryer,
    id: "hair-dryer",
    name: "드라이기",
    quantity: 28,
    returnDeadlineLabel: mockReturnDeadlineLabel(0),
  },
  {
    icon: mask,
    id: "mask",
    name: "마스크",
    quantity: 28,
    returnDeadlineLabel: mockReturnDeadlineLabel(3),
  },
  {
    icon: bandAid,
    id: "band-aid",
    name: "밴드",
    quantity: 28,
    returnDeadlineLabel: mockReturnDeadlineLabel(3),
  },
  {
    icon: powerBank,
    id: "power-bank",
    name: "보조배터리",
    quantity: 28,
    returnDeadlineLabel: mockReturnDeadlineLabel(1),
  },
  {
    icon: sanitaryPad,
    id: "sanitary-pad-large",
    name: "생리대(대형)",
    quantity: 28,
    returnDeadlineLabel: mockReturnDeadlineLabel(0),
  },
  {
    icon: sanitaryPad,
    id: "sanitary-pad-small",
    name: "생리대(소형)",
    quantity: 28,
    returnDeadlineLabel: mockReturnDeadlineLabel(0),
  },
  {
    icon: alcoholSwab,
    id: "alcohol-swab",
    name: "알콜스왑",
    quantity: 28,
    returnDeadlineLabel: mockReturnDeadlineLabel(2),
  },
  {
    icon: umbrella,
    id: "umbrella",
    name: "우산",
    quantity: 28,
    returnDeadlineLabel: mockReturnDeadlineLabel(2),
  },
  {
    icon: pill,
    id: "stomach-medicine",
    name: "위장약",
    quantity: 28,
    returnDeadlineLabel: mockReturnDeadlineLabel(1),
  },
  {
    icon: pill,
    id: "easyen-6",
    name: "이지엔6",
    quantity: 28,
    returnDeadlineLabel: mockReturnDeadlineLabel(1),
  },
  {
    icon: eyeDrops,
    id: "eye-drops",
    name: "인공눈물",
    quantity: 28,
    returnDeadlineLabel: mockReturnDeadlineLabel(0),
  },
  {
    icon: pill,
    id: "cold-medicine",
    name: "종합감기약",
    quantity: 28,
    returnDeadlineLabel: mockReturnDeadlineLabel(1),
  },
  {
    icon: usbCCharger,
    id: "usb-c-cable",
    name: "케이블(C to C)",
    quantity: 28,
    returnDeadlineLabel: mockReturnDeadlineLabel(0),
  },
  {
    icon: pill,
    id: "tylenol",
    name: "타이레놀",
    quantity: 28,
    returnDeadlineLabel: mockReturnDeadlineLabel(2),
  },
  {
    icon: painReliefPatch,
    id: "pain-relief-patch",
    name: "파스",
    quantity: 28,
    returnDeadlineLabel: mockReturnDeadlineLabel(2),
  },
  {
    icon: ointment,
    id: "ointment",
    name: "후시딘",
    quantity: 28,
    returnDeadlineLabel: mockReturnDeadlineLabel(1),
  },
  {
    icon: eightPinCharger,
    id: "8pin-charger",
    name: "8핀 충전기",
    quantity: 28,
    returnDeadlineLabel: mockReturnDeadlineLabel(0),
  },
];
