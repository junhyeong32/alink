import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import uploadFile from "../../utility/uploadFile";
import { useRef, useMemo } from "react";

// const QuillNoSSRWrapper = dynamic(() => import("react-quill"), {
//   ssr: false,
//   loading: () => <p>Loading ...</p>,
// });

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    return function comp({ forwardedRef, ...props }) {
      return <RQ ref={forwardedRef} {...props} />;
    };
  },
  { ssr: false }
);

/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];

export default function Editor(props) {
  const quillRef = useRef(null);

  const imageHandler = async () => {
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      var file = input.files[0];
      // var formData = new FormData();

      // formData.append("image", file);

      // var fileName = file.name;

      const res = await uploadFile(file);

      console.log(res);

      if (res) {
        const range = quillRef.current.getEditorSelection();
        quillRef.current
          .getEditor()
          .insertEmbed(range?.index || null, "image", res);
        quillRef.current.getEditor().setSelection(range?.index + 1);
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        // { container: "#toolbar" },
        [{ font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ color: [] }],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        [
          { align: "" },
          { align: "center" },
          { align: "right" },
          { align: "justify" },
        ],
        ["link", "image", "video"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },

    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  }));

  return (
    <ReactQuill
      forwardedRef={quillRef}
      modules={modules}
      theme="snow"
      {...props}
    />
  );
}
