
import { getDatabase, ref, set, update } from "firebase/database";
import { FIREBASE_PATHS, TICKET_FIELDS } from "../constants";

export const createTicket = async (ticketId: string, data: any) => {
  const db = getDatabase();
  await set(ref(db, `${FIREBASE_PATHS.tickets}/${ticketId}`), data);
};

export const updateTicketStatus = async (ticketId: string, status: string) => {
  const db = getDatabase();
  await update(ref(db, `${FIREBASE_PATHS.tickets}/${ticketId}`), {
    [TICKET_FIELDS.status]: status,
    [TICKET_FIELDS.updatedAt]: Date.now(),
  });
};
