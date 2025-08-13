import { Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, Select, FormControlLabel, MenuItem } from "@mui/material";
import { useAtom } from "jotai";
import { atom } from "jotai/vanilla";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormDefinition } from "../../../forms/FormDefinition";
import { DocMarkerContext } from "../DocMarkerContext";

export const isOpenAtom = atom(false)

export function CreateFileDialog() {
  const { fileStateManager } = useContext(DocMarkerContext);

  const [isOpen, setIsOpen] = useAtom(isOpenAtom)

  const [formId, setFormId] = useState(FormDefinition.DEFAULT_FORM_ID)

  const { t } = useTranslation("createFileDialog")

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <DialogTitle>{t("title")}</DialogTitle>
      <DialogContent dividers>
        
        <Typography variant="body1" gutterBottom>
        { t("chooseForm") }
        </Typography>

        <Select
          value={formId}
          onChange={e => setFormId(e.target.value)}
          fullWidth={false}
          variant="outlined"
          size="small"
          displayEmpty
          sx={{ mb: 1 }}
        >
          {FormDefinition.ALL_FORM_IDS.map(id => (
            <MenuItem value={id} key={id}>
              {id}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  ml: 2,
                  display: id === FormDefinition.DEFAULT_FORM_ID ? "inline" : "none"
                }}
              >{ t("defaultValue") }</Typography>
            </MenuItem>
          ))}
        </Select>

        <Typography variant="body2" gutterBottom>
          { t("defaultValueExplanation") }
        </Typography>

      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => setIsOpen(false)}
        >
          { t("cancel") }
        </Button>
        <Button
          autoFocus
          variant="contained"
          onClick={() => {
            fileStateManager.createNewFile(formId)
            setIsOpen(false)
          }}
        >
          { t("create") }
        </Button>
      </DialogActions>
    </Dialog>
  )
}