declare module "html2pdf.js" {
  interface Html2PdfOptions {
    margin?: number | [number, number, number, number];
    filename?: string;
    image?: {
      type?: "jpeg" | "png" | "webp";
      quality?: number;
    };
    html2canvas?: {
      scale?: number;
      backgroundColor?: string;
      useCORS?: boolean;
      allowTaint?: boolean;
      logging?: boolean;
      debug?: boolean;
      width?: number;
      height?: number;
      scrollX?: number;
      scrollY?: number;
      x?: number;
      y?: number;
    };
    jsPDF?: {
      unit?: "pt" | "mm" | "cm" | "in";
      format?: "a4" | "letter" | "legal" | [number, number];
      orientation?: "portrait" | "landscape";
      compress?: boolean;
    };
    pagebreak?: {
      mode?: string | string[];
      before?: string | string[];
      after?: string | string[];
      avoid?: string | string[];
    };
  }

  interface Html2PdfWorker {
    from(element: HTMLElement | string): Html2PdfWorker;
    to(target: string): Html2PdfWorker;
    set(options: Html2PdfOptions): Html2PdfWorker;
    save(filename?: string): Promise<void>;
    outputPdf(type?: string): Promise<any>;
    then(
      onFulfilled?: (value: any) => any,
      onRejected?: (reason: any) => any,
    ): Promise<any>;
    catch(onRejected?: (reason: any) => any): Promise<any>;
  }

  function html2pdf(): Html2PdfWorker;
  function html2pdf(
    element: HTMLElement,
    options?: Html2PdfOptions,
  ): Promise<void>;

  namespace html2pdf {
    class Worker implements Html2PdfWorker {
      from(element: HTMLElement | string): Html2PdfWorker;
      to(target: string): Html2PdfWorker;
      set(options: Html2PdfOptions): Html2PdfWorker;
      save(filename?: string): Promise<void>;
      outputPdf(type?: string): Promise<any>;
      // biome-ignore lint/suspicious/noThenProperty: <this is just a typedef>
      then(
        onFulfilled?: (value: any) => any,
        onRejected?: (reason: any) => any,
      ): Promise<any>;
      catch(onRejected?: (reason: any) => any): Promise<any>;
    }
  }

  export = html2pdf;
}
