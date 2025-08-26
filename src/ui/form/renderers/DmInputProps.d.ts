export interface DmInputProps {
  readonly fieldId: string;
  readonly htmlId: string;
  readonly onFocus: () => void;
  readonly observeChange: (newData: any) => void;
  readonly isFieldActive: boolean;
}
