import { Image } from "react-konva";

import useImage from "use-image";

interface canvasImageProps {
  width: number;
  height: number;
  imageLink: string;
}

export const CanvasImage = ({ height, width, imageLink }: canvasImageProps) => {
  const [image] = useImage(imageLink);
  return <Image image={image} width={width} height={height} x={0} y={0} />;
};
