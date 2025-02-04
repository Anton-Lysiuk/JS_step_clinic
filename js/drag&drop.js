function dragAndDrop(board, container) {
  let isDragging = false;
  let currentCard = null;
  let offsetX = 0;
  let offsetY = 0;
  let originalWidth;

  board.addEventListener("mousedown", (e) => {
    if (
      e.target.classList.contains("show-more") ||
      e.target.classList.contains("edit") ||
      e.target.classList.contains("delete")
    )
      return;

    isDragging = true;
    currentCard = e.target.closest(".card");

    originalWidth = currentCard.offsetWidth;

    if (getComputedStyle(currentCard).position !== "absolute") {
      const rect = currentCard.getBoundingClientRect();
      currentCard.style.position = "absolute";
      currentCard.style.left = `${
        rect.left - container.getBoundingClientRect().left
      }px`;
      currentCard.style.top = `${
        rect.top - container.getBoundingClientRect().top
      }px`;
      currentCard.style.margin = "0";
    }
    currentCard.style.zIndex = 1000;
    currentCard.style.width = `${originalWidth - 20}px`;
    container.style.minHeight = `${100}vh`;
    container.style.height = `${100}%`;

    offsetX = e.clientX - currentCard.offsetLeft;
    offsetY = e.clientY - currentCard.offsetTop;

    currentCard.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging || !currentCard) return;

    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    const boardRect = container.getBoundingClientRect();
    const cardRect = currentCard.getBoundingClientRect();

    x = Math.max(0, Math.min(x, boardRect.width - cardRect.width));
    y = Math.max(0, Math.min(y, boardRect.height - cardRect.height));

    currentCard.style.left = `${x}px`;
    currentCard.style.top = `${y}px`;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    if (currentCard) {
      currentCard.style.cursor = "grab";
      currentCard.style.zIndex = 1;
      currentCard = null;
    }
  });
}

export default dragAndDrop;
