// Figma: 행사 신청 문항 카드 — Interest Field / Attendance Field / Question Field
// (nodeId 1658:183407, 1658:183418, 1658:183424), 기타 입력칸은 Other Option (nodeId 1658:183954)
import {
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  TextArea,
  TextAreaContent,
  Typography,
} from "@wanteddev/wds";
import { useId } from "react";

import {
  EVENTS_OTHER_MAX_LENGTH,
  EVENTS_OTHER_OPTION_LABEL,
  EVENTS_TEXT_MAX_LENGTH,
  type EventsAnswer,
  type EventsChoiceAnswer,
  type EventsQuestion,
} from "@/features/events/constants/eventsApplication";

interface EventsQuestionFieldProps {
  question: EventsQuestion;
  answer: EventsAnswer | undefined;
  onAnswerChange: (answer: EventsAnswer) => void;
}

const EMPTY_CHOICE_ANSWER: EventsChoiceAnswer = { otherText: "", selected: [] };

function toChoiceAnswer(answer: EventsAnswer | undefined): EventsChoiceAnswer {
  return typeof answer === "object" ? answer : EMPTY_CHOICE_ANSWER;
}

// 문항 유형(question.type)별로 컴포넌트를 나누지 않고 이 컴포넌트 하나가 유형에 맞는 입력을 그린다.
// 제목 옆 "*"는 WDS `Label required`를 쓰지 않았다 — Figma의 Field Label은 WDS 인스턴스가 아닌
// 로컬 텍스트이고, `*`도 Body 1/Bold(16px)라 Label이 그리는 label1/medium(14px)과 크기가 다르다.
function EventsQuestionField({
  question,
  answer,
  onAnswerChange,
}: EventsQuestionFieldProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const otherId = `${id}-other`;
  const choiceAnswer = toChoiceAnswer(answer);
  const isOtherChecked = choiceAnswer.selected.includes(
    EVENTS_OTHER_OPTION_LABEL,
  );

  const toggleOption = (option: string, checked: boolean) => {
    const selected = checked
      ? [...choiceAnswer.selected, option]
      : choiceAnswer.selected.filter((value) => value !== option);
    // 기타를 해제하면 입력해둔 내용도 같이 비운다
    const otherText =
      option === EVENTS_OTHER_OPTION_LABEL && !checked
        ? ""
        : choiceAnswer.otherText;
    return onAnswerChange({ otherText, selected });
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-background-normal p-4">
      <div className="flex items-center gap-1">
        <Typography
          as="p"
          color="semantic.label.normal"
          id={titleId}
          variant="body2"
          weight="bold"
        >
          {question.title}
          {/* 입력들이 이 제목을 aria-labelledby로 참조하므로, 필수 여부는 보이는 "*"(aria-hidden) 대신
              여기 숨김 텍스트로 스크린리더에 전달한다 */}
          {question.isRequired && <span className="sr-only"> (필수)</span>}
        </Typography>
        {question.isRequired && (
          <Typography
            aria-hidden
            as="span"
            color="semantic.status.negative"
            variant="body1"
            weight="bold"
          >
            *
          </Typography>
        )}
      </div>

      {question.type === "multipleChoice" && (
        // fieldset 기본 min-inline-size(min-content)가 긴 선택지에서 카드 밖으로 넘치지 않게 min-w-0
        <fieldset
          aria-labelledby={titleId}
          className="flex min-w-0 flex-col gap-3"
        >
          {question.options.map((option, index) => {
            const optionId = `${id}-option-${index}`;
            return (
              <div className="flex items-start gap-2" key={option}>
                <Checkbox
                  checked={choiceAnswer.selected.includes(option)}
                  id={optionId}
                  onCheckedChange={(checked) => toggleOption(option, checked)}
                  size="small"
                />
                <label className="flex-1" htmlFor={optionId}>
                  <Typography
                    as="span"
                    color="semantic.label.normal"
                    variant="label1"
                    weight="regular"
                  >
                    {option}
                  </Typography>
                </label>
              </div>
            );
          })}

          {question.hasOtherOption && (
            // Figma Other Option: 체크박스와 입력칸 사이 4px, 입력 글자와 밑줄 사이 2px
            <div className="flex flex-col gap-1">
              <div className="flex items-start gap-2">
                <Checkbox
                  checked={isOtherChecked}
                  id={otherId}
                  onCheckedChange={(checked) =>
                    toggleOption(EVENTS_OTHER_OPTION_LABEL, checked)
                  }
                  size="small"
                />
                <label className="flex-1" htmlFor={otherId}>
                  <Typography
                    as="span"
                    color="semantic.label.normal"
                    variant="label1"
                    weight="regular"
                  >
                    {EVENTS_OTHER_OPTION_LABEL}
                  </Typography>
                </label>
              </div>
              {isOtherChecked && (
                // <input>이라 Typography로 감쌀 수 없는 자리 — Figma "Label 1/Normal - Regular"(14px)와
                // 밑줄(Primary/Normal 0.7px)을 그대로 옮긴 값이다.
                <input
                  aria-label={`${question.title} 기타 내용`}
                  className="w-full border-primary border-b-[0.7px] pb-0.5 text-[14px] text-label-normal leading-[1.571] outline-none placeholder:text-label-assistive"
                  maxLength={EVENTS_OTHER_MAX_LENGTH}
                  onChange={(event) =>
                    onAnswerChange({
                      otherText: event.target.value,
                      selected: choiceAnswer.selected,
                    })
                  }
                  placeholder="기타 내용을 입력해 주세요."
                  value={choiceAnswer.otherText}
                />
              )}
            </div>
          )}
        </fieldset>
      )}

      {question.type === "singleChoice" && (
        <RadioGroup
          aria-labelledby={titleId}
          onValueChange={onAnswerChange}
          required={question.isRequired}
          value={typeof answer === "string" ? answer : ""}
        >
          {/* RadioGroup 자체 레이아웃 스타일에 기대지 않고 Figma 간격(12px)을 여기서 직접 준다 */}
          <div className="flex flex-col gap-3">
            {question.options.map((option, index) => {
              const optionId = `${id}-option-${index}`;
              return (
                <div className="flex items-start gap-2" key={option}>
                  <RadioGroupItem id={optionId} size="small" value={option} />
                  <label className="flex-1" htmlFor={optionId}>
                    <Typography
                      as="span"
                      color="semantic.label.normal"
                      variant="label1"
                      weight="regular"
                    >
                      {option}
                    </Typography>
                  </label>
                </div>
              );
            })}
          </div>
        </RadioGroup>
      )}

      {(question.type === "shortAnswer" || question.type === "longAnswer") && (
        // Figma 기본 높이가 한 줄(76px)이라 minRows=1 — 입력이 늘면 TextArea가 알아서 칸을 키운다.
        // width 기본값이 카드 폭을 채우지 않아서 Figma(카드 안쪽 전체 폭)에 맞게 100%로 준다.
        <TextArea
          aria-labelledby={titleId}
          aria-required={question.isRequired}
          maxLength={EVENTS_TEXT_MAX_LENGTH[question.type]}
          minRows={1}
          onChange={(event) => onAnswerChange(event.target.value)}
          placeholder="메시지를 입력해 주세요."
          trailingContent={
            <TextAreaContent variant="characterCounter">
              {EVENTS_TEXT_MAX_LENGTH[question.type]}
            </TextAreaContent>
          }
          value={typeof answer === "string" ? answer : ""}
          width="100%"
        />
      )}
    </div>
  );
}

export default EventsQuestionField;
