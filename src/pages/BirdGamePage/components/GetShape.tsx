import { useEffect, useState } from "react";
import {
  getObstacleShape,
  getQuadrilateralShape,
} from "../../../utils/geometry";
import planeImage from "../../../assets/images/birdImages/plane.png";
import airportImage from "../../../assets/images/birdImages/airport.png";
import passengerImage from "../../../assets/images/birdImages/passenger-brown.png";
import brickImage from "../../../assets/images/birdImages/brick.png";

export const GetShape = ({ cordinates, object = "obstacle" }: any) => {
  let [shape, setShape] = useState<any>(null);

  useEffect(() => {
    let shapeDetails =
      object === "obstacle"
        ? getObstacleShape(cordinates)
        : getQuadrilateralShape(cordinates);
    setShape(shapeDetails);
  }, []);

  return shape ? (
    <div
      className="absolute"
      style={
        object !== "obstacle"
          ? {
              left: shape.start.x,
              bottom: shape.start.y,
              transformOrigin: "top left",
              width: shape.width,
              height: shape.height,
              transform: `rotate(${shape.angle}deg)`,
              objectFit: "fill",
            }
          : {
              left: shape.start.x,
              bottom: shape.start.y,
              transformOrigin: "left bottom",
              width: shape.width,
              height: shape.height,
              transform: `rotate(${-shape.angle}deg)`,
              objectFit: "fill",
              display: "grid",
              placeItems: "center",
            }
      }
    >
      {object !== "obstacle" ? (
        <img
          src={
            object == "plane"
              ? planeImage
              : object == "passenger"
              ? passengerImage
              : airportImage
          }
          width="100%"
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "70%",
            backgroundImage: `url(${brickImage})`,
            backgroundSize: 33,
            backgroundRepeat: "repeat",
          }}
        />
      )}
    </div>
  ) : null;
};
