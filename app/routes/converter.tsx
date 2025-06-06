import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Address, Network } from "symbol-sdk/symbol";
import { NodeSelector } from "~/components/node-selector";
import { PageHeader } from "~/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { SidebarInset } from "~/components/ui/sidebar";
import { useNetworkSelection } from "~/hooks/use-network-selection";
import {
  datetimeStringToNetworkTimestamp,
  decodeAddress,
  encodeAddress,
  encodeNamespace,
  fromHexToUTF8,
  fromUTF8ToHex,
  networkTimestampToDatetimeString,
} from "~/logics/convert";

export function meta() {
  return [{ title: "Converter - Symbol DevToys" }, { name: "description", content: "Convert various values to each other." }];
}

export default function Converter() {
  const { t } = useTranslation();
  const { selectedNetwork } = useNetworkSelection();

  const [NetworkTimestamp, setNetworkTimestamp] = useState("");
  const [dateTimeString, setDateTimeString] = useState("");

  const [hexString, setHexString] = useState("");
  const [utf8String, setUtf8String] = useState("");

  const [hexAddress, setHexAddress] = useState("");
  const [accountAddress, setAccountAddress] = useState("");

  const [namespaceString, setNamespaceString] = useState("");
  const [namespaceId, setNamespaceId] = useState("");

  const handleNetworkTimestampChange = (value: string) => {
    setNetworkTimestamp(value);
    setDateTimeString(networkTimestampToDatetimeString(BigInt(value), Network[selectedNetwork]).toISOString());
  };

  const handleDateTimeStringChange = (value: string) => {
    setDateTimeString(value);
    setNetworkTimestamp(datetimeStringToNetworkTimestamp(value, Network[selectedNetwork]).toString());
  };

  const handleHexStringChange = (value: string) => {
    setHexString(value);
    setUtf8String(fromHexToUTF8(value));
  };

  const handleUtf8StringChange = (value: string) => {
    setUtf8String(value);
    setHexString(fromUTF8ToHex(value));
  };

  const handleHexAddressChange = (value: string) => {
    setHexAddress(value);
    setAccountAddress(encodeAddress(value).toString());
  };

  const handleAccountAddressChange = (value: string) => {
    setAccountAddress(value);
    setHexAddress(decodeAddress(Address.fromDecodedAddressHexString(value)));
  };

  const handleNamespaceStringChange = (value: string) => {
    setNamespaceString(value);
    const namespaceId = encodeNamespace(value);
    setNamespaceId(namespaceId.toString());
  };

  return (
    <SidebarInset>
      <PageHeader title={t("converter.title")} subtitle={t("converter.subtitle")}>
        <NodeSelector />
      </PageHeader>

      <div className="p-2">
        <div className="space-y-4">
          {/* ネットワーク時間変換 */}
          <Card>
            <CardHeader>
              <CardTitle>Network Time Conversion</CardTitle>
              <CardDescription>Convert between real-world time and Symbol network time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="network-time">Network Time</Label>
                  <Input
                    id="network-time"
                    type="number"
                    min={0}
                    placeholder="110097499"
                    value={NetworkTimestamp}
                    onChange={(e) => handleNetworkTimestampChange(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
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
              <CardDescription>Convert hex messages to readable strings and vice versa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="hex-string">Hexadecimal</Label>
                  <Input
                    id="hex-string"
                    type="text"
                    placeholder="474F4F44204C55434B21"
                    value={hexString}
                    onChange={(e) => handleHexStringChange(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
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

          <Card>
            <CardHeader>
              <CardTitle>Address Encode/Decode</CardTitle>
              <CardDescription>Convert hex addresses to account addresses and vice versa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="hex-address">Hexadecimal Address</Label>
                  <Input
                    id="hex-address"
                    type="text"
                    placeholder="906E4E3E03590AD14EF56EA4F7ED3980C1C6248B796C784556"
                    value={hexAddress}
                    onChange={(e) => handleHexAddressChange(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
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

          {/* Namespace to ID Conversion */}
          <Card>
            <CardHeader>
              <CardTitle>Namespace to ID Conversion</CardTitle>
              <CardDescription>Convert namespace strings to ID values (one-way conversion only)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="namespace-string">Namespace String</Label>
                  <Input
                    id="namespace-string"
                    type="text"
                    placeholder="symbol.xym"
                    value={namespaceString}
                    onChange={(e) => handleNamespaceStringChange(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="namespace-id">Namespace ID (Read-only)</Label>
                  <Input
                    id="namespace-id"
                    type="text"
                    placeholder="Generated ID will appear here"
                    value={namespaceId}
                    readOnly
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  );
}
