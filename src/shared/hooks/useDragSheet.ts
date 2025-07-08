import { useState, useRef } from "react";

interface DragSheetOptions {
  canDrag: boolean;
  baseHeight: number;
  expandedHeight?: number;
  minHeight?: number;
  maxHeight?: number;
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
    baseHeight,
    expandedHeight = baseHeight + 300,
    minHeight = 300,
    maxHeight = 800,
    dragSensitivity = 0.7,
    thresholds = { expand: 50, collapse: -50, close: -100 },
    allowCloseWhenNoDrag = false
  } = options;

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<number>(0);

  const dragState = useRef({
    isDragging: false,
    startY: 0,
    currentOffset: 0,
  });

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
    setIsExpanded,
    handlePointerDown,
    close,
  };
};

export default useDragSheet;