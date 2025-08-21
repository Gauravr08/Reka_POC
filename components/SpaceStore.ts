export type SpaceItem = {
  id: string;
  type: 'chat' | 'vision' | 'research';
  title: string;
  payload: any;
  createdAt: number;
};

export type Space = {
  id: string;
  name: string;
  items: SpaceItem[];
};

const KEY = 'reka_poc_spaces_v1';

export function loadSpaces(): Space[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) as Space[] : [];
}

export function saveSpaces(spaces: Space[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(spaces));
}
