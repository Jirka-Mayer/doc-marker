import { Box, Button, Typography } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { useAtomValue, useSetAtom } from "jotai";
import { reportStore } from "../../state";
import { IsoLanguage, IsoLanguageLabels } from "../../IsoLanguage";
import { useTranslation } from "react-i18next";
import { isOpenAtom } from "../dialogs/ReportLanguageDialog";

export function ReportLanguageButton() {
  const { t } = useTranslation("reportLanguageButtonAndDialog");

  const reportLanguage = useAtomValue<IsoLanguage | null>(
    reportStore.reportLanguageAtom,
  );

  const setDialogOpen = useSetAtom(isOpenAtom);

  const buttonText = reportLanguage || t("button.selectLanguageButton");
  const message =
    reportLanguage === null
      ? t("button.selectLanguageMessage")
      : IsoLanguageLabels[reportLanguage];

  return (
    <Box
      sx={{
        maxWidth: 700,
        boxSizing: "border-box",
        margin: "0 auto",
        padding: 1,
        mb: 2,
        border: "1px solid #eeeff0",
        borderRadius: 1,
      }}
    >
      <Button
        variant="text"
        color="primary"
        startIcon={<LanguageIcon />}
        onClick={() => setDialogOpen(true)}
      >
        {buttonText}
      </Button>
      <Typography variant="caption" sx={{ ml: 1, opacity: 0.6 }}>
        {message}
      </Typography>
    </Box>
  );
}
