import { FC } from "preact/compat";

export const NotFound: FC = () => {
  return (
    <div class="hero bg-base-200 min-h-screen">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">
            <span class="font-fancy">Not!</span>Found
          </h1>
        </div>
      </div>
    </div>
  );
};
