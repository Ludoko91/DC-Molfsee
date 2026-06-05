export function LocationMap() {
  // Stuthagen 23, 24113 Molfsee (OSM Nominatim): 54.2680182, 10.0707590
  // Using OpenStreetMap embed (no API key needed).
  const bbox = {
    left: 10.060759,
    bottom: 54.2580182,
    right: 10.080759,
    top: 54.2780182,
  };
  const marker = { lat: 54.2680182, lon: 10.070759 };

  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    `${bbox.left},${bbox.bottom},${bbox.right},${bbox.top}`,
  )}&layer=mapnik&marker=${encodeURIComponent(`${marker.lat},${marker.lon}`)}`;

  const link = `https://www.openstreetmap.org/?mlat=${marker.lat}&mlon=${marker.lon}#map=16/${marker.lat}/${marker.lon}`;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[var(--radius)] border border-card-border bg-card">
      <iframe
        title="Map: Molfsee region"
        src={src}
        className="h-full w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-3 right-3 rounded-md border border-card-border bg-background/90 px-3 py-1.5 text-xs text-foreground/80 backdrop-blur hover:text-foreground"
      >
        Open full map
      </a>
    </div>
  );
}
