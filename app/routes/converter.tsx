import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function meta() {
  return [
    { title: "Converter - Symbol DevToys" },
    { name: "description", content: "Convert various values to each other." },
  ];
}

export default function Converter() {
  const { t } = useTranslation();

  // ネットワーク時間変換の状態
  const [networkTime, setNetworkTime] = useState("");
  const [dateTimeString, setDateTimeString] = useState("");

  // Hex string encode/decode state
  const [hexString, setHexString] = useState("");
  const [utf8String, setUtf8String] = useState("");

  // アドレスエンデコの状態
  const [hexAddress, setHexAddress] = useState("");
  const [accountAddress, setAccountAddress] = useState("");

  // 仮実装：同じ値をそのまま表示
  const handleNetworkTimeChange = (value: string) => {
    setNetworkTime(value);
    setDateTimeString(value); // 仮実装
  };

  const handleDateTimeStringChange = (value: string) => {
    setDateTimeString(value);
    setNetworkTime(value); // 仮実装
  };

  const handleHexStringChange = (value: string) => {
    setHexString(value);
    setUtf8String(value); // 仮実装
  };

  const handleUtf8StringChange = (value: string) => {
    setUtf8String(value);
    setHexString(value); // 仮実装
  };

  const handleHexAddressChange = (value: string) => {
    setHexAddress(value);
    setAccountAddress(value); // 仮実装
  };

  const handleAccountAddressChange = (value: string) => {
    setAccountAddress(value);
    setHexAddress(value); // 仮実装
  };

  return (
    <div className="p-4">
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="space-y-2">
          <div className="flex items-center">
            <h1 className="font-bold text-gray-900 dark:text-gray-100">{t("converter.title")}</h1>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">{t("converter.subtitle")}</p>
        </div>

        {/* ネットワーク時間変換 */}
        <Card className="rounded-md py-4 w-full">
          <CardHeader>
            <CardTitle>ネットワーク時間変換</CardTitle>
            <CardDescription>
              Symbolネットワーク時間と現実の世界時間を相互変換します
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="network-time">ネットワーク時間</Label>
                <Input
                  id="network-time"
                  type="text"
                  placeholder="110097499"
                  value={networkTime}
                  onChange={(e) => handleNetworkTimeChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="datetime-string">ISO8601 DateTime String</Label>
                <Input
                  id="datetime-string"
                  type="text"
                  placeholder="2016-04-01T00:00:00.000Z"
                  value={dateTimeString}
                  onChange={(e) => handleDateTimeStringChange(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hex string encode/decode */}
        <Card>
          <CardHeader>
            <CardTitle>Hex String Encode/Decode</CardTitle>
            <CardDescription>
              Convert hex messages to readable strings and vice versa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="hex-string">16進数</Label>
                <Input
                  id="hex-string"
                  type="text"
                  placeholder="474F4F44204C55434B21"
                  value={hexString}
                  onChange={(e) => handleHexStringChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="utf8-string">UTF-8 String</Label>
                <Input
                  id="utf8-string"
                  type="text"
                  placeholder="GOOD LUCK!"
                  value={utf8String}
                  onChange={(e) => handleUtf8StringChange(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* アドレスのエンデコ */}
        <Card>
          <CardHeader>
            <CardTitle>アドレスのエンデコ</CardTitle>
            <CardDescription>
              Convert hex addresses to account addresses and vice versa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="hex-address">16進数アドレス</Label>
                <Input
                  id="hex-address"
                  type="text"
                  placeholder="906E4E3E03590AD14EF56EA4F7ED3980C1C6248B796C784556"
                  value={hexAddress}
                  onChange={(e) => handleHexAddressChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-address">Account Address</Label>
                <Input
                  id="account-address"
                  type="text"
                  placeholder="SBXE4P-QDLEFN-CTXVN2-SPP3JZ-QDA4MJ-ELPFWH-QRKW"
                  value={accountAddress}
                  onChange={(e) => handleAccountAddressChange(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
