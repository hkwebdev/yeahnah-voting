export const LoadingOverlay = () => {
  return (
    <div class="z-10 absolute inset-0 flex items-center justify-center bg-base-200 pointer-events-none w-full h-full">
      <span class="loading loading-ball loading-xl"></span>
    </div>
  );
};
