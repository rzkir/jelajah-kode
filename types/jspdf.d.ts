declare module "jspdf" {
  export class jsPDF {
    constructor(
      orientation?: string,
      unit?: string,
      format?: string | string[]
    );
    internal: {
      pageSize: {
        getWidth(): number;
        getHeight(): number;
      };
    };
    setFont(fontName: string, fontStyle?: string): this;
    setFontSize(size: number): this;
    setTextColor(r: number, g: number, b: number, a?: number): this;
    setFillColor(r: number, g: number, b: number): this;
    setDrawColor(r: number, g: number, b: number): this;
    setLineWidth(width: number): this;
    text(
      text: string,
      x: number,
      y: number,
      options?: { align?: "left" | "right" | "center" }
    ): this;
    rect(
      x: number,
      y: number,
      w: number,
      h: number,
      style?: "S" | "F" | "FD" | "DF"
    ): this;
    roundedRect(
      x: number,
      y: number,
      w: number,
      h: number,
      rx: number,
      ry: number,
      style?: "S" | "F" | "FD" | "DF"
    ): this;
    circle(
      x: number,
      y: number,
      r: number,
      style?: "S" | "F" | "FD" | "DF"
    ): this;
    line(x1: number, y1: number, x2: number, y2: number): this;
    addImage(
      imageData: string,
      format: string,
      x: number,
      y: number,
      width: number,
      height: number
    ): this;
    save(filename: string): void;
  }
}
