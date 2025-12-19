declare module "@kunwarji/react-to-pdf" {
  import * as React from "react";

  export interface ReactToPDFProps {
    /**
     * React Ref of the element to be printed.
     * The library expects a RefObject (e.g. from useRef).
     */
    element: React.RefObject<HTMLElement | null>;

    /**
     * Scale of the image. Default is 1.
     */
    scale?: number;

    /**
     * Enable logging. Default is false.
     */
    logging?: boolean;

    /**
     * X-coordinate to crop the image.
     */
    cropX?: number;

    /**
     * Y-coordinate to crop the image.
     */
    cropY?: number;

    /**
     * Background color of the PDF.
     */
    backgroundColor?: string;

    /**
     * Function to modify the cloned element before generating PDF.
     * Useful for hiding elements or changing styles for the PDF.
     */
    modifyFn?: (element: HTMLElement) => void;

    /**
     * Timeout for loading images in ms. Default is 0.
     */
    imageTimeout?: number;

    /**
     * Whether to remove the container after generating PDF. Default is false.
     */
    removeContainer?: boolean;

    /**
     * Window width for html2canvas.
     */
    windowWidth?: number;

    /**
     * Window height for html2canvas.
     */
    windowHeight?: number;

    /**
     * Width of the PDF.
     */
    width?: number;

    /**
     * Height of the PDF.
     */
    height?: number;

    /**
     * Starting coordinates for printing [x, y]. Default is [0, 0].
     */
    printStart?: [number, number];

    /**
     * Image format. 'png', 'PNG', 'webp', 'WEBP', 'jpeg', 'JPEG'.
     */
    format?: string;

    /**
     * Render prop function that receives the function to generate PDF.
     */
    children: (toPdf: () => void) => React.ReactNode;

    /**
     * Name of the generated PDF file. Default is 'PDF_FILE'.
     */
    fileName?: string;

    /**
     * Compression method. 'NONE', 'FAST', 'SLOW'.
     */
    compression?: string;
  }

  const ReactToPDF: React.FC<ReactToPDFProps>;
  export default ReactToPDF;
}
