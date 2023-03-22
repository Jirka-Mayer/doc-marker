import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useAtom } from "jotai";
import { atom } from "jotai/vanilla";
import { useTranslation } from "react-i18next";
import { Locale } from "../../../locales/Locale"

export const isOpenAtom = atom(false)

export function ChangeLocaleDialog() {
  const [isOpen, setIsOpen] = useAtom(isOpenAtom)

  const { t, i18n } = useTranslation("changeLocaleDialog")

  function handleChange(event) {
    const locale = Locale.get(event.target.value)
    locale.applyTo(i18n)
    locale.persist()
  }

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <DialogTitle>{t("title")} [{ i18n.language }]</DialogTitle>
      <DialogContent dividers>
        <RadioGroup
          name="locales"
          value={i18n.language}
          onChange={handleChange}
        >
          {Object.values(Locale.ALL_LOCALES).map(locale => (
            <FormControlLabel
              value={locale.id}
              key={locale.id}
              control={<Radio />}
              label={locale.title}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => setIsOpen(false)}>
          { t("ok") }
        </Button>
      </DialogActions>
    </Dialog>
  )
}