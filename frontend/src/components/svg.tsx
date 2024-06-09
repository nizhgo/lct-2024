import React, { HTMLProps } from "react";
import { px } from "../utils/css.ts";

export interface SvgProps
  extends Pick<
    HTMLProps<SVGElement>,
    "style" | "className" | "title" | "disabled"
  > {
  src: string;
  height?: number | string;
  width?: number;
  fill?: string;
  color?: string;
  spin?: boolean;
}

const SvgComponent: React.FC<SvgProps> = ({ src, ...x }) => {
  const width = x.width ? px(x.width) : "fit-content";
  const height =
    typeof x.height === "number" ? px(x.height) : x.height ?? "inherit";
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      {...x}
      src={src}
      style={{
        display: "flex",
        color: x.color ?? "none !important",
        fill: x.fill ?? "none !important",
        minWidth: width,
        minHeight: height,
        width,
        height,
        pointerEvents: x.disabled ? "none" : undefined,
        opacity: x.disabled ? 0.5 : undefined,
        ...x.style,
      }}
    />
  );
};

export const SvgBase: React.FC<SvgProps> = (x) => {
  return <SvgComponent {...x} title={undefined} />;
};

export const Svg = Object.assign(SvgBase, {});
