import { useTranslation } from "react-i18next";
import { SidebarInset } from "~/components/ui/sidebar";
import { PageHeader } from "~/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
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

  useEffect(() => {
    if (privateKey.length < 64) {
      return;
    }

    const facade = new SymbolFacade(Network[selectedNetwork]);
    const account = facade.createAccount(new PrivateKey(privateKey));
    setPublicKey(account.publicKey.toString());
    setAddress(account.address.toString());
  }, [privateKey, selectedNetwork]);

  return (
    <SidebarInset>
      <PageHeader title={t("keypair.title")} subtitle={t("keypair.subtitle")}>
        <NodeSelector />
      </PageHeader>

      <div className="p-4 space-y-4">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle></CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="private-key">秘密鍵</Label>
                <Input
                  type="text"
                  id="private-key"
                  name="private-key"
                  pattern="[a-fA-F\d]+"
                  maxLength={64}
                  placeholder=""
                  autoFocus
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                />
                <Button type="submit" className="w-full" onClick={() => setPrivateKey(PrivateKey.random().toString())}>
                  generate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle></CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="public-key">公開鍵</Label>
                <Input type="text" id="public-key" name="public-key" value={publicKey} readOnly />
              </div>
              <div>
                <Label htmlFor="address">アドレス</Label>
                <Input type="text" id="address" name="address" value={address} readOnly />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  );
}
