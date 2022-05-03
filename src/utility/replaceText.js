export default function replaceText(text) {
  if (text)
    return text.split("<br/>")?.map((txt) => (
      <>
        {txt}
        <br />
      </>
    ));
}
