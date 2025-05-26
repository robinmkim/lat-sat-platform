declare module "@ckeditor/ckeditor5-build-classic" {
  const ClassicEditor: any;
  export = ClassicEditor;
}

declare module "@ckeditor/ckeditor5-react" {
  import { ComponentType } from "react";
  const CKEditor: ComponentType<any>;
  export { CKEditor };
}
