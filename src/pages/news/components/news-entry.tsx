import type { ComponentProps, ValidComponent } from "solid-js";

type NewsEntryProps<T extends ValidComponent = "article"> = ComponentProps<T>;

const NewsEntry = (props: NewsEntryProps) => {
  return (
    <article class="not-prose flex flex-col">
      <div
        data-orientation="horizontal"
        class="h-[1px] w-full shrink-0 bg-gray-200"
      />
      <div class="mx-auto my-4 flex w-full flex-col items-start gap-4 md:my-8 md:flex-row md:gap-10">
        <div class="w-40 md:sticky md:top-20">
          <p class="text-gray-700 text-sm">04/11/2024</p>
        </div>
        <div class="flex w-full flex-col justify-between gap-8 lg:mr-16">
          <div
            class="relative h-fit max-h-[400px] w-fit max-w-full overflow-hidden rounded-lg shadow-[0px_0px_8px_rgba(0,0,0,0.1)]"
            style="aspect-ratio:2692/1680"
          >
            Video
          </div>
          <h2 class="font-bold text-2xl text-gray-900">
            Responsive design preview
          </h2>
          <div class="prose text-gray-600 text-sm">
            <p>Added device previews and arbitrary resizing.</p>
          </div>
        </div>
      </div>
    </article>
  );
};
