
export enum OrderStatus {
  Pending = "Pendente",
  InProgress = "Em Reparo",
  AwaitingApproval = "Aguardando Aprovação",
  Completed = "Concluído",
  Canceled = "Cancelado",
}

export const STATUS_COLORS: { [key in OrderStatus]: string } = {
  [OrderStatus.Pending]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  [OrderStatus.InProgress]: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  [OrderStatus.AwaitingApproval]: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  [OrderStatus.Completed]: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  [OrderStatus.Canceled]: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};
