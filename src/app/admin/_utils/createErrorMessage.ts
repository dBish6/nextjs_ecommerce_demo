const createErrorMessage = (input: HTMLInputElement) => {
  const container = input.parentElement;

  const errorMsg = document.createElement("span");
  errorMsg.textContent = input.validationMessage;
  errorMsg.setAttribute("aria-live", "assertive");
  errorMsg.id = "formError";
  errorMsg.className = "text-xs font-medium text-red-500";

  container?.appendChild(errorMsg);
};

export default createErrorMessage;
