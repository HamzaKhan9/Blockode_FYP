import { degToRad } from "./miscUtils";

export type Point = {
  x: number;
  y: number;
};

export function distance(p1: Point, p2: Point) {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

export function getQuadrilateralShape(points: Point[]) {
  const [p1, p2, p3] = points;

  const slope = (p2.y - p1.y) / (p2.x - p1.x);
  const angle = Math.atan(slope) * (180 / Math.PI);
  const height = distance(p1, p3);
  const width = distance(p1, p2);
  const center: Point = { x: p1.x + width / 2, y: p1.y - height / 2 };

  return {
    angle,
    center,
    width,
    height,
    start: { x: p1.x, y: p3.y },
  };
}

export function getObstacleShape(points: Point[]) {
  const [p1, p2, p3] = points;

  const slope = (p3.y - p1.y) / (p3.x - p1.x);
  const angle = Math.atan(slope) * (180 / Math.PI);
  const height = distance(p1, p2);
  const width = distance(p1, p3);
  const center: Point = { x: p1.x + width / 2, y: p3.y + height / 2 };

  return {
    angle,
    center,
    width,
    height,
    start: { x: p1.x, y: p1.y },
  };
}

function onSegment(p: Point, q: Point, r: Point) {
  if (
    q.x <= Math.max(p.x, r.x) &&
    q.x >= Math.min(p.x, r.x) &&
    q.y <= Math.max(p.y, r.y) &&
    q.y >= Math.min(p.y, r.y)
  )
    return true;

  return false;
}

// To find orientation of ordered triplet (p, q, r).
// The function returns following values
// 0 --> p, q and r are collinear
// 1 --> Clockwise
// 2 --> Counterclockwise
function orientation(p: Point, q: Point, r: Point) {
  // See https://www.geeksforgeeks.org/orientation-3-ordered-points/
  // for details of below formula.
  let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

  if (val == 0) return 0; // collinear

  return val > 0 ? 1 : 2; // clock or counterclock wise
}

function doIntersect(p1: Point, q1: Point, p2: Point, q2: Point) {
  // Find the four orientations needed for general and
  // special cases
  let o1 = orientation(p1, q1, p2);
  let o2 = orientation(p1, q1, q2);
  let o3 = orientation(p2, q2, p1);
  let o4 = orientation(p2, q2, q1);

  // General case
  if (o1 != o2 && o3 != o4) return true;

  // Special Cases
  // p1, q1 and p2 are collinear and p2 lies on segment p1q1
  if (o1 == 0 && onSegment(p1, p2, q1)) return true;

  // p1, q1 and q2 are collinear and q2 lies on segment p1q1
  if (o2 == 0 && onSegment(p1, q2, q1)) return true;

  // p2, q2 and p1 are collinear and p1 lies on segment p2q2
  if (o3 == 0 && onSegment(p2, p1, q2)) return true;

  // p2, q2 and q1 are collinear and q1 lies on segment p2q2
  if (o4 == 0 && onSegment(p2, q1, q2)) return true;

  return false; // Doesn't fall in any of the above cases
}

// returns set of lines that make up the quad
function getQuadLines(quad: Point[]) {
  const [p1, p2, p3, p4] = quad;
  return [
    [p1, p2],
    [p2, p4],
    [p3, p4],
    [p1, p3],
  ];
}

// returns true if the two quads are colliding
export function areBoxesColliding(quad1: Point[], quad2: Point[]) {
  const lines1 = getQuadLines(quad1);
  const lines2 = getQuadLines(quad2);

  for (const line1 of lines1) {
    for (const line2 of lines2) {
      if (doIntersect(line1[0], line1[1], line2[0], line2[1])) {
        return true;
      }
    }
  }

  return false;
}

// Function to rotate a rectangle by a given angle in degrees
export function rotateRectangle(points: Point[], angleDegrees: number) {
  // Calculate the center of the rectangle
  const center = {
    x: (points[0].x + points[3].x) / 2,
    y: (points[0].y + points[3].y) / 2,
  };

  // Convert the angle from degrees to radians
  const angleRadians = (angleDegrees * Math.PI) / 180;

  // Function to rotate a point around the origin
  function rotatePoint(point: Point, angle: number) {
    const x = point.x - center.x;
    const y = point.y - center.y;
    const newX = x * Math.cos(angle) - y * Math.sin(angle);
    const newY = x * Math.sin(angle) + y * Math.cos(angle);
    return {
      x: newX + center.x,
      y: newY + center.y,
    };
  }

  // Rotate all the rectangle's points
  const rotatedPoints = points.map((point) => rotatePoint(point, angleRadians));

  return rotatedPoints;
}

export function translate(point: Point, magnitude: number, angle: number) {
  return {
    x: point.x + magnitude * Math.cos(degToRad(angle)),
    y: point.y + magnitude * Math.sin(degToRad(angle)),
  };
}
