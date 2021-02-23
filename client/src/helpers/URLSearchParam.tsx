import { useLocation } from 'react-router-dom';

export default function URLSearchParam(name: string) {
  return new URLSearchParams(useLocation().search).get(name);
}
