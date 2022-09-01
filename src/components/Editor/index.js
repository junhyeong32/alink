import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import uploadFile from "../../utility/uploadFile";

const QuillNoSSRWrapper = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

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
  };
};

const modules = {
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
};
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
  return <QuillNoSSRWrapper modules={modules} theme="snow" {...props} />;
}
