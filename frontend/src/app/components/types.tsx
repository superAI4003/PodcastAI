export interface PromptType {
  id: number;
  title: string;
  description: string;
  }
export interface NewPromptType{
  title: string;
  description: string;
}
export enum ModalStatus {
  Closed = 'Closed',
  Download = 'Download',
  EditModal = 'EditModal',
  DeleteModal = 'DeleteModal',
  SetStartIndex= 'SetStartIndex',
  HistoryModal = 'HistoryModal'
  // Add more modal states as needed
}

export interface TimerType{
  scriptTimer:string[];
  audioTimer:string[];
  totalScriptTimer:0;
  totalAudioTimer:0;
}