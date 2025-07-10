import { useState, useRef, useEffect } from "react";

interface DragSheetOptions {
  canDrag: boolean;
  baseHeightRatio: number; // 0.3 = 30% of screen height
  expandedHeightRatio?: number; // 0.8 = 80% of screen height
  minHeightRatio?: number; // 0.2 = 20% of screen height
  maxHeightRatio?: number; // 0.95 = 95% of screen height
  dragSensitivity?: number;
  thresholds?: {
    expand: number;
    collapse: number;
    close: number;
  };
  allowCloseWhenNoDrag: boolean;
}

interface DragSheetState {
  isExpanded: boolean;
  isDragging: boolean;
  currentHeight: number;
  screenHeight: number;
}

interface DragSheetActions {
  setIsExpanded: (expanded: boolean) => void;
  handlePointerDown: (e: React.PointerEvent) => void;
  close: () => void;
}

const useDragSheet = (
  options: DragSheetOptions,
  onClose?: () => void
): DragSheetState & DragSheetActions => {
  const {
    canDrag,
    baseHeightRatio,
    expandedHeightRatio = Math.min(baseHeightRatio + 0.4, 0.9), // 기본값: base + 40%
    minHeightRatio = 0.15, // 15%
    maxHeightRatio = 0.95, // 95%
    dragSensitivity = 0.7,
    thresholds = { expand: 50, collapse: -50, close: -100 },
    allowCloseWhenNoDrag = false
  } = options;

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [screenHeight, setScreenHeight] = useState<number>(0);

  const dragState = useRef({
    isDragging: false,
    startY: 0,
    currentOffset: 0,
  });

  // 화면 높이 감지
  useEffect(() => {
    const updateScreenHeight = () => {
      // dvh 우선, 지원하지 않으면 vh 사용
      const height = window.visualViewport?.height || window.innerHeight;
      setScreenHeight(height);
    };

    updateScreenHeight();
    
    // 화면 회전이나 키보드 등으로 인한 높이 변화 감지
    window.addEventListener('resize', updateScreenHeight);
    window.visualViewport?.addEventListener('resize', updateScreenHeight);

    return () => {
      window.removeEventListener('resize', updateScreenHeight);
      window.visualViewport?.removeEventListener('resize', updateScreenHeight);
    };
  }, []);

  // 비율을 픽셀로 변환
  const baseHeight = screenHeight * baseHeightRatio;
  const expandedHeight = screenHeight * expandedHeightRatio;
  const minHeight = screenHeight * minHeightRatio;
  const maxHeight = screenHeight * maxHeightRatio;

  // 높이 계산
  const targetHeight = isExpanded ? expandedHeight : baseHeight;
  const currentHeight = isDragging
    ? (() => {
        const newHeight = targetHeight + dragOffset * dragSensitivity;
        
        // 위로 드래그할 때는 maxHeight까지
        if (dragOffset > 0) {
          return Math.min(maxHeight, newHeight);
        }
        
        // 아래로 드래그할 때는 더 낮게 허용 (닫기 효과)
        return Math.max(minHeight * 0.3, newHeight); // minHeight의 30%까지 허용
      })()
    : targetHeight;

  const startDrag = (clientY: number) => {
    if (!canDrag && !allowCloseWhenNoDrag) return;

    dragState.current = {
      isDragging: true,
      startY: clientY,
      currentOffset: 0,
    };
    setIsDragging(true);
    setDragOffset(0);
  };

  const updateDrag = (clientY: number) => {
    if (!dragState.current.isDragging) return;

    if (!canDrag && !allowCloseWhenNoDrag) return;

    const deltaY = dragState.current.startY - clientY;
    dragState.current.currentOffset = deltaY;
    setDragOffset(deltaY);
  };

  const endDrag = (clientY: number) => {
    if (!dragState.current.isDragging) return;

    // canDrag가 false여도 닫기는 허용
    if (!canDrag && !allowCloseWhenNoDrag) return;

    const deltaY = dragState.current.startY - clientY;

    // 상태 리셋
    dragState.current.isDragging = false;
    setIsDragging(false);
    setDragOffset(0);

    // 임계값에 따른 동작 결정
    if (canDrag && deltaY > thresholds.expand) {
      setIsExpanded(true);
    } else if (canDrag && deltaY < thresholds.collapse && deltaY >= thresholds.close) {
      setIsExpanded(false);
    } else if (deltaY < thresholds.close) {
      onClose?.(); // 리뷰 유무와 관계없이 닫기
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 닫기 허용이나 드래그 가능할 때만 시작
    if (!canDrag && !allowCloseWhenNoDrag) return;

    startDrag(e.clientY);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      updateDrag(moveEvent.clientY);
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      endDrag(upEvent.clientY);
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  const close = () => {
    onClose?.();
  };

  return {
    isExpanded,
    isDragging,
    currentHeight,
    screenHeight,
    setIsExpanded,
    handlePointerDown,
    close,
  };
};

export default useDragSheet;