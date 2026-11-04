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

import { openExternalLink } from "@/lib/openExternalLink";
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
// 두지 않는다 — 형식이 캡션("PDF")에 이미 나오고, 빼야 긴 파일명이 덜 잘린다. 서버가 파일 크기를 주지 않아서
// 캡션에는 형식만 쓴다.
// 다운로드 버튼을 누르면 `ListCell`이 행 어디를 눌러도 그 버튼을 대신 눌러 준다(ListCell 안의 첫 링크·버튼을
// 클릭으로 넘기는 WDS 동작). 파일 주소는 스토리지라 앱과 출처가 달라서 `<a download>`가 먹지 않고 지금 탭이
// 파일로 넘어가 앱을 벗어난다 — openExternalLink로 새 탭에서 연다(앱 WebView 처리도 거기서 한곳에서 바꾼다).
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
              const extension = getExtension(attachment.fileName);

              return (
                <ListCell
                  alignItems="center"
                  ellipsis
                  key={attachment.fileId}
                  textProps={{
                    caption: extension ? extension.toUpperCase() : undefined,
                    captionProps: { variant: "caption1", weight: "regular" },
                    variant: "label1",
                    weight: "medium",
                  }}
                  trailingContent={
                    <ListCellContent variant="icon-button">
                      <IconButton
                        aria-label={`${attachment.fileName} 내려받기`}
                        onClick={() => openExternalLink(attachment.fileUrl)}
                      >
                        <IconDownload />
                      </IconButton>
                    </ListCellContent>
                  }
                  verticalPadding="small"
                >
                  {attachment.fileName}
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
