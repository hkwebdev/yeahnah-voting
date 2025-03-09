import PocketBase, { RecordModel } from "pocketbase";

const HOST = import.meta.env.VITE_POCKETBASE_HOST ?? "/";

export const pocketbase = new PocketBase(HOST);

export type Artwork = RecordModel & {
  name: string;
  author: string;
  link: string;
  description: string;
  media: string[];
  created: string;
  updated: string;
};

export type Event = RecordModel & {
  name: string;
  date: string;
  created: string;
  updated: string;
};

export type Vote = {
  id?: string;
  artwork: string;
  event: string;
  email?: string;
  message?: string;
  name?: string;
  yeahnah: boolean;
};
