export default function reduceImageSize(url, options) {
  if (!url) return null;
  if (!options) options = { w: 960, q: 100 };
  return `https://afg.kr/cdn-cgi/image/${Object.keys(options)
    .map((key) => {
      return `${key}=${options[key]}`;
    })
    .join(",")}/${url}`;
}
