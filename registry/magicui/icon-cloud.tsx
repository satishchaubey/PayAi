"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import styles from "./icon-cloud.module.css";

type IconCloudProps = {
  images: string[];
};

export function IconCloud({ images }: IconCloudProps) {
  const [failed, setFailed] = useState<Record<number, boolean>>({});

  const rows = useMemo(() => {
    const valid = images.filter((_, index) => !failed[index]);
    const rowCount = 3;
    const perRow = Math.ceil(valid.length / rowCount);
    return Array.from({ length: rowCount }, (_, rowIndex) =>
      valid.slice(rowIndex * perRow, rowIndex * perRow + perRow)
    ).filter((row) => row.length > 0);
  }, [images, failed]);

  return (
    <div className={styles.scene}>
      {rows.map((row, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className={`${styles.row} ${rowIndex % 2 === 0 ? styles.moveLeft : styles.moveRight}`}
        >
          {row.map((src, index) => (
            <div key={`${src}-${rowIndex}-${index}`} className={styles.item}>
              <Image
                src={src}
                alt=""
                width={52}
                height={52}
                className={styles.image}
                unoptimized
                onError={() => {
                  const originalIndex = images.findIndex((img) => img === src);
                  if (originalIndex >= 0) {
                    setFailed((prev) => ({ ...prev, [originalIndex]: true }));
                  }
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
