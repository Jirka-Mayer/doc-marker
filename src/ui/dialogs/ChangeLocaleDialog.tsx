import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useAtom } from "jotai";
import { atom } from "jotai/vanilla";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { DocMarkerContext } from "../DocMarkerContext";

export const isOpenAtom = atom(false);

export function ChangeLocaleDialog() {
  const { localesRepository } = useContext(DocMarkerContext);

  const [isOpen, setIsOpen] = useAtom(isOpenAtom);

  const { t, i18n } = useTranslation("changeLocaleDialog");

  function handleChange(event) {
    const locale = localesRepository.getLocale(event.target.value);
    locale.applyTo(i18n);
    localesRepository.persistCurrentLocaleId(i18n);
  }

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <DialogTitle>
        {t("title")} [{i18n.language}]
      </DialogTitle>
      <DialogContent dividers>
        <RadioGroup
          name="locales"
          value={i18n.language}
          onChange={handleChange}
        >
          {localesRepository.allLocaleIds.map((localeId) => (
            <FormControlLabel
              value={localeId}
              key={localeId}
              control={<Radio />}
              label={localesRepository.getLocale(localeId).definition.title}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => setIsOpen(false)}>
          {t("ok")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
