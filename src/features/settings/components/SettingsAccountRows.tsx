import { useSuspenseQuery } from "@tanstack/react-query";

import SettingsRow from "@/features/settings/components/SettingsRow";
import { formatPhoneNumber } from "@/lib/phone";
import { membersQueries } from "@/shared/entities/members/membersQueries";

interface SettingsAccountRowsProps {
  onChangePhone: () => void;
}

// 서버에 값이 없는 항목(이메일 미등록 회원 등)에 대신 보여 주는 문구 — Figma에는 이 상태가 없다
const NOT_REGISTERED_LABEL = "미등록";

// 계정 정보 카드(Figma 3524:152331)의 세 행 — 서버에서 받는 값이라 카드 안쪽만 데이터 컴포넌트로
// 뺀다. 받는 동안은 SettingsScreen의 Suspense가 SettingsAccountRowsSkeleton을 보여준다.
// 카드 껍데기(SettingsSection)와 "계정 정보" 라벨은 데이터와 무관해서 화면이 바로 그린다.
//
// 전화번호는 서버가 숫자만 주므로 Figma 표기(010-1234-5678)대로 하이픈을 넣어 그린다.
// 값이 없어도 행은 그대로 두고 값 자리만 "미등록"으로 채운다 — 카드 높이가 바뀌지 않고,
// 전화번호는 미등록이어도 변경 화면으로 들어가 등록할 수 있다.
function SettingsAccountRows({ onChangePhone }: SettingsAccountRowsProps) {
  const { data: member } = useSuspenseQuery(membersQueries.me());

  return (
    <>
      <SettingsRow label="이름" value={member.name} variant="account" />
      <SettingsRow
        label="이메일"
        value={member.email ?? NOT_REGISTERED_LABEL}
        variant="account"
      />
      <SettingsRow
        label="전화번호"
        onClick={onChangePhone}
        value={
          member.phoneNumber
            ? formatPhoneNumber(member.phoneNumber)
            : NOT_REGISTERED_LABEL
        }
        variant="account"
      />
    </>
  );
}

export default SettingsAccountRows;
