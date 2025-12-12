export interface Event {
  id: number;
  userId: number;
  name: string;
  additionalAttributes?: Record<string, string>;
}
