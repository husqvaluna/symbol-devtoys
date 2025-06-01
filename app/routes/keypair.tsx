import { useTranslation } from "react-i18next";
import { SidebarInset } from "~/components/ui/sidebar";
import { PageHeader } from "~/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { useNetworkSelection } from "~/hooks/use-network-selection";
import { NodeSelector } from "~/components/node-selector";
import { useEffect, useState } from "react";
import { PrivateKey } from "symbol-sdk";
import { Network, SymbolFacade } from "symbol-sdk/symbol";
import { copyToClipboard } from "~/lib/utils";

export function meta() {
  return [
    { title: "Keypair - Symbol DevToys" },
    { name: "description", content: "Generate new keypairs and derive public keys and addresses from private keys." },
  ];
}

export default function Keypair() {
  const { t } = useTranslation();
  const { selectedNetwork } = useNetworkSelection();

  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [address, setAddress] = useState("");
  const [vanity, setVanity] = useState("");

  useEffect(() => {
    if (privateKey.length < 64) {
      return;
    }

    const facade = new SymbolFacade(Network[selectedNetwork]);
    const account = facade.createAccount(new PrivateKey(privateKey));

    setPublicKey(account.publicKey.toString());
    setAddress(account.address.toString());
  }, [privateKey, selectedNetwork]);

  function generateNewKey() {
    const facade = new SymbolFacade(Network[selectedNetwork]);
    let key = "";
    while (true) {
      key = PrivateKey.random().toString();
      const account = facade.createAccount(new PrivateKey(key));
      if (vanity === "" || account.address.toString().charAt(1) === vanity) {
        break;
      }
    }
    setPrivateKey(key);
  }

  return (
    <SidebarInset>
      <PageHeader title={t("keypair.title")} subtitle={t("keypair.subtitle")}>
        <NodeSelector />
      </PageHeader>

      <div className="p-2">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>キーペア生成</CardTitle>
              <CardDescription>新しい秘密鍵を生成し、公開鍵とアドレスを導出します。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="private-key">秘密鍵</Label>
                <Input
                  type="text"
                  id="private-key"
                  name="private-key"
                  pattern="[a-fA-F\d]+"
                  maxLength={64}
                  placeholder="秘密鍵を入力または生成してください"
                  autoFocus
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Button type="button" className="w-full" onClick={() => generateNewKey()}>
                  新しいキーペアを生成
                </Button>
                <div className="pt-2 space-y-2">
                  <Label>アドレスの先頭文字（バニティアドレス）</Label>
                  <RadioGroup defaultValue="" className="flex space-x-4" onValueChange={setVanity}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="" id="option-any" />
                      <Label htmlFor="option-any">Any</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="A" id="option-A" />
                      <Label htmlFor="option-A">A</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="B" id="option-B" />
                      <Label htmlFor="option-B">B</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="C" id="option-C" />
                      <Label htmlFor="option-C">C</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="D" id="option-D" />
                      <Label htmlFor="option-D">D</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>導出された情報</CardTitle>
              <CardDescription>入力された秘密鍵から導出された公開鍵とアドレスです。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="public-key">公開鍵</Label>
                <Input
                  type="text"
                  id="public-key"
                  name="public-key"
                  value={publicKey}
                  readOnly
                  className="font-mono bg-gray-50 dark:bg-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">アドレス</Label>
                <Input type="text" id="address" name="address" value={address} readOnly className="font-mono bg-gray-50 dark:bg-gray-800" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  );
}
