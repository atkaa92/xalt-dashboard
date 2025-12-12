import type { ContainerDimensions, OverlayStyle } from '@/types';
import { onUnmounted, reactive, ref, type Ref } from 'vue';

export function useDraggableResizable(
  initialStyle: OverlayStyle,
  containerDimensions: ContainerDimensions,
  isImage: Ref<boolean> | boolean,
) {
  const isDragging = ref(false);
  const isResizing = ref(false);
  let startX: number;
  let startY: number;
  let initialLeft: number;
  let initialTop: number;
  let initialWidth: number;
  let initialHeight: number;
  let activeResizeHandle: string = '';
  const style: OverlayStyle = reactive<OverlayStyle>({ ...initialStyle });
  const minSizePercent = 5;

  const updateStyle = (updates: Partial<OverlayStyle>) => {
    Object.assign(style, updates);
  };

  const getIsImage = (): boolean => {
    return typeof isImage === 'boolean' ? isImage : isImage.value;
  };

  // --- DRAG LOGIC ---
  const startDrag = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    if (isResizing.value) return;

    isDragging.value = true;

    const clientX = ('touches' in event ? event?.touches[0]?.clientX : event.clientX) ?? 0;
    const clientY = ('touches' in event ? event?.touches[0]?.clientY : event.clientY) ?? 0;

    startX = clientX;
    startY = clientY;

    // Convert current percentage styles to pixels
    initialLeft = (parseFloat(style.left) / 100) * containerDimensions.width;
    initialTop = (parseFloat(style.top) / 100) * containerDimensions.height;

    document.addEventListener('mousemove', onDrag as EventListener);
    document.addEventListener('mouseup', stopDrag as EventListener);
    document.addEventListener('touchmove', onDrag as EventListener, { passive: false });
    document.addEventListener('touchend', stopDrag as EventListener);
  };

  const onDrag = (event: MouseEvent | TouchEvent) => {
    if (!isDragging.value || containerDimensions.width === 0) return;

    const clientX = ('touches' in event ? event.touches[0]?.clientX : event.clientX) ?? 0;
    const clientY = ('touches' in event ? event.touches[0]?.clientY : event.clientY) ?? 0;

    const deltaX = clientX - startX;
    const deltaY = clientY - startY;

    let newLeftPx = initialLeft + deltaX;
    let newTopPx = initialTop + deltaY;

    // Clamp position within container boundaries
    const overlayWidthPx = (parseFloat(style.width) / 100) * containerDimensions.width;

    const currentHeightPercent = getIsImage()
      ? overlayWidthPx * (9 / 16) // Aspect ratio estimation
      : (parseFloat(style.height as string) / 100) * containerDimensions.height;

    newLeftPx = Math.max(0, Math.min(newLeftPx, containerDimensions.width - overlayWidthPx));
    newTopPx = Math.max(0, Math.min(newTopPx, containerDimensions.height - currentHeightPercent));

    // Convert back to percentages and update
    updateStyle({
      left: `${((newLeftPx / containerDimensions.width) * 100).toFixed(2)}%`,
      top: `${((newTopPx / containerDimensions.height) * 100).toFixed(2)}%`,
    });
  };

  const stopDrag = () => {
    isDragging.value = false;
    document.removeEventListener('mousemove', onDrag as EventListener);
    document.removeEventListener('mouseup', stopDrag as EventListener);
    document.removeEventListener('touchmove', onDrag as EventListener);
    document.removeEventListener('touchend', stopDrag as EventListener);
  };

  // --- RESIZE LOGIC ---
  const startResize = (event: MouseEvent | TouchEvent, handle: string) => {
    event.stopPropagation();
    event.preventDefault();

    if (containerDimensions.width === 0) return;

    isResizing.value = true;
    activeResizeHandle = handle;

    const clientX = ('touches' in event ? event.touches[0]?.clientX : event.clientX) ?? 0;
    const clientY = ('touches' in event ? event.touches[0]?.clientY : event.clientY) ?? 0;

    startX = clientX;
    startY = clientY;

    // Get current bounds in pixels
    initialLeft = (parseFloat(style.left) / 100) * containerDimensions.width;
    initialTop = (parseFloat(style.top) / 100) * containerDimensions.height;
    initialWidth = (parseFloat(style.width) / 100) * containerDimensions.width;
    initialHeight = getIsImage()
      ? initialWidth * (9 / 16)
      : (parseFloat(style.height as string) / 100) * containerDimensions.height;

    document.addEventListener('mousemove', onResize as EventListener);
    document.addEventListener('mouseup', stopResize as EventListener);
    document.addEventListener('touchmove', onResize as EventListener, { passive: false });
    document.addEventListener('touchend', stopResize as EventListener);
  };

  const onResize = (event: MouseEvent | TouchEvent) => {
    if (!isResizing.value || containerDimensions.width === 0) return;

    const clientX = ('touches' in event ? event.touches[0]?.clientX : event.clientX) ?? 0;
    const clientY = ('touches' in event ? event.touches[0]?.clientY : event.clientY) ?? 0;

    const deltaX = clientX - startX;
    const deltaY = clientY - startY;

    let newLeftPx = initialLeft;
    let newTopPx = initialTop;
    let newWidthPx = initialWidth;
    let newHeightPx = initialHeight;

    const handle = activeResizeHandle;
    const aspectRatio = initialWidth / initialHeight;
    const isCurrentImg = getIsImage();
    const minWidthPx = (minSizePercent / 100) * containerDimensions.width;
    const minHeightPx = (minSizePercent / 100) * containerDimensions.height;

    // Calculate size changes
    if (handle.includes('r')) {
      newWidthPx = initialWidth + deltaX;
    }
    if (handle.includes('l')) {
      newWidthPx = initialWidth - deltaX;
    }
    if (handle.includes('b') && !isCurrentImg) {
      newHeightPx = initialHeight + deltaY;
    }
    if (handle.includes('t') && !isCurrentImg) {
      newHeightPx = initialHeight - deltaY;
    }

    // Enforce Minimum Size
    newWidthPx = Math.max(minWidthPx, newWidthPx);
    newHeightPx = Math.max(minHeightPx, newHeightPx);

    // Aspect Ratio Lock for Images (and corner resize on non-images)
    if (isCurrentImg || handle.length === 2) {
      newHeightPx = newWidthPx / aspectRatio;
    }

    // Update Position for Left/Top Resizing
    if (handle.includes('l')) {
      newLeftPx = initialLeft + (initialWidth - newWidthPx);
    }
    if (handle.includes('t')) {
      newTopPx = initialTop + (initialHeight - newHeightPx);
    }

    // Final Clamping against container bounds
    newLeftPx = Math.max(0, newLeftPx);
    newTopPx = Math.max(0, newTopPx);
    newWidthPx = Math.min(newWidthPx, containerDimensions.width - newLeftPx);
    newHeightPx = Math.min(newHeightPx, containerDimensions.height - newTopPx);

    // Aspect Ratio re-clamping after position clamp
    if (isCurrentImg || handle.length === 2) {
      newHeightPx = newWidthPx / aspectRatio;
    }

    // Final Percentage Conversion
    updateStyle({
      left: `${((newLeftPx / containerDimensions.width) * 100).toFixed(2)}%`,
      top: `${((newTopPx / containerDimensions.height) * 100).toFixed(2)}%`,
      width: `${((newWidthPx / containerDimensions.width) * 100).toFixed(2)}%`,
      height: isCurrentImg
        ? 'auto'
        : `${((newHeightPx / containerDimensions.height) * 100).toFixed(2)}%`,
    });
  };

  const stopResize = () => {
    isResizing.value = false;
    document.removeEventListener('mousemove', onResize as EventListener);
    document.removeEventListener('mouseup', stopResize as EventListener);
    document.removeEventListener('touchmove', onResize as EventListener);
    document.removeEventListener('touchend', stopResize as EventListener);
  };

  onUnmounted(() => {
    stopDrag();
    stopResize();
  });

  return {
    style,
    isDragging,
    isResizing,
    startDrag,
    startResize,
  };
}
