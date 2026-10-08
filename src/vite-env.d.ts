/// <reference types="vite/client" />

// `vite/client`의 ImportMetaEnv는 인덱스 시그니처라 오타가 타입 검사에 안 걸린다.
// 우리가 쓰는 환경 변수만 여기에 적어서 이름을 고정한다.
interface ImportMetaEnv {
  /** 토스 송금 딥링크에 넣을 은행명(예: 국민). 계좌 정보라 저장소에 커밋하지 않는다. */
  readonly VITE_FEE_TOSS_BANK?: string;
  /** 토스 송금 딥링크에 넣을 계좌번호(하이픈 없이). 계좌 정보라 저장소에 커밋하지 않는다. */
  readonly VITE_FEE_TOSS_ACCOUNT_NO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
