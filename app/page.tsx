"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Label } from "../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"

interface Person {
  name: string;
  items: { name: string; amount: number }[];
}

export default function Home() {
  const [totalAmount, setTotalAmount] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [people, setPeople] = useState<Person[]>([]);
  const [name, setName] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [itemName, setItemName] = useState("");
  const [itemAmount, setItemAmount] = useState("");
  const [splitMethod, setSplitMethod] = useState("equal");
  const [isEditing, setIsEditing] = useState(false);
  const [totalRegisteredAmount, setTotalRegisteredAmount] = useState(0);
  const [equalAmount, setEqualAmount] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showAddPersonCard, setShowAddPersonCard] = useState(false);

  const handleAddPerson = () => {
    const newPerson: Person = { name, items: [] };
    setPeople([...people, newPerson]);
    setName("");
    setShowAddPersonCard(false);
  };

  const handleAddItem = () => {
    if (selectedPerson) {
      const updatedPeople = people.map(person => {
        if (person.name === selectedPerson.name) {
          return {
            ...person,
            items: [...person.items, { name: itemName, amount: parseFloat(itemAmount) }],
          };
        }
        return person;
      });
      setPeople(updatedPeople);
      setItemName("");
      setItemAmount("");
      setSelectedPerson(null);
    }
  };

  const handleEditPerson = () => {
    if (selectedPerson) {
      const updatedPeople = people.map(person => {
        if (person.name === selectedPerson.name) {
          return {
            ...person,
            name: name,
          };
        }
        return person;
      });
      setPeople(updatedPeople);
      setName("");
      setSelectedPerson(null);
      setIsEditing(false);
    }
  };

  const handleCalculate = () => {
    if (splitMethod === "equal") {
      const amount = Math.floor(parseFloat(totalAmount));
      const peopleCount = parseInt(numberOfPeople, 10);
      if (!isNaN(amount) && !isNaN(peopleCount) && peopleCount > 0) {
        const equalAmount = Math.floor(amount / peopleCount);
        setEqualAmount(equalAmount);
        const results = Array.from({ length: peopleCount }, (_, index) => ({
          name: `Person ${index + 1}`,
          items: [{ name: "Equal Share", amount: equalAmount }],
        }));
        setPeople(results);
      }
    } else if (splitMethod === "random") {
      const amount = Math.floor(parseFloat(totalAmount));
      const peopleCount = people.length;
      if (!isNaN(amount) && peopleCount > 0) {
        let remainingAmount = amount;
        const results = people.map((person, index) => {
          const randomAmount = index === peopleCount - 1 ? remainingAmount : Math.floor(Math.random() * remainingAmount);
          remainingAmount -= randomAmount;
          return {
            ...person,
            items: [{ name: "Random Share", amount: randomAmount }],
          };
        });
        setPeople(results);
      }
    } else {
      const total = Math.floor(people.reduce((sum, person) => {
        return sum + person.items.reduce((personSum, item) => personSum + item.amount, 0);
      }, 0));
      setTotalAmount(total.toString());
      setTotalRegisteredAmount(total);

      const results = people.map(person => ({
        name: person.name,
        items: person.items,
      }));
      setPeople(results);
    }
  };

  const handleClear = () => {
    setTotalAmount("");
    setNumberOfPeople("");
    setPeople([]);
    setSelectedPerson(null);
    setItemName("");
    setItemAmount("");
    setTotalRegisteredAmount(0);
    setEqualAmount(null);
  };

  const handleSplitMethodChange = (method: string) => {
    setSplitMethod(method);
    handleClear();
  };

  return (
    <div className="relative">
      {selectedPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{isEditing ? "編集" : "追加"} {selectedPerson.name}のアイテム</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {isEditing ? (
                  <input
                    type="text"
                    placeholder="名前"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="アイテム名"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      className="border p-2 rounded w-full"
                    />
                    <input
                      type="number"
                      placeholder="金額"
                      value={itemAmount}
                      onChange={(e) => setItemAmount(e.target.value)}
                      className="border p-2 rounded w-full"
                    />
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              {isEditing ? (
                <Button onClick={handleEditPerson}>保存</Button>
              ) : (
                <Button onClick={handleAddItem}>追加</Button>
              )}
              <Button onClick={() => { setSelectedPerson(null); setIsEditing(false); }}>キャンセル</Button>
            </CardFooter>
          </Card>
        </div>
      )}
      {showAddPersonCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>人を追加</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="名前"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button onClick={handleAddPerson}>追加</Button>
              <Button onClick={() => setShowAddPersonCard(false)}>キャンセル</Button>
            </CardFooter>
          </Card>
        </div>
      )}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-3xl">
            <CardHeader>
              <CardTitle>履歴</CardTitle>
            </CardHeader>
            <CardContent>
              <Table className="w-full">
                <TableCaption>履歴</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">名前</TableHead>
                    <TableHead className="w-[100px]">アイテム</TableHead>
                    <TableHead className="w-[100px]">金額</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {people.map((person, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{person.name}</TableCell>
                      <TableCell>
                        <ul>
                          {person.items.map((item, itemIndex) => (
                            <li key={itemIndex}>{item.name}</li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>
                        <ul>
                          {person.items.map((item, itemIndex) => (
                            <li key={itemIndex}>{Math.floor(item.amount)} 円</li>
                          ))}
                        </ul>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button onClick={() => setShowHistory(false)}>閉じる</Button>
            </CardFooter>
          </Card>
        </div>
      )}
      <div className={`grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] ${selectedPerson || showHistory || showAddPersonCard ? 'blur-sm' : ''}`}>
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <div className="flex justify-center w-full">
            <Image
              className="dark:invert"
              src="/img/logo.png"
              alt="Custom logo"
              width={180}
              height={38}
              priority
            />
          </div>
          <div className="flex flex-col gap-4">
            <RadioGroup defaultValue="equal" onValueChange={handleSplitMethodChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="equal" id="equal" />
                <Label htmlFor="equal">均等に割り勘</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="registered" id="registered" />
                <Label htmlFor="registered">登録して割り勘</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="random" id="random" />
                <Label htmlFor="random">ランダムに割り勘</Label>
              </div>
            </RadioGroup>
            {splitMethod === "equal" && (
              <input
                type="number"
                placeholder="合計金額"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="border p-2 rounded"
              />
            )}
            {splitMethod === "equal" && (
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="人数"
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(e.target.value)}
                  className="border p-2 rounded"
                />
              </div>
            )}
            {splitMethod === "random" && (
              <input
                type="number"
                placeholder="合計金額"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="border p-2 rounded"
              />
            )}
            {splitMethod === "random" && (
              <Button onClick={() => setShowAddPersonCard(true)}>人を追加</Button>
            )}
            {splitMethod === "equal" && (
              <div className="flex gap-2">
                <Button onClick={handleCalculate}>計算する</Button>
                <Button onClick={handleClear}>クリア</Button>
              </div>
            )}
            {splitMethod === "random" && (
              <div className="flex gap-2">
                <Button onClick={handleCalculate}>漢気を見せろ！</Button>
                <Button onClick={handleClear}>クリア</Button>
              </div>
            )}
            {splitMethod === "registered" && (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="名前"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border p-2 rounded"
                />
                <Button onClick={handleAddPerson}>追加</Button>
              </div>
            )}
            {splitMethod === "registered" && (
              <Button onClick={() => setShowHistory(true)}>履歴</Button>
            )}
          </div>
          {splitMethod === "random" && (
            <>
              <div className="mt-4 w-full">
                <h2 className="text-xl font-bold">登録された人</h2>
                <Table className="w-full">
                  <TableCaption>登録された人の一覧</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">名前</TableHead>
                      <TableHead className="w-[100px]">合計金額</TableHead>
                      <TableHead className="w-[100px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {people.map((person, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{person.name}</TableCell>
                        <TableCell>
                          {Math.floor(person.items.reduce((sum, item) => sum + item.amount, 0))} 円
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => { setSelectedPerson(person); setIsEditing(true); setName(person.name); }}>編集</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
          {splitMethod === "registered" && (
            <>
              <div className="mt-4 w-full">
                <h2 className="text-xl font-bold">登録された人</h2>
                <Table className="w-full">
                  <TableCaption>登録された人の一覧</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">名前</TableHead>
                      <TableHead className="w-[100px]">合計金額</TableHead>
                      <TableHead className="w-[100px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {people.map((person, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{person.name}</TableCell>
                        <TableCell>
                          {Math.floor(person.items.reduce((sum, item) => sum + item.amount, 0))} 円
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => { setSelectedPerson(person); setIsEditing(false); setItemName(""); setItemAmount(""); }}>登録</Button>
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => { setSelectedPerson(person); setIsEditing(true); setName(person.name); }}>編集</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 text-xl font-bold">
                  全体の合計金額: {Math.floor(totalRegisteredAmount)} 円
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleCalculate}>計算する</Button>
                <Button onClick={handleClear}>クリア</Button>
              </div>
            </>
          )}
          {equalAmount !== null && (
            <div className="mt-4 text-xl font-bold">
              一人当たりの金額: {Math.floor(equalAmount)} 円
            </div>
          )}
        </main>
      </div>
    </div>
  );
}