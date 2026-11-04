import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AccordionSummaryContent,
  Divider,
  IconButton,
  List,
  ListCell,
  ListCellContent,
} from "@wanteddev/wds";
import { IconAttachment, IconDownload } from "@wanteddev/wds-icon";

import { formatFileSize } from "@/features/notices/utils/formatFileSize";
import type { NoticeAttachment } from "@/shared/entities/notices/noticesTypes";

function getExtension(name: string) {
  const dotIndex = name.lastIndexOf(".");
  return dotIndex === -1 ? "" : name.slice(dotIndex + 1).toLowerCase();
}

interface NoticesAttachmentAccordionProps {
  attachments: NoticeAttachment[];
}

// 공지 상세 제목 아래 첨부파일 — Figma에 디자인이 없어서 WDS 조합으로만 만들었다.
// 본문 아래에 두면 긴 공지에서 끝까지 내리지 않는 사람은 첨부파일이 있는지 모르고, 펼쳐 둔 채
// 본문 위에 두면 읽기를 가로막아서, 제목 아래에 접힌 한 줄(WDS `Accordion`)로 두고 누르면 펼친다.
// 파일 행은 WDS `ListCell`이고, 뒤에 `icon-button` + `IconDownload`를 둔다. 앞에 파일 종류 아이콘은
// 두지 않는다 — 형식이 캡션("PDF · 1.2MB")에 이미 나오고, 빼야 긴 파일명이 덜 잘린다.
// 다운로드 버튼이 `<a download>`라서 `ListCell`이 행 어디를 눌러도 그 링크를 대신 눌러 준다
// (ListCell 안의 첫 링크·버튼을 클릭으로 넘기는 WDS 동작).
// `download` 속성은 같은 출처 주소에서만 저장 이름이 먹고, 앱 WebView는 내려받기를 따로 처리해야
// 할 수 있다 — 실 API·앱 연결 때 openExternalLink처럼 한곳에서 갈아 끼운다.
function NoticesAttachmentAccordion({
  attachments,
}: NoticesAttachmentAccordionProps) {
  return (
    <div>
      <Divider color="semantic.line.normal.alternative" />
      <Accordion>
        <AccordionSummary
          leadingContent={
            <AccordionSummaryContent variant="icon">
              <IconAttachment />
            </AccordionSummaryContent>
          }
          textProps={{ variant: "label1", weight: "medium" }}
          verticalPadding="medium"
        >
          첨부파일 {attachments.length}
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {attachments.map((attachment) => {
              const extension = getExtension(attachment.name);
              const size = formatFileSize(attachment.size);

              return (
                <ListCell
                  alignItems="center"
                  ellipsis
                  key={attachment.id}
                  textProps={{
                    caption: extension
                      ? `${extension.toUpperCase()} · ${size}`
                      : size,
                    captionProps: { variant: "caption1", weight: "regular" },
                    variant: "label1",
                    weight: "medium",
                  }}
                  trailingContent={
                    <ListCellContent variant="icon-button">
                      <IconButton
                        aria-label={`${attachment.name} 내려받기`}
                        as="a"
                        download={attachment.name}
                        href={attachment.url}
                      >
                        <IconDownload />
                      </IconButton>
                    </ListCellContent>
                  }
                  verticalPadding="small"
                >
                  {attachment.name}
                </ListCell>
              );
            })}
          </List>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default NoticesAttachmentAccordion;
