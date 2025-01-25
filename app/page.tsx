"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "../components/ui/button";

export default function Home() {
  const [totalAmount, setTotalAmount] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = () => {
    const amount = parseFloat(totalAmount);
    const people = parseInt(numberOfPeople, 10);
    if (!isNaN(amount) && !isNaN(people) && people > 0) {
      setResult(amount / people);
    } else {
      setResult(null);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-2xl font-bold">割り勘アプリ</h1>
        <div className="flex flex-col gap-4">
          <input
            type="number"
            placeholder="合計金額"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="人数"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(e.target.value)}
            className="border p-2 rounded"
          />
          <Button onClick={handleCalculate}>計算する</Button>
        </div>
        {result !== null && (
          <div className="mt-4">
            <p>一人当たりの金額: {result.toFixed(2)} 円</p>
          </div>
        )}
      </main>
    </div>
  );
}