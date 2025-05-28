import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger>
        <SelectValue placeholder={t("settings.general.language.label")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ja">{t("settings.general.language.options.ja")}</SelectItem>
        <SelectItem value="en">{t("settings.general.language.options.en")}</SelectItem>
      </SelectContent>
    </Select>
  );
}
