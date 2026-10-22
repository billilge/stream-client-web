import { createUseFunnel } from "@use-funnel/react-router-dom";
import { useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

interface FunnelRouteOption {
  preventScrollReset?: boolean;
  flushSync?: boolean;
  /** 단계 전환에 슬라이드(View Transition)를 켠다 — 화면 이동의 `viewTransition: true`와 같다 */
  viewTransition?: boolean;
}

// `@use-funnel/react-router-dom`이 기본으로 내보내는 useFunnel을 그대로 쓰지 않고 같은 라우터 어댑터를 직접 만든다.
// 기본 어댑터는 View Transition 옵션 이름을 `unstable_viewTransition`으로 넘기는데, React Router 7부터는
// 이 이름이 `viewTransition`으로 바뀌어서(7.18.3 소스에 `unstable_viewTransition`이 없다) 옵션이 무시되고 단계가
// 즉시 바뀐다. 이 파일은 어댑터(createUseFunnel에 넘기는 라우터 함수)를 그대로 옮기고 옵션 이름만 바꿨다 —
// 단계는 `?{id}.step=`, context와 단계 기록은 history.state의 `{id}.context`·`{id}.histories`에 저장된다.
// 라이브러리의 "라우터 직접 만들기" 가이드가 안내하는 방식이다.
export const useFunnel = createUseFunnel<FunnelRouteOption>(
  ({ id, initialState }) => {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const stepName = `${id}.step`;
    const contextName = `${id}.context`;
    const historiesName = `${id}.histories`;

    const currentStep = searchParams.get(stepName);
    const currentContext = location.state?.[contextName];
    const currentState = useMemo(
      () =>
        currentStep != null && currentContext != null
          ? { context: currentContext, step: currentStep }
          : initialState,
      [currentStep, currentContext, initialState],
    );

    const history = useMemo(() => {
      const histories = location.state?.[historiesName];
      if (Array.isArray(histories) && histories.length > 0) {
        return histories;
      }
      return [currentState];
    }, [location.state, currentState, historiesName]);
    const currentIndex = history.length - 1;

    return useMemo(
      () => ({
        cleanup() {
          const newLocationState = { ...location.state };
          const currentSearchParams = new URLSearchParams(
            window.location.search,
          );
          if (
            !currentSearchParams.has(stepName) ||
            !(contextName in newLocationState) ||
            !(historiesName in newLocationState)
          ) {
            return;
          }
          delete newLocationState[contextName];
          delete newLocationState[historiesName];
          setSearchParams(
            (prev) => {
              prev.delete(stepName);
              return prev;
            },
            { replace: true, state: newLocationState },
          );
        },
        currentIndex,
        go(index: number) {
          navigate(index);
        },
        history,
        push(state, { preventScrollReset, flushSync, viewTransition } = {}) {
          setSearchParams(
            (prev) => {
              prev.set(stepName, state.step);
              return prev;
            },
            {
              flushSync,
              preventScrollReset,
              replace: false,
              state: {
                ...location.state,
                [contextName]: state.context,
                [historiesName]: [...history, state],
              },
              viewTransition,
            },
          );
        },
        replace(state, { preventScrollReset, flushSync, viewTransition } = {}) {
          setSearchParams(
            (prev) => {
              prev.set(stepName, state.step);
              return prev;
            },
            {
              flushSync,
              preventScrollReset,
              replace: true,
              state: {
                ...location.state,
                [contextName]: state.context,
                [historiesName]: [...history.slice(0, currentIndex), state],
              },
              viewTransition,
            },
          );
        },
      }),
      [
        contextName,
        currentIndex,
        history,
        historiesName,
        location.state,
        navigate,
        setSearchParams,
        stepName,
      ],
    );
  },
);
