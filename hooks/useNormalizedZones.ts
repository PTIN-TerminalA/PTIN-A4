type Position = [number, number];

export type Zone = {
  name: string;
  type: string;
  positions: [number, number][];
  info: string;
};

export function normalizeRotatedZones(zones: Zone[]): Zone[] {
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;

  // Determine bounds
  zones.forEach((zone) => {
    zone.positions.forEach(([x, y]) => {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    });
  });

  const center = 0.5;
  return zones.map((zone) => ({
    ...zone,
    positions: zone.positions.map(([x, y]) => {
      const xNorm = (x - minX) / (maxX - minX);
      const yNorm = (y - minY) / (maxY - minY);

      const xCentered = xNorm - center;
      const yCentered = yNorm - center;

      const xRot = yCentered;
      const yRot = -xCentered;

      const xFinal = xRot + center;
      const yFinal = yRot + center;

      return [parseFloat(xFinal.toFixed(4)), parseFloat(yFinal.toFixed(4))];
    }),
  }));
}
export function normalizeZones(zones: Zone[]): Zone[] {
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;

  // Determine bounds
  zones.forEach((zone) => {
    zone.positions.forEach(([x, y]) => {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    });
  });

  // Avoid divide-by-zero
  const width = maxX - minX || 1;
  const height = maxY - minY || 1;

  return zones.map((zone) => ({
    ...zone,
    positions: zone.positions.map(([x, y]) => {
      const xNorm = (x - minX) / width;
      const yNorm = (y - minY) / height;
      return [parseFloat(xNorm.toFixed(4)), parseFloat(yNorm.toFixed(4))];
    }),
  }));
}
