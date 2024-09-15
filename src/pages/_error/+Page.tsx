import { Show } from "solid-js";
import { usePageContext } from "vike-solid/usePageContext";

export default function Page() {
  const { is404, ...content } = usePageContext();

  return (
    <Show
      when={is404}
      fallback={
        <>
          <h1>500 Internal Server Error</h1>
          <p>Something went wrong. Boop</p>
          <p>{`${content.data}`}</p>
        </>
      }
    >
      <h1>404 Page Not Found</h1>
      <p>This page could not be found.</p>
      <p>{`${content.data}`}</p>
    </Show>
  );
}
