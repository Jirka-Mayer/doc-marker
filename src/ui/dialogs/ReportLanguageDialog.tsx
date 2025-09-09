import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { atom, useAtom } from "jotai";
import { useTranslation } from "react-i18next";
import {
  IsoLanguage,
  IsoLanguageCodes,
  IsoLanguageLabels,
} from "../../IsoLanguage";
import * as reportStore from "../../state/reportStore";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";

export const isOpenAtom = atom<boolean>(false);

export function ReportLanguageDialog() {
  const { t } = useTranslation("reportLanguageButtonAndDialog");

  const [isOpen, setIsOpen] = useAtom(isOpenAtom);

  const [reportLanguage, setReportLanguage] = useAtom(
    reportStore.reportLanguageAtom,
  );

  const [temporaryReportLanguage, setTemporaryReportLanguage] =
    useState<IsoLanguage | null>(reportLanguage);

  const [searchPhrase, setSearchPhrase] = useState<string>("");

  // when the dialog is openned
  useEffect(() => {
    if (isOpen) {
      setTemporaryReportLanguage(reportLanguage);
      setSearchPhrase("");
    }
  }, [isOpen]);

  function handleChange(event) {
    const newLanguage: IsoLanguage | null = event.target.value || null;
    setTemporaryReportLanguage(newLanguage);
  }

  function handleOk() {
    setReportLanguage(temporaryReportLanguage);
    setIsOpen(false);
  }

  function handleCancel() {
    setIsOpen(false);
  }

  const searchFilter = (language: IsoLanguage): boolean => {
    // no filtering enabled
    if (searchPhrase === "") return true;

    // the selected language is always shown
    if (temporaryReportLanguage === language) return true;

    // filter by substring (the label or the language code)
    return (
      IsoLanguageLabels[language]
        .toLowerCase()
        .includes(searchPhrase.toLowerCase()) || language.includes(searchPhrase)
    );
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <DialogTitle>{t("dialog.title")}</DialogTitle>
      <DialogContent dividers>
        <TextField
          autoFocus
          id="report-language-search-field"
          label={t("dialog.search")}
          variant="outlined"
          size="small"
          fullWidth
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
          sx={{ mb: 1 }}
          value={searchPhrase}
          onChange={(e) => setSearchPhrase(e.target.value)}
        />
        <RadioGroup
          name="locales"
          value={temporaryReportLanguage || ""}
          onChange={handleChange}
        >
          <FormControlLabel
            value=""
            key="null"
            control={<Radio />}
            label={t("dialog.unknownLanguage")}
          />
          {IsoLanguageCodes.filter(searchFilter).map((language) => (
            <FormControlLabel
              value={language}
              key={language}
              control={<Radio />}
              label={`(${language}) ${IsoLanguageLabels[language]}`}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>{t("dialog.cancel")}</Button>
        <Button variant="contained" onClick={handleOk}>
          {t("dialog.ok")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
