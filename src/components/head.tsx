import { usePageContext } from "vike-solid/usePageContext";

export default function DefaultHead() {
  const { urlParsed } = usePageContext();

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        name="description"
        content="Track the status of mask bans across the US."
      />
      <link rel="icon" href={`${urlParsed.origin}/logo.svg`} />
    </>
  );
}
