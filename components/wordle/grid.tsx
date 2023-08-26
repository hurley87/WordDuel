import Tile, { TileProps } from '@/components/wordle/tile';

type Props = {
  data: TileProps[][];
};

export const GridRow = (props: { data: TileProps[] }) => {
  return (
    <div className="grid grid-cols-5 gap-4">
      {props.data.map((tile) => (
        <Tile
          key={`${tile.cursor.y}-${tile.cursor.x}-${tile.variant}`}
          variant={tile.variant}
          cursor={tile.cursor}
        >
          {tile.children}
        </Tile>
      ))}
    </div>
  );
};

export default function Grid(props: Props) {
  return (
    <div className="m-auto grid h-min max-w-sm gap-2 mb-0">
      {props.data.map((row, i) => (
        <div key={`row-${i}`} className="grid grid-cols-5 gap-2">
          {row.map((tile, j) => (
            <Tile
              key={`${i} - ${j}`}
              variant={tile.variant}
              cursor={tile.cursor}
              delay={j * 0.1}
            >
              {tile.children}
            </Tile>
          ))}
        </div>
      ))}
    </div>
  );
}
