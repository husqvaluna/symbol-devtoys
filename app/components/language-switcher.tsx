import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {t("settings.general.language.label")}
      </label>
      <Select value={i18n.language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t("settings.general.language.label")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ja">
            {t("settings.general.language.options.ja")}
          </SelectItem>
          <SelectItem value="en">
            {t("settings.general.language.options.en")}
          </SelectItem>
        </SelectContent>
      </Select>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {t("settings.general.language.description")}
      </p>
    </div>
  );
}
