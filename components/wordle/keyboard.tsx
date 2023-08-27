import { useCallback, useEffect } from 'react';
import { match } from 'ts-pattern';
import { always, propEq } from 'ramda';
import tw from 'tailwind-styled-components';

import type { GameTile } from '@/interfaces';
import { Button } from '../ui/button';
import { Icons } from '../icons';

export const BackspaceIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="15"
    viewBox="0 0 24 24"
    width="15"
  >
    <path
      fill="currentcolor"
      d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"
    ></path>
  </svg>
);

export const MAPPABLE_KEYS = {
  backspace: <Icons.delete className="h-6 w-6" />,
  enter: 'ENTER',
} as const;

export type MappableKeys = keyof typeof MAPPABLE_KEYS;

export function isMappableKey(key: string): key is MappableKeys {
  return key in MAPPABLE_KEYS;
}

const KEYS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ''],
  ['enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'backspace'],
];

export const VALID_KEYS = KEYS.flatMap((row) =>
  row.map((key) => key.toLowerCase())
).filter(Boolean);

function isValidKey(key: string) {
  return VALID_KEYS.includes(key);
}

type Props = {
  onKeyPress: (key: string) => void;
  disabled?: boolean;
  usedKeys: GameTile[];
};

export default function Keyboard({ onKeyPress, disabled, usedKeys }: Props) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (isValidKey(e.key.toLowerCase())) {
        onKeyPress(e.key.toLowerCase());
      }
    }

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyPress]);

  const getKeyColors: any = useCallback(
    (key: string) => {
      const tiles = usedKeys.filter((k) => k.children === key);
      if (tiles.length > 0) {
        const tile =
          tiles.find(propEq('variant', 'correct')) ??
          tiles.find(propEq('variant', 'present')) ??
          tiles.find(propEq('variant', 'absent'));

        return {
          color: tile?.variant ? 'white' : 'black',
          background: match(tile?.variant ?? 'empty')
            .with('absent', always('rgb(75 85 99)'))
            .with('correct', always('rgb(34 197 94)'))
            .with('present', always('rgb(234 179 8)'))
            .otherwise(always('')),
        };
      }

      return {};
    },
    [usedKeys]
  );

  return (
    <div className="grid h-min select-none gap-2 w-full m-0 pt-8 p-1">
      {KEYS.map((row, i) => (
        <div
          className="flex touch-manipulation justify-evenly gap-2"
          key={`row-${i}`}
        >
          {row.map((key, j) =>
            key === '' ? (
              <div key={`empty-${j}`} className="w-2" />
            ) : (
              <Button
                className="font-bold active:opacity-60 md:p-3 p-2 py-6 rounded-md md:text-xl sm:text-sm text-md font-bold transition-all w-full shadow-2xl h-[58px]"
                disabled={disabled}
                key={key}
                onClick={onKeyPress.bind(null, key.toLowerCase())}
                style={
                  disabled ? { opacity: 0.5 } : getKeyColors(key.toLowerCase())
                }
              >
                {isMappableKey(key) ? MAPPABLE_KEYS[key] : key}
              </Button>
            )
          )}
        </div>
      ))}
    </div>
  );
}

export const KeyButton = tw.button`
  
`;
